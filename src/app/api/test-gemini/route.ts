import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
    try {
        // API ключ из переменных окружения (.env.local)
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "❌ GEMINI_API_KEY is not set" }, { status: 500 });
        }

        // Инициализация Gemini
        const genAI = new GoogleGenerativeAI(apiKey);

        // Выбираем модель (например gemini-pro)
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Делаем простой тестовый запрос
        const result = await model.generateContent("Say hello! Just answer in one sentence.");

        const response = result.response.text();

        return NextResponse.json({ ok: true, response });
    } catch (error: any) {
        console.error("❌ Gemini Test Error:", error);
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}
