
import { v4 as uuidv4 } from 'uuid';
import {action} from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";

import {internal, api} from "./_generated/api";

const registerHandler = async (ctx, args) => {
    const userExists = await ctx.runQuery(api.authInternal.findUserByEmail, {
        email: args.email,
    });

    if (userExists) throw new Error("Email already registered");

    const hashed = await bcrypt.hash(args.password, 10);
    const userId = uuidv4();

    const dbId = await ctx.runMutation(api.authInternal._createUser, {
        name: args.name,
        email: args.email,
        password: hashed,
        image: args.image,
        createdAt: Date.now(),
        userId,
        isPrem: false
    });

    return {
        id: dbId,
        userId,
        name: args.name,
        email: args.email,
        image: args.image ?? null,
        isPrem: false
    };
};

export const registerUser = action({
    args: {
        name: v.string(),
        email: v.string(),
        password: v.string(),
        image: v.optional(v.string()),
        isPrem: v.optional(v.boolean())

    },
    handler: registerHandler,
});

export const login = action({
    args: {
        email: v.string(),
        password: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.runQuery(api.authInternal.findUserByEmail, {
            email: args.email,
        });

        if (!user) throw new Error("User not found");

        const isValid = await bcrypt.compare(args.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        return {
            id: user._id,
            name: user.name,
            email: user.email,
            image: user.image ?? null,
        };
    },
})
export const registerOAuthUser = action({
    args: {
        userId: v.string(),
        name: v.string(),
        email: v.string(),
        image: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        // Проверяем, есть ли юзер уже в Convex
        const existing = await ctx.runQuery(api.authInternal.findUserByEmail, {
            email: args.email,
        });

        if (existing) {
            return existing;
        }

        // Если нет — создаём
        const dbId = await ctx.runMutation(api.authInternal._createUser, {
            ...args,
            password: "", // для OAuth можно пустой
            createdAt: Date.now(),
            isPrem: false,
        });

        return { ...args, id: dbId, isPrem: false };
    },
});