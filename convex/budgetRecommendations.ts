import {mutation, query} from "./_generated/server";
import {v} from 'convex/values'
export const CreateBudgetDetail = mutation({
    args: {
        budgetId: v.string(),
        uid: v.string(),
        budgetDetail: v.any()
    },
    handler: async (ctx,args) => {
        await ctx.db.insert('budgetRecommendations', {
            budgetDetail: args.budgetDetail,
            budgetId: args.budgetId,
            uid: args.uid,
            createdAt: new Date().toISOString(),
        })
    }
})

export const GetUserBudgets = query({
    args: { uid: v.string() },
    handler: async (ctx, args) => {
        const result = await ctx.db.query('budgetRecommendations')
            .filter(q => q.eq(q.field('uid'), args.uid))
            .order('desc')
            .collect();
        return result!;
    }
});
export const GetBudgetById = query({
    args: {
        uid: v.string(),
        budgetId: v.string(),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.query("budgetRecommendations")
            .filter(q => q.eq(q.field("uid"), args.uid))
            .filter(q => q.eq(q.field("budgetId"), args.budgetId))
            .collect();
        console.log("Result:", result);

        return result[0] || null;
    },
});





