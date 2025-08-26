import arcjet, { tokenBucket } from "@arcjet/next";
import { NextResponse } from "next/server";
import getServerUser from "@/lib/auth-server";

export const aj = arcjet({
    key: process.env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
    rules: [
        // Create a token bucket rate limit. Other algorithms are supported.
        tokenBucket({
            mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
            characteristics: ["userId"], // track requests by a custom user ID
            refillRate: 5, // refill 5 tokens per interval
            interval: 86400, // refill every 24 HOURS
            capacity: 36, // bucket maximum capacity of 36 tokens
        }),
    ],
});

export async function GET(req: Request) {
   const user = await getServerUser()// Replace with your authenticated user ID
    if (!user) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decision = await aj.protect(req, { userId: user?.userId, requested: 5 }); // Deduct 5 tokens from the bucket
    console.log("Arcjet decision", decision);

    if (decision.isDenied()) {
        return NextResponse.json({ error: "Free limit exceeded", redirect: "/premium" }, { status: 403 });
    }

    return NextResponse.json({ message: "Hello world" });
}