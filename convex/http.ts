import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";

import { api, internal } from "./_generated/api";

const http = httpRouter();

http.route({
    path: "/lemon-squeezy-webhook",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const payloadString = await request.text();
        const signature = request.headers.get("X-Signature");

        if (!signature) {
            return new Response("Missing X-Signature header", { status: 400 });
        }

        try {
            const payload = await ctx.runAction(internal.lemonSqueezy.verifyWebhook, {
                payload: payloadString,
                signature,
            });
            console.log(payload)


            // Updating status of user on pro
            if (payload.meta.event_name === "order_created") {
                const { data } = payload;
                console.log('ORDER CREATED ====')
                console.log(data.attributes.user_email)

                const { success } = await ctx.runMutation(api.users.upgradeToPro, {
                    email: data.attributes.user_email,
                    lemonSqueezyCustomerId: data.attributes.customer_id.toString(),
                    lemonSqueezyOrderId: data.id,
                    amount: data.attributes.total,
                });



                if (success) {
                    console.log('Вы успешно оплатили план!')
                }
            }

            return new Response("Webhook processed successfully", { status: 200 });
        } catch (error) {
            console.log("Webhook error:", error);
            return new Response("Error processing webhook", { status: 500 });
        }
    }),
});
export default http