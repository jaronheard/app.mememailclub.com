"use node";

/**
 * Node-runtime half of the old `items` tRPC router: everything that talks to
 * Stripe. The DB writes happen in `internal.items.*` mutations so they stay
 * transactional.
 *
 * Client mapping:
 *   trpc.items.createItem                 -> api.itemsNode.createItem
 *   trpc.items.createItemForUser          -> api.itemsNode.createItemForUser
 *   trpc.items.createItemForAnonymousUser -> api.itemsNode.createItemForAnonymousUser
 *   trpc.items.updateItem                 -> api.itemsNode.updateItem
 *   trpc.items.deleteItem                 -> api.itemsNode.deleteItem
 */
import { v } from "convex/values";
import Stripe from "stripe";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import type { ActionCtx } from "./_generated/server";
import { itemSizeToDB, type ItemSizeOpts } from "./lib/itemSize";
import { addStripePreviewTransformationToURL } from "./lib/cloudinary";
import type { ItemShape } from "./lib/model";

const bannerHeading = encodeURIComponent("Your postcard is on its way! 💌");
const bannerText = encodeURIComponent("Send another for $2.99!");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

const itemSizeInput = v.union(
  v.literal("4x6"),
  v.literal("6x9"),
  v.literal("6x11")
);
const itemStatusInput = v.union(v.literal("DRAFT"), v.literal("PUBLISHED"));
const visibilityInput = v.union(v.literal("PUBLIC"), v.literal("PRIVATE"));

type CreatePostcardInput = {
  publicationId: number;
  name: string;
  description: string;
  front: string;
  back: string;
  status: "DRAFT" | "PUBLISHED";
  size: ItemSizeOpts;
  visibility: "PUBLIC" | "PRIVATE";
  anonymousUserId?: string;
};

const appUrl = () => process.env.NEXT_PUBLIC_APP_URL || "";

/** `"6x9"` -> `6"x9" postcard with your message` */
function productDescription(size: ItemSizeOpts): string {
  const [width, height] = size.split("x");
  return `${width}"x${height}" postcard with your message`;
}

async function createPostcard(
  ctx: ActionCtx,
  input: CreatePostcardInput
): Promise<ItemShape> {
  const identity = await ctx.auth.getUserIdentity();
  const authUserId = identity?.subject ?? null;

  if (!input.anonymousUserId && !authUserId) {
    throw new Error("You must be logged in to create an item");
  }

  // stripe logic
  const product = await stripe.products.create({
    name: input.name || "Postcard",
    // active: input.status === "PUBLISHED",
    description: productDescription(input.size),
    statement_descriptor: `postcard: ${input.name.slice(0, 12)}`,
    images: [
      addStripePreviewTransformationToURL({
        src: input.front,
        size: input.size,
      }),
      addStripePreviewTransformationToURL({
        src: input.back,
        size: input.size,
      }),
    ],
    // default item information
    shippable: true,
    tax_code: "txcd_35020200",
    default_price_data: {
      unit_amount_decimal: "299",
      currency: "usd",
    },
  });

  if (typeof product.default_price !== "string") {
    throw new Error("Stripe product creation failed");
  }

  const paymentLink = await stripe.paymentLinks.create({
    line_items: [{ price: product.default_price, quantity: 1 }],
    shipping_address_collection: { allowed_countries: ["US"] },
    allow_promotion_codes: true,
    custom_text: {
      shipping_address: {
        message: "The shipping address is where we’ll send the postcard.",
      },
    },
    after_completion: {
      type: "redirect",
      redirect: {
        url: `${appUrl()}/send?bannerHeading=${bannerHeading}&bannerText=${bannerText}&utm_source=stripe&utm_medium=paymentlink&utm_campaign=send`,
      },
    },
  });

  const newItem: ItemShape = await ctx.runMutation(
    internal.items.insertInternal,
    {
      publicationId: input.publicationId,
      name: input.name,
      description: input.description,
      front: input.front,
      back: input.back,
      status: input.status,
      stripeProductId: product.id,
      stripePaymentLink: paymentLink.url,
      stripePaymentLinkId: paymentLink.id,
      size: itemSizeToDB(input.size),
      test: process.env.NODE_ENV === "development",
      userId: authUserId || input.anonymousUserId || "anonymous",
      visibility: input.visibility,
    }
  );

  // point the payment link at the item's send page. The tRPC version left this
  // promise dangling; Convex kills the sandbox when the handler returns, so it
  // is awaited here.
  await stripe.paymentLinks.update(paymentLink.id, {
    after_completion: {
      type: "redirect",
      redirect: {
        url: `${appUrl()}/send/${newItem.id}?bannerHeading=${bannerHeading}&bannerText=${bannerText}&utm_source=stripe&utm_medium=paymentlink&utm_campaign=send`,
      },
    },
  });

  return newItem;
}

export const createItem = action({
  args: {
    publicationId: v.number(),
    name: v.string(),
    description: v.string(),
    front: v.string(),
    back: v.string(),
    status: itemStatusInput,
    size: itemSizeInput,
    visibility: visibilityInput,
  },
  handler: async (ctx, args): Promise<ItemShape> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to perform this action");
    }
    return await createPostcard(ctx, args);
  },
});

export const createItemForUser = action({
  args: {
    name: v.string(),
    description: v.string(),
    front: v.string(),
    back: v.string(),
    status: itemStatusInput,
    size: itemSizeInput,
    visibility: visibilityInput,
  },
  handler: async (ctx, args): Promise<ItemShape> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to perform this action");
    }
    const userId = identity.subject;
    const publication = await ctx.runMutation(
      internal.publications.ensureForUserInternal,
      { userId }
    );
    if (!publication?.id) {
      throw new Error("Postcard creation failed - error determining publication");
    }
    return await createPostcard(ctx, {
      publicationId: publication.id,
      name: args.name,
      description: args.description,
      front: args.front,
      back: args.back,
      status: args.status,
      size: args.size,
      visibility: args.visibility,
    });
  },
});

export const createItemForAnonymousUser = action({
  args: {
    name: v.string(),
    description: v.string(),
    front: v.string(),
    back: v.string(),
    status: itemStatusInput,
    size: itemSizeInput,
    visibility: visibilityInput,
    anonymousUserId: v.string(),
  },
  handler: async (ctx, args): Promise<ItemShape> => {
    const publication = await ctx.runMutation(
      internal.publications.ensureForUserInternal,
      { userId: args.anonymousUserId }
    );
    if (!publication?.id) {
      throw new Error("Postcard creation failed - error determining publication");
    }
    return await createPostcard(ctx, {
      publicationId: publication.id,
      name: args.name,
      description: args.description,
      front: args.front,
      back: args.back,
      status: args.status,
      size: args.size,
      visibility: args.visibility,
      anonymousUserId: args.anonymousUserId,
    });
  },
});

export const updateItem = action({
  args: {
    id: v.number(),
    name: v.string(),
    description: v.string(),
    front: v.string(),
    back: v.string(),
    status: itemStatusInput,
    size: itemSizeInput,
    visibility: visibilityInput,
  },
  handler: async (ctx, args): Promise<ItemShape> => {
    const item: ItemShape | null = await ctx.runQuery(
      internal.items.getInternal,
      { id: args.id }
    );

    if (!item || !item.stripeProductId || !item.stripePaymentLink) {
      throw new Error("Stripe product or product link not found");
    }

    const identity = await ctx.auth.getUserIdentity();
    const authUserId = identity?.subject ?? null;

    // check if user is authorized to update this item
    if (!(item.userId.startsWith("anonymous") || authUserId === item.userId)) {
      throw new Error(
        "You must be logged in as the correct user to update a postcard"
      );
    }

    // stripe logic
    const product = await stripe.products.update(item.stripeProductId, {
      name: args.name,
      active: true, // allow even for draft items
      statement_descriptor: `postcard: ${args.name.slice(0, 12)}`,
      images: [args.front, args.back],
    });

    if (!product) {
      throw new Error("Stripe product update failed");
    }

    // TODO: update payment link with new price

    return await ctx.runMutation(internal.items.patchInternal, {
      id: args.id,
      name: args.name,
      description: args.description,
      front: args.front,
      back: args.back,
      status: args.status,
      stripeProductId: product.id,
      size: itemSizeToDB(args.size),
      visibility: args.visibility,
    });
  },
});

export const deleteItem = action({
  args: { id: v.number() },
  handler: async (ctx, args): Promise<ItemShape> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to perform this action");
    }

    const item: ItemShape | null = await ctx.runQuery(
      internal.items.getInternal,
      { id: args.id }
    );

    if (!item) {
      throw new Error("Item not found");
    }

    if (!item.stripeProductId || !item.stripePaymentLinkId) {
      throw new Error("Stripe product or product link not found");
    }

    if (
      !(item.userId.startsWith("anonymous") || identity.subject === item.userId)
    ) {
      throw new Error(
        "You must be logged in as the correct user to delete a postcard"
      );
    }

    // deactivate stripe product
    if (item.stripeProductId) {
      try {
        const updatedProduct = await stripe.products.update(
          item.stripeProductId,
          { active: false }
        );
        console.log("updated PaymentLink", updatedProduct);
      } catch (error) {
        console.log("❗️error❗️ product not deactivated", error);
      }
    }

    // deactivate stripe payment link
    if (item.stripePaymentLinkId) {
      try {
        const updatedPaymentLink = await stripe.paymentLinks.update(
          item.stripePaymentLinkId,
          { active: false }
        );
        console.log("updated PaymentLink", updatedPaymentLink);
      } catch (error) {
        console.log("❗️error❗️ payment link not deactivated", error);
      }
    }

    return await ctx.runMutation(internal.items.deleteInternal, {
      id: args.id,
    });
  },
});
