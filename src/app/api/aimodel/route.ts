import { NextRequest, NextResponse } from "next/server";
import getServerUser from "@/lib/auth-server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { aj } from "@/app/api/arcjet/route";
import {handleGeminiError} from "@/lib/utils";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

const PROMPT = `
Ты — точный AI-помощник по путешествиям. Задавай **один вопрос за раз** и жди ответа пользователя перед следующим вопросом.

Задавай вопросы строго в таком порядке:

1. Откуда отправление (город/страна) — принимай любую непустую строку. Примеры: "Париж", "Франция".
2. Пункт назначения (город/страна) — принимай любую непустую строку. Примеры: "Нью-Йорк", "США".
3. Размер группы — **должно быть ровно одно из: "Один", "Пара", "Семья", "Друзья"**.
4. Бюджет — **должно быть ровно одно из: "Экономия", "Бюджет", "Премиум", "Роскошь"**.
5. Длительность поездки — целое число дней, например: 5.
6. Интересы — массив строк из списка: "Приключение", "Красивые Виды", "Культура", "Еда", "Ночная жизнь", "Отдых".
7. Особые пожелания или предпочтения — строка, опционально.

**ТРЕБУЕТСЯ СТРОГО JSON-ОТВЕТ:**
Верни ровно один JSON-объект:

{
  "resp": "Твой ответ пользователю на русском",
  "ui": "origin" | "destination" | "groupSize" | "budget" | "tripDuration" | "interests" | "specialNeeds" | "final"
}

**Важные правила:**
- Принимай короткие ответы ровно как перечислены (для group size, budget и т.д.).
- Для origin/destination — принимай любую непустую строку, не переспроси.
- Задавай только один вопрос за раз.
- Не добавляй лишний текст или markdown.
`;

const FINAL_PROMPT = `
Используя предоставленную информацию о поездке, сгенерируй полный план путешествия в **строгом формате JSON**.
Верни ровно один JSON-объект со следующей структурой:

{
  "trip_plan": {
    "origin": "string",
    "destination": "string",
    "duration": "number",
    "budget": "string",
    "group_size": "string",
    "interests": ["string"],
    "special_needs": "string",
    "hotels": [
      {
        "hotel_name": "string",
        "hotel_address": "string",
        "price_per_night": "number",
        "hotel_image_url": "string",
        "geo_coordinates": {
          "latitude": "number",
          "longitude": "number"
        },
        "rating": "number",
        "description": "string"
      }
    ],
    "itinerary": [
      {
        "day": "number",
        "day_plan": "string",
        "best_time_to_visit_day": "string",
        "activities": [
          {
            "place_name": "string",
            "place_details": "string",
            "place_image_url": "string",
            "geo_coordinates": {
              "latitude": "number",
              "longitude": "number"
            },
            "place_address": "string",
            "ticket_pricing": "string",
            "time_travel_each_location": "string",
            "best_time_to_visit": "string"
          }
        ]
      }
    ]
  }
}

**Важно:**
- Верни только JSON, без markdown и объяснений.
- Используй ровно указанные поля, не добавляй лишних.
- Все строковые поля должны быть реалистичными, числа — именно числами.
- Ответ пользователю ("resp") всегда формулируй на русском языке.
`;

export function cleanJSON(content: string) {
    // Удаляем markdown-разметку и лишние пробелы
    return content.replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/\n/g, "")
        .replace(/\s{2,}/g, " ")
        .replace(/\r?\n|\r/g, "")
        .trim();
}

export function safeParseJSON(jsonString: string) {
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

        // await aj.protect(req, { userId: user?.userId ?? "", requested: isFinal ? 5 : 0 });
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
        console.log(fullPrompt)

        const result = await model.generateContent(fullPrompt.map(m => m.content).join("\n"));



        const parsed = safeParseJSON(result.response.text());
        console.log('PARSED RESULT === ')
        console.log(parsed)
        if (!parsed.ok) {
            return NextResponse.json({ error: "Invalid JSON from Gemini", raw: result.response.text() }, { status: 500 });
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
