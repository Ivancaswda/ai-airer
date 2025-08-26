import {NextRequest, NextResponse} from "next/server";
import getServerUser from "@/lib/auth-server";
import {GoogleGenerativeAI} from "@google/generative-ai";
import {safeParseJSON} from "@/app/api/aimodel/route";
import {aj} from "@/app/api/arcjet/route";
import {redirect} from "next/navigation";
import {handleGeminiError} from "@/lib/utils";


const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

const RECOMMENDATION_PROMPT = `
Ты — умный туристический ассистент. Задавай **по одному вопросу за раз** и жди ответа пользователя, прежде чем переходить к следующему вопросу.

Задавай вопросы строго в таком порядке:

1. Какой стиль путешествий тебе ближе? (например: "Приключения", "Отдых", "Культура", "Природа")
2. Какой климат ты предпочитаешь? (например: "Тропический", "Холодный", "Умеренный")
3. Какой у тебя бюджет для поездки? (например: "Низкий", "Средний", "Высокий")
4. Сколько времени у тебя есть для путешествия? (например: "1 неделя", "2 недели", "10 дней")

**СТРОГО ОБЯЗАТЕЛЕН JSON-ОТВЕТ**
Возвращай ровно один JSON-объект:

{
  "resp": "Твой следующий вопрос или ответ пользователю",
  "ui": "taste" | "climate" | "budget" | "time" | "destinationRecommendation" 
}

Если нельзя задать новый вопрос (ждёшь ответа на предыдущий), верни:

{
  "resp": "Я всё ещё жду ответа на предыдущий вопрос.",
  "ui": "waitingForUserInput"
}

⚠️ Никакого текста вне JSON, никаких пояснений, только JSON.

Правила:
- Принимать короткие ответы ровно в формате: стиль → ("Приключения", "Отдых", "Культура", "Природа"), климат → ("Тропический", "Холодный", "Умеренный"), бюджет → ("Низкий", "Средний", "Высокий").
- После всех ответов выдай рекомендацию страны.
`;

const RECOMMENDATION_FINAL_PROMPT = `
Используя ответы пользователя, сгенерируй рекомендацию страны для путешествия.  
Верни **строго JSON** в следующей структуре:

{
  "recommended_country": "string", // название страны
  "recommended_location": "string", // краткое описание рекомендуемого места в этой стране
  "reason": "string" // объяснение, почему это направление подходит под предпочтения пользователя
}

⚠️ Важно:
- Страна и локация должны быть реальными.
- Верни только JSON без пояснений и без markdown.
`;

export async function POST(req: NextRequest) {
    try {
        const { messages, isFinal } = await req.json();
        const user = await getServerUser();
        if (!user) {
            return NextResponse.json({ error: "No authorized" }, { status: 401 });
        }



        const isPrem = user?.isPrem ?? false;


        if (!user || !user.userId) {
            return NextResponse.json({ error: "No authorized"})
        }

        if (!user?.isPrem) {
            const decision = await aj.protect(req, { userId: user.userId, requested: 1 });

            if (decision.isDenied()) {
                return NextResponse.json({ error: "Free limit exceeded", redirect: "/premium" }, { status: 403 });
            }
        }

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const fullPrompt = [
            { role: "system", content: isFinal ? RECOMMENDATION_FINAL_PROMPT : RECOMMENDATION_PROMPT },
            ...messages.map(({ role, content }: any) => ({ role, content })),
        ];

        const result = await model.generateContent(fullPrompt.map(m => m.content).join("\n"));

        const parsed = safeParseJSON(result.response.text());
        if (!parsed.ok) {
            return NextResponse.json({ error: "Некорректный JSON от Gemini", raw: result.response.text() }, { status: 500 });
        }

        return NextResponse.json(parsed.data);

    } catch (err: any) {
        const error = handleGeminiError(err);
        console.error("❌ Ошибка в /api/budget Gemini SDK:", err);

        if (error.isLocationError) {
            return NextResponse.json({ error: error.message, code: "LOCATION_BLOCKED" }, { status: 403 });
        }
        if (err?.response?.status === 429) {
            return NextResponse.json(
                { error: "🚦 Лимит токенов на API-ключ достигнут. Попробуйте позже.", code: "QUOTA_EXCEEDED" },
                { status: 429 }
            );
        }


        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
