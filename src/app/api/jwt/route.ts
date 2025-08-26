// app/api/jwt/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import {api} from "../../../../convex/_generated/api";
import {fetchMutation} from "convex/nextjs";
import {useMutation, useQuery} from "convex/react";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_change_me";

export async function POST(req: NextRequest) {
    try {
        const user = await req.json();

        if (!user || !user.userId || !user.email) {
            return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
        }

        console.log(user)

        const token = jwt.sign(
            {
                userId: user.userId,
                name: user.name,
                email: user.email,
                image: user.image || null,
                isPrem: user?.isPrem || false,
            },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        const response = NextResponse.json({
            success: true,
            token, // ✅ добавили токен в тело ответа
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (err) {
        console.error("JWT Error:", err);
        return NextResponse.json({ error: "Token generation failed" }, { status: 500 });
    }
}