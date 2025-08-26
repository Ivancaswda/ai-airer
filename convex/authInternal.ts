
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const findUserById = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
            .first();
    },
});
export const findUserByEmail = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();
    },
});

export const _createUser = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        userId: v.string(),
        password: v.string(),
        isPrem: v.optional(v.boolean()),

        image: v.optional(v.string()),

        createdAt: v.number(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("users", args);
    },
});
