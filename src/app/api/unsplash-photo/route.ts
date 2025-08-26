import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) {
        return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&per_page=1`,
        {
            headers: {
                Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
            },
        }
    );

    const data = await res.json();
    if (!res.ok) {
        return NextResponse.json({ error: "Unsplash API error" }, { status: res.status });
    }

    return NextResponse.json(data);
}
