import {v} from 'convex/values'
import {action, mutation, query} from "./_generated/server";
import { v4 as uuidv4 } from "uuid";


import bcrypt from "bcryptjs";





export const createUser = mutation({
    args: {
        email: v.string(),
        name: v.string(),
        password: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = uuidv4();
        console.log(userId)
        return await ctx.db.insert("users", {...args, createdAt: Date.now(), userId: userId, isPrem: false});
    },
});

export const getUserByEmail = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();
    },
});


export const syncUser = mutation({
    args: {
        name: v.string(),
        email: v.optional(v.string()),
        userId: v.string(),
        image: v.optional(v.string()),

    },
    handler: async (ctx, args) => {
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
            .first();   // finding the user in db
        if (existingUser) return;






       return  await ctx.db.insert('users', {// gives use id
            ...args,
            createdAt: Date.now(),
           isPrem: false,
        })
    }
})


export const updateUser = mutation({
    args: {
        userId: v.string(),
        email: v.optional(v.string()),
        name: v.optional(v.string()),
        image: v.optional(v.string()),
    },
    handler: async(ctx, args) => {
        const user = await ctx.db.query('users').withIndex('by_user_id', (q) => q.eq('userId', args.userId)).first()

        if (!user) throw new Error('User is not found in db')

        await ctx.db.patch(user._id, {
            ...(args.email && {email:args.email}),
            ...(args.name && {name: args.name}),
            ...(args.image && {image: args.image})
        })
    }
})


export const removeUser = mutation({
    args: {
        userId: v.string()
    },
    handler: async (ctx, args) => {
        const user =await ctx.db.query('users')
            .withIndex('by_user_id',
                (q) => q.eq('userId', args.userId)).first()

        if (user) {
            await ctx.db.delete(user._id)
        }

    }
})



export const getUsers = query({
    handler: async (ctx) => {
        const me = await ctx.auth.getUserIdentity()


        const users = await ctx.db.query('users').collect()

        return users

    }
})

export const getUserByUserId = query({
    args: {userId: v.string()},
    handler: async (ctx, args) => {
        const user = await ctx.db.query('users').withIndex('by_user_id', (q) => q.eq('userId', args.userId)).first()
        // findign user in convex db by clerk_id in users query
        return user!
    }
})


export const listUsers = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query('users').collect()
    }
})


export const updateUserProfile = mutation({
    args: {
        userId: v.string(),
        name: v.optional(v.string()),
        image: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
            .first();

        if (!user) throw new Error("User not found");

        return await ctx.db.patch(user._id, {
            ...(args.name && { name: args.name }),
            ...(args.image && { image: args.image }),
        });
    },
});


export const storeUserImage = mutation({
    args: {
        userId: v.string(),
        storageId: v.id("_storage"),
    },
    handler: async (ctx, args) => {
        const imageUrl = await ctx.storage.getUrl(args.storageId);

        const user = await ctx.db
            .query("users")
            .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
            .first();

        if (!user) throw new Error("User not found");

        return await ctx.db.patch(user._id, {
            image: imageUrl,
        });
    },
});

export const upgradeToPro = mutation({
    args: {
        email: v.string(),
        lemonSqueezyCustomerId: v.string(),
        lemonSqueezyOrderId: v.string(),
        amount: v.number(),
    },
    handler: async (ctx, args) => {

        console.log(args.email)

        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), args.email))
            .first();

        if (!user) throw new Error("User not found");

        await ctx.db.patch(user._id, {
            isPrem: true,
            proSince: Date.now(),
            lemonSqueezyCustomerId: args.lemonSqueezyCustomerId,
            lemonSqueezyOrderId: args.lemonSqueezyOrderId,
        });

        return { success: true };
    },
});


