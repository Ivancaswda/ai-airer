/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as authInternal from "../authInternal.js";
import type * as bestSeason from "../bestSeason.js";
import type * as budgetRecommendations from "../budgetRecommendations.js";
import type * as http from "../http.js";
import type * as lemonSqueezy from "../lemonSqueezy.js";
import type * as savedRecommendations from "../savedRecommendations.js";
import type * as tripDetail from "../tripDetail.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  authInternal: typeof authInternal;
  bestSeason: typeof bestSeason;
  budgetRecommendations: typeof budgetRecommendations;
  http: typeof http;
  lemonSqueezy: typeof lemonSqueezy;
  savedRecommendations: typeof savedRecommendations;
  tripDetail: typeof tripDetail;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
