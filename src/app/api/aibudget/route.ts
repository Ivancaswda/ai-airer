import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { safeParseJSON } from "@/app/api/aimodel/route";
import getServerUser from "@/lib/auth-server";
import {handleGeminiError} from "@/lib/utils";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

const BUDGET_PLANNING_PROMPT = `
Ты — умный ассистент по планированию бюджета поездки.  
Ты обязан задавать пользователю **по одному вопросу за раз** в фиксированном порядке.  
Следи за прогрессом: не повторяй уже заданные вопросы и переходи строго к следующему.

Порядок вопросов:

1. Город или страна отправления (например: "Париж", "Россия")
2. Город или страна назначения (например: "Нью-Йорк", "Япония")
3. Предпочитаемая валюта (например: "USD", "EUR", "RUB")
4. Примерный уровень бюджета (например: "Низкий", "Средний", "Высокий")
5. Продолжительность поездки (например: "1 неделя", "2 недели", "15 дней")

**СТРОГО ТОЛЬКО JSON-ОТВЕТ**
Верни ровно один JSON-объект:

{
  "resp": "Текст следующего сообщения пользователю",
  "ui": "departure" | "destination" | "currency" | "budget" | "time" | "final",
  "step": number
}

Правила:
- "resp" — это текст вопроса или комментария для пользователя (на русском).
- "ui" должен соответствовать текущему шагу.
- "step" — индекс текущего шага (1–5). После завершения — возвращай "final" и step = 6.
- Никогда не возвращай предыдущий вопрос и не иди назад.
`;

const FINAL_BUDGET_PROMPT = `
Используя собранные данные о поездке, сгенерируй **полную бюджетную рекомендацию** в **строгом формате JSON**.  
Верни ровно один JSON-объект по этой структуре:

{
  "trip_details": {
    "origin": "string",              // город или страна отправления
    "destination": "string",         // город или страна назначения
    "currency": "string",            // валюта
    "budget_level": "string",        // уровень бюджета
    "trip_duration": "string",       // продолжительность поездки
    "total_budget": "number",        // примерный общий бюджет
    "recommendations": [
      {
        "category": "Размещение" | "Еда" | "Транспорт" | "Развлечения" | "Шоппинг",
        "recommendation": "string",  // совет на русском
        "estimated_cost": "number"   // примерная стоимость
      },
      {
        "category": "Размещение",
        "recommendation": "Недорогие отели поблизости",
        "estimated_cost": 100
      }
    ],
    "final_estimation": {
      "total_cost_estimate": "number",      // финальная оценка
      "suggested_adjustments": "string"     // предложения по корректировке бюджета (на русском)
    }
  }
}

⚠️ Важно:
- Верни только JSON без markdown и пояснений.
- Используй только указанные поля, без добавления лишних.
- Все текстовые поля должны быть осмысленными строками на русском.
- Все суммы должны быть числами и реалистичными для указанного уровня бюджета.
`;

export async function POST(req: NextRequest) {
    try {
        const { messages, isFinal } = await req.json();
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const user = await getServerUser();
        if (!user) {
            return NextResponse.json({ error: "No authorized"})
        }

        if (!user?.isPrem) {
            return NextResponse.json({ error: "Premium required" }, { status: 403 });
        }

        const fullPrompt = [
            { role: "system", content: isFinal ? FINAL_BUDGET_PROMPT : BUDGET_PLANNING_PROMPT },
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
