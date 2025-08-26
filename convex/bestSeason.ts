import {mutation, query} from "./_generated/server";
import {v} from 'convex/values'
export const CreateBestSeason = mutation({
    args: {
        seasonId: v.string(),
        uid: v.string(),
        weather_plan: v.any()
    },
    handler: async (ctx,args) => {
        await ctx.db.insert('bestSeasons', {
            weather_plan: args.weather_plan,
            seasonId: args.seasonId,
            uid: args.uid,
            createdAt: new Date().toISOString(),
        })
    }
})

export const GetUserSeasons = query({
    args: { uid: v.string() },
    handler: async (ctx, args) => {
        const result = await ctx.db.query('bestSeasons')
            .filter(q => q.eq(q.field('uid'), args.uid))
            .order('desc')
            .collect();
        return result!;
    }
});
export const GetSeasonById = query({
    args: {
        uid: v.string(),
        seasonId: v.string(),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.query("bestSeasons")
            .filter(q => q.eq(q.field("uid"), args.uid))
            .filter(q => q.eq(q.field("seasonId"), args.seasonId))
            .collect();
        console.log("Result:", result);

        return result[0] || null;
    },
});





