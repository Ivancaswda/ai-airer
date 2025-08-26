// lib/auth-server.ts
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import {api, internal} from "../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const JWT_SECRET = process.env.JWT_SECRET || "your-secr7JUINet";

async function getServerUser() {
    const token = cookies().get("token")?.value;
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            email: string;
            name: string;
            userId: string;
            image?: string;
            isPrem: boolean;
        };
        console.log(decoded)

        // Берём свежие данные пользователя из БД по userId
        const dbUser = await client.query(api.users.getUserByUserId, {
            userId: decoded.userId
        });
        console.log("DB User:", dbUser);
        if (!dbUser) return null;

        return {
            ...decoded,             // данные из токена (имя, email)
            isPrem: dbUser.isPrem ?? false, // актуальный статус премиум
            image: dbUser.image ?? decoded.image ?? null,
        };
    } catch (err) {
        console.error("JWT verification or DB fetch failed", err);
        return null;
    }
}

export default getServerUser;
