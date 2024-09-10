import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import Stripe from "stripe";

import { env } from "~/env";

const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});


export const subscriptionRouter = createTRPCRouter({
  selectPlan: protectedProcedure
  .input(z.enum(["FREE", "BASIC", "PRO"]))
  .mutation(async ({ ctx, input }) => {
    const { db, session } = ctx;

    if (input === "FREE") {
      await db.subscription.create({
        data: {
          userId: session.user.id,
          plan: input,
        },
      });
      return { success: true };
    } else {
      // For paid plans, create a Stripe checkout session
      const checkoutSession = await stripe.checkout.sessions.create({
        customer_email: session.user.email!,
        line_items: [
          {
            price: input === "BASIC" ? process.env.STRIPE_BASIC_PRICE_ID : process.env.STRIPE_PRO_PRICE_ID,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.NEXTAUTH_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
        metadata: {
          userId: session.user.id,
          plan: input,
        },
      });

      return { checkoutUrl: checkoutSession.url };
    }
  }),

verifySubscription: protectedProcedure
  .input(z.object({ sessionId: z.string() }))
  .query(async ({ ctx, input }) => {
    const session = await stripe.checkout.sessions.retrieve(input.sessionId);
    if (session.payment_status === "paid") {
      await ctx.db.subscription.create({
        data: {
          userId: session.metadata!.userId!,
          plan: session.metadata!.plan as "BASIC" | "PRO",
        },
      });
      return { success: true };
    }
    return { success: false };
  }),
});
