import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";
import Stripe from "stripe";
import {
  Configuration,
  PostcardEditable,
  PostcardsApi,
} from "@lob/lob-typescript-sdk";
import { env } from "../../env/server.mjs";
import { itemSizeToDB } from "../../utils/itemSize";

const INCLUDE_PUBLICATION_FIELDS = {
  include: {
    publication: {
      select: {
        name: true,
        description: true,
        imageUrl: true,
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        authorId: true,
      },
    },
    Messages: true,
  },
};

const testConfig: Configuration = new Configuration({
  username: env.LOB_TEST_API_KEY,
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-08-01",
});

export const items = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      const items = await ctx.prisma.item.findMany({
        where: {
          status: {
            not: "DELETED",
          },
        },
        ...INCLUDE_PUBLICATION_FIELDS,
        orderBy: {
          createdAt: "asc",
        },
      });
      return items;
    },
  })
  .query("getPublished", {
    async resolve({ ctx }) {
      const items = await ctx.prisma.item.findMany({
        where: {
          status: "PUBLISHED",
        },
        ...INCLUDE_PUBLICATION_FIELDS,
        orderBy: {
          createdAt: "asc",
        },
      });
      return items;
    },
  })
  .query("getOne", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ ctx, input }) {
      const item = await ctx.prisma.item.findUnique({
        where: {
          id: input.id,
        },
        ...INCLUDE_PUBLICATION_FIELDS,
      });
      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Item not found",
        });
      }
      return item;
    },
  })
  .query("getOneByStripeProductId", {
    input: z.object({
      stripeProductId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const item = await ctx.prisma.item.findUnique({
        where: {
          stripeProductId: input.stripeProductId,
        },
        // does not ...INCLUDE_PUBLICATION_FIELDS,
      });
      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Item not found",
        });
      }
      return item;
    },
  })
  .mutation("updatePostcardPreviewRendered", {
    input: z.object({
      postcardPreviewId: z.string(),
      postcardPreviewRendered: z.boolean(),
    }),
    async resolve({ ctx, input }) {
      const updatedItem = await ctx.prisma.item.update({
        where: {
          postcardPreviewId: input.postcardPreviewId,
        },
        data: {
          postcardPreviewRendered: input.postcardPreviewRendered,
        },
      });
      if (!updatedItem) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Item update failed",
        });
      }

      return updatedItem;
    },
  })
  .middleware(async ({ ctx, next }) => {
    // Any queries or mutations after this middleware will
    // raise an error unless there is a current session
    if (!ctx.session) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next();
  })
  .mutation("createItem", {
    input: z.object({
      publicationId: z.number(),
      name: z.string(),
      description: z.string(),
      front: z.string().url(),
      back: z.string().url(),
      status: z.enum(["DRAFT", "PUBLISHED"]),
      size: z.enum(["4x6", "6x9", "6x11"]),
    }),
    async resolve({ ctx, input }) {
      // create a postcard using lob
      const postcardCreate = new PostcardEditable({
        to: {
          name: "Jane Doe",
          address_line1: "123 Main St",
          address_city: "San Francisco",
          address_state: "CA",
          address_zip: "94111",
        },
        front: input.front,
        back: input.back,
        size: input.size,
      });
      const myPostcard = await new PostcardsApi(testConfig).create(
        postcardCreate
      );

      // throw error if postcard creation fails
      if (!myPostcard) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Postcard creation failed",
        });
      }

      const frontPreview = myPostcard.thumbnails?.[0]?.large;
      const backPreview = myPostcard.thumbnails?.[1]?.large;

      // throw error if postcard preview creation fails
      if (!frontPreview || !backPreview) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Postcard preview creation failed",
        });
      }

      // stripe logic
      const product = await stripe.products.create({
        name: input.name || "Postcard",
        // active: input.status === "PUBLISHED",
        description: input.description || "By Post-postcard",
        statement_descriptor: `postcard: ${input.name.slice(0, 12)}`,
        images: [frontPreview, backPreview],
        // default item information
        shippable: true,
        tax_code: "txcd_35020200",
        default_price_data: {
          unit_amount_decimal: "100",
          currency: "usd",
        },
      });

      if (typeof product.default_price !== "string") {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Stripe product creation failed",
        });
      }

      const paymentLink = await stripe.paymentLinks.create({
        line_items: [{ price: product.default_price, quantity: 1 }],
        shipping_address_collection: { allowed_countries: ["US"] },
        // TODO: redirect to custom success page
        after_completion: {
          hosted_confirmation: {
            custom_message:
              "Thank you for your purchase! Your postcard will be shipped by USPS in 1-2 business days.",
          },
          type: "hosted_confirmation",
        },
      });

      const newItem = await ctx.prisma.item.create({
        data: {
          publicationId: input.publicationId,
          name: input.name,
          description: input.description,
          front: input.front,
          back: input.back,
          frontPreview: frontPreview,
          backPreview: backPreview,
          status: input.status,
          stripeProductId: product.id,
          stripePaymentLink: paymentLink.url,
          stripePaymentLinkId: paymentLink.id,
          postcardPreviewId: myPostcard.id,
          size: itemSizeToDB(input.size),
          test: process.env.NODE_ENV === "development",
        },
      });

      if (!newItem) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Item creation failed",
        });
      }

      return newItem;
    },
  })
  .mutation("updateItem", {
    input: z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      front: z.string().url(),
      back: z.string().url(),
      status: z.enum(["DRAFT", "PUBLISHED"]),
      size: z.enum(["4x6", "6x9", "6x11"]),
    }),
    async resolve({ ctx, input }) {
      // create a postcard using lob
      const postcardCreate = new PostcardEditable({
        to: {
          name: "Jane Doe",
          address_line1: "123 Main St",
          address_city: "San Francisco",
          address_state: "CA",
          address_zip: "94111",
        },
        front: input.front,
        back: input.back,
        size: input.size,
      });
      const myPostcard = await new PostcardsApi(testConfig).create(
        postcardCreate
      );

      // throw error if postcard creation fails
      if (!myPostcard) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Postcard creation failed",
        });
      }

      const frontPreview = myPostcard.thumbnails?.[0]?.large;
      const backPreview = myPostcard.thumbnails?.[1]?.large;

      // throw error if postcard preview creation fails
      if (!frontPreview || !backPreview) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Postcard preview creation failed",
        });
      }

      const item = await ctx.prisma.item.findUnique({
        where: {
          id: input.id,
        },
        select: {
          stripeProductId: true,
          stripePaymentLink: true,
        },
      });

      if (!item || !item.stripeProductId || !item.stripePaymentLink) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Stripe product or product link not found",
        });
      }

      // stripe logic
      const product = await stripe.products.update(item.stripeProductId, {
        name: input.name,
        active: input.status === "PUBLISHED",
        description: input.description,
        statement_descriptor: `postcard: ${input.name.slice(0, 12)}`,
        images: [frontPreview, backPreview],
      });

      if (!product) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Stripe product update failed",
        });
      }

      // TODO: update payment link with new price

      const updatedItem = await ctx.prisma.item.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          front: input.front,
          back: input.back,
          frontPreview: frontPreview,
          backPreview: backPreview,
          status: input.status,
          stripeProductId: product.id,
          postcardPreviewId: myPostcard.id,
          postcardPreviewRendered: false,
          size: itemSizeToDB(input.size),
          // stripePaymentLink: item.stripePaymentLink,
        },
      });

      if (!updatedItem) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Item update failed",
        });
      }

      return updatedItem;
    },
  })
  .mutation("deleteItem", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ ctx, input }) {
      const item = await ctx.prisma.item.findUnique({
        where: {
          id: input.id,
        },
        select: {
          stripeProductId: true,
          stripePaymentLinkId: true,
        },
      });

      // deactive stripe product if it exists
      if (item?.stripeProductId) {
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

      // deactivate stripe payment link if it exists
      if (item?.stripePaymentLinkId) {
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

      const deletedItem = await ctx.prisma.item.delete({
        where: {
          id: input.id,
        },
      });

      if (!deletedItem) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Item not deleted",
        });
      }

      return deletedItem;
    },
  });
