import {mutation, query} from "./_generated/server";
import {v} from "convex/values";

export const SaveRecommendation = mutation({
    args: {

        resp: v.any(),
        uid: v.string(),
        recId: v.string(),

    },
    handler: async (ctx, args) => {
        const {  resp,  uid, recId } = args;
        // Сохранение рекомендации в базе данных
        await ctx.db.insert('savedRecommendations', {
            resp,
            uid,
            recId,
            createdAt: new Date().toISOString()

        });
    }
});

export const GetSavedRecommendations = query({
    args: {
        uid: v.string(),
    },
    handler: async (ctx, args) => {
        const { uid } = args;
        const result = await ctx.db.query('savedRecommendations')
            .filter(q => q.eq(q.field('uid'), uid))
            .order('desc')
            .collect();
        return result!;
    }
});
export const GetSavedRecommendationById = query({
    args: {
        uid: v.string(),
        recId: v.string(),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.query("savedRecommendations")
            .filter(q => q.eq(q.field("uid"), args.uid))
            .filter(q => q.eq(q.field("recId"), args.recId))
            .collect();

        if (!result[0]) return null;

        const { resp, ...rest } = result[0];
        return { ...rest, ...resp };
    },
});