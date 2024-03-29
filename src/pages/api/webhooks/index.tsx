import Cors from "micro-cors";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { appRouter } from "../../../server/router";
import { prisma } from "../../../server/db/client";
import { RequestHandler } from "next/dist/server/next";
import { itemSizeToClient } from "../../../utils/itemSize";
import type { Readable } from "node:stream";
import { getAuth } from "@clerk/nextjs/server";
import sendMail from "../../../../emails";
import PostcardError from "../../../../emails/PostcardError";
import { toErrorWithMessage } from "../../../utils/errors";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2022-11-15",
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

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const caller = appRouter.createCaller({ auth: getAuth(req), prisma: prisma });

  if (req.method === "POST") {
    const buf = await buffer(req);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const sig = req.headers["stripe-signature"]!;
    const response = {
      status: "incomplete",
      postcard: undefined as any,
      error: undefined as any,
    };

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
      if (err instanceof Error) console.log(err);
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
      try {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        console.log(`🔔 Checkout Session completed: ${checkoutSession.id}`);
        const addressDetails = {
          name: checkoutSession.shipping_details?.name || "",
          address_line1: checkoutSession.shipping_details?.address?.line1 || "",
          address_line2: checkoutSession.shipping_details?.address?.line2 || "",
          address_city: checkoutSession.shipping_details?.address?.city || "",
          address_state: checkoutSession.shipping_details?.address?.state || "",
          address_zip:
            checkoutSession.shipping_details?.address?.postal_code || "",
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
        const customer = checkoutSessionWithLineItems?.customer_details;
        console.log("customer", customer);
        const customerEmail = customer?.email || "";
        console.log("customerEmail", customerEmail);

        // create postcards to be sent
        if (lineItems && address) {
          // await all line items
          await Promise.all(
            lineItems.map(async (lineItem) => {
              console.log("lineItem", lineItem);
              const item = await caller.query("items.getOneByStripeProductId", {
                stripeProductId: lineItem.price?.product as string,
              });
              console.log("recieved item from db", item);
              if (item) {
                console.log("creating postcard");
                const postcard = await caller.mutation("lob.createPostcard", {
                  addressId: address.id,
                  itemId: item.id,
                  quantity: lineItem.quantity || 0,
                  size: itemSizeToClient(item.size),
                  client_reference_id:
                    checkoutSession.client_reference_id || "",
                  email: customerEmail,
                });
                console.log("created postcard from lob", postcard);
                response.postcard = postcard;
                return postcard;
              }
            })
          );
          response.status = "success";
        }
      } catch (error) {
        await sendMail({
          to: "hi@postpostcard.com",
          component: (
            <PostcardError error={toErrorWithMessage(error).message} />
          ),
        });
        console.error("error creating postcard from purchase", error);
        response.error = error;
        response.status = "error";
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
    res.json(response);
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default cors(webhookHandler as RequestHandler);
