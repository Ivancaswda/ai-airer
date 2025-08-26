import {defineSchema, defineTable} from "convex/server";
import {v} from 'convex/values'

export default defineSchema({
    users: defineTable({
        name: v.string(),
        email: v.optional(v.string()),
        userId: v.string(),
        password: v.optional(v.string()),
        image: v.optional(v.string()),
        createdAt: v.optional(v.number()),
        isPrem: v.optional(v.boolean()),
        proSince: v.optional(v.number()),
        lemonSqueezyCustomerId: v.optional(v.string()),
        lemonSqueezyOrderId: v.optional(v.string()),

    }).index('by_user_id', ["userId"])
        .index('by_email', ['email']),
    TripDetail: defineTable({
        tripId: v.string(),
        tripDetail: v.any(),
        uid: v.string()
    }),
    savedRecommendations: defineTable({
        resp: v.any(),
        recId: v.string(),
        createdAt: v.optional(v.string()),
        uid: v.string(),
    }),
    budgetRecommendations: defineTable({
        budgetDetail: v.any(),
        budgetId: v.string(),
        uid: v.string(),
        createdAt: v.optional(v.string())
    }),
    bestSeasons: defineTable({
        uid: v.string(),
        weather_plan: v.any(),
        seasonId: v.string(),
        createdAt: v.optional(v.string())
    })
})