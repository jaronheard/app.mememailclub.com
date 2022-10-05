/* eslint-disable @typescript-eslint/ban-ts-comment */
import { buffer } from "micro";
import Cors from "micro-cors";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { appRouter } from "../../../server/router";
import { prisma } from "../../../server/db/client";
import { getSession } from "next-auth/react";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2022-08-01",
});

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET || "";

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

const caller = appRouter.createCaller({ session: null, prisma: prisma });

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"]!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf.toString(),
        sig,
        webhookSecret
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      // On error, log and return the error message.
      if (err! instanceof Error) console.log(err);
      console.log(`❌ Error message: ${errorMessage}`);
      res.status(400).send(`Webhook Error: ${errorMessage}`);
      return;
    }

    // Successfully constructed event.
    console.log("✅ Success:", event.id);

    // Cast event data to Stripe object.
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`💰 PaymentIntent status: ${paymentIntent.status}`);
    } else if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(
        `❌ Payment failed: ${paymentIntent.last_payment_error?.message}`
      );
    } else if (event.type === "charge.succeeded") {
      const charge = event.data.object as Stripe.Charge;
      console.log(`💵 Charge id: ${charge.id}`);
    } else if (event.type === "checkout.session.completed") {
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      console.log(`🔔 Checkout Session completed: ${checkoutSession.id}`);
      const addressDetails = {
        // @ts-ignore - Stripe types are wrong
        name: checkoutSession.shipping.name || "",
        // @ts-ignore - Stripe types are wrong
        address_line1: checkoutSession.shipping?.address?.line1 || "",
        // @ts-ignore - Stripe types are wrong
        address_line2: checkoutSession.shipping?.address?.line2 || "",
        // @ts-ignore - Stripe types are wrong
        address_city: checkoutSession.shipping?.address?.city || "",
        // @ts-ignore - Stripe types are wrong
        address_state: checkoutSession.shipping?.address?.state || "",
        // @ts-ignore - Stripe types are wrong
        address_zip: checkoutSession.shipping?.address?.postal_code || "",
        // address_country: checkoutSession.shipping_details?.address?.country || "",
      };

      // get lob address
      const address = await caller.mutation(
        "lob.createAddress",
        addressDetails
      );

      // get line items
      const checkoutSessionWithLineItems =
        await stripe.checkout.sessions.retrieve(checkoutSession.id, {
          expand: ["line_items"],
        });
      const lineItems = checkoutSessionWithLineItems?.line_items?.data;

      // create postcards to be sent
      if (lineItems && address) {
        console.log("1");
        lineItems.map(async (lineItem) => {
          console.log("lineItem", lineItem);
          const item = await caller.query("items.getOneByStripeProductId", {
            stripeProductId: lineItem.price?.product as string,
          });
          console.log("3");
          if (item) {
            console.log("4");
            await caller.mutation("lob.createPostcard", {
              addressId: address.id,
              itemId: item.id,
              quantity: lineItem.quantity || 0,
            });
          }
        });
      }
    } else if (event.type === "customer.subscription.created") {
      const subscription = event.data.object as Stripe.Subscription;
      console.log(`🔔 Subscription created: ${subscription.id}`);
    } else if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      console.log(`🔔 Subscription updated: ${subscription.id}`);
    } else if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      console.log(`🔔 Subscription deleted: ${subscription.id}`);
    } else if (event.type === "customer.subscription.trial_will_end") {
      const subscription = event.data.object as Stripe.Subscription;
      console.log(`🔔 Subscription trial will end: ${subscription.id}`);
    } else {
      console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event.
    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default cors(webhookHandler as any);
