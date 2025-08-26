import {mutation, query} from "./_generated/server";
import {v} from 'convex/values'
export const CreateTripDetail = mutation({
    args: {
        tripId: v.string(),
        uid: v.string(),
        tripDetail: v.any()
    },
    handler: async (ctx,args) => {
        await ctx.db.insert('TripDetail', {
            tripDetail: args.tripDetail,
            tripId: args.tripId,
            uid: args.uid
        })
    }
})

export const GetUserTrips = query({
    args: { uid: v.string() },
    handler: async (ctx, args) => {
        const result = await ctx.db.query('TripDetail')
            .filter(q => q.eq(q.field('uid'), args.uid))
            .order('desc')
            .collect();
        return result!;
    }
});
export const GetTripById = query({
    args: {
        uid: v.string(),
        tripId: v.string(),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.query("TripDetail")
            .filter(q => q.eq(q.field("uid"), args.uid))
            .filter(q => q.eq(q.field("tripId"), args.tripId))
            .collect();
        console.log("Result:", result);

        return result[0] || null;
    },
});





