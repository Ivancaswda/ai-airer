// /app/api/ai-trip/route.ts

import { NextRequest, NextResponse } from "next/server";
import getServerUser from "@/lib/auth-server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {aj} from "@/app/api/arcjet/route";
import {handleGeminiError} from "@/lib/utils";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

const PROMPT = `
Ты — точный AI-помощник по планированию путешествий с учётом погоды.
Задавай **один вопрос за раз** и жди ответа пользователя перед следующим вопросом.

Задавай вопросы в таком порядке:

1. Пункт назначения (город или страна) — принимай любую непустую строку.
2. Месяц (например: Январь, Март, Август) — должен быть одним из 12 месяцев.
3. Тип поездки — одно из: "Отпуск", "Бизнес", "Приключение", "Семья".
4. Предпочтения по погоде — одно из: "Теплый", "Холодный", "Сухой", "Влажный".

**ТРЕБУЕТСЯ СТРОГО JSON-ОТВЕТ:**
Верни ровно один JSON-объект:

{
  "resp": "Твой ответ пользователю на русском",
  "ui": "destination" | "month" | "tripType" | "weatherPref" | "final"
}

Правила:
- Задавай только один вопрос за раз.
- Отвечай только в JSON.
`;

const FINAL_PROMPT = `
Используя предоставленную информацию, сгенерируй детальную рекомендацию по путешествию с учётом погоды в **строгом формате JSON**.

Верни ровно один JSON-объект:

{
  "weather_plan": {
    "destination": "string",
    "month": "string",
    "trip_type": "string",
    "weather_preference": "string",
    "expected_weather": {
      "avg_temp_c": "number",
      "rain_days": "number",
      "humidity_percent": "number"
    },
    "recommendation": "string",
    "clothing_advice": "string",
    "activity_suggestion": "string"
  }
}

Важно:
- Верни только JSON, без markdown.
- Числа должны быть корректными числами.
- Рекомендации и советы должны быть короткими, практичными и понятными.
`;

function cleanJSON(content: string) {
    return content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/\r?\n|\r/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();
}

function safeParseJSON(jsonString: string) {
    const cleaned = cleanJSON(jsonString);
    try {
        return { ok: true, data: JSON.parse(cleaned) };
    } catch (error: any) {
        return { ok: false, raw: jsonString, error: error.message };
    }
}

export async function POST(req: NextRequest) {
    try {
        const { messages, isFinal } = await req.json();
        const user = await getServerUser();
        if (!user) {
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
            { role: "system", content: isFinal ? FINAL_PROMPT : PROMPT },
            ...messages.map(({ role, content }: any) => ({ role, content }))
        ];

        const result = await model.generateContent(fullPrompt.map(m => m.content).join("\n"));

        const parsed = safeParseJSON(result.response.text());

        if (!parsed.ok) {
            return NextResponse.json(
                { error: "Invalid JSON from Gemini", raw: result.response.text() },
                { status: 500 }
            );
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
