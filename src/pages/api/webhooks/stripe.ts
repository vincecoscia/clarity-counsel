/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { buffer } from "micro";
import Stripe from "stripe";
import { db } from "~/server/db";
import { env } from "~/env";
import type { NextApiRequest, NextApiResponse } from 'next';
import { Plan } from "@prisma/client";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

const USES_PER_PLAN = {
  FREE: 1,
  BASIC: 10,
  PRO: 100,
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        sig,
        env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      const error = err as Error;
      res.status(400).send(`Webhook Error: ${error.message}`);
      return;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.metadata?.userId && session.metadata?.plan) {
        const plan = session.metadata.plan as Plan;
        
        // Fetch the subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        const renewalDate = new Date(subscription.current_period_end * 1000);

        await db.subscription.create({
          data: {
            userId: session.metadata.userId,
            plan: plan,
            usesLeft: USES_PER_PLAN[plan],
            renewalDate: renewalDate,
          },
        });
      } else {
        console.error("Missing metadata in Stripe session");
      }
    }

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}