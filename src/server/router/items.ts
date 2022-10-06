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
      try {
        const items = await ctx.prisma.item.findMany({
          ...INCLUDE_PUBLICATION_FIELDS,
          orderBy: {
            createdAt: "asc",
          },
        });
        return items;
      } catch (error) {
        console.log("error", error);
      }
    },
  })
  .query("getOne", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ ctx, input }) {
      try {
        const item = await ctx.prisma.item.findUnique({
          where: {
            id: input.id,
          },
          ...INCLUDE_PUBLICATION_FIELDS,
        });
        return item;
      } catch (error) {
        console.log("error", error);
      }
    },
  })
  .query("getOneByStripeProductId", {
    input: z.object({
      stripeProductId: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        const item = await ctx.prisma.item.findUnique({
          where: {
            stripeProductId: input.stripeProductId,
          },
          // does not ...INCLUDE_PUBLICATION_FIELDS,
        });
        return item;
      } catch (error) {
        console.log("error", error);
      }
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
    }),
    async resolve({ ctx, input }) {
      try {
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
          size: "4x6",
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
          name: input.name,
          // active: input.status === "PUBLISHED",
          description: input.description,
          statement_descriptor: `postcard: ${input.name.slice(0, 12)}`,
          images: [frontPreview, backPreview],
          // default item information
          shippable: true,
          tax_code: "txcd_35020200",
          default_price_data: {
            unit_amount_decimal: "200",
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
          },
        });

        return newItem;
      } catch (error) {
        console.log(error);
      }
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
    }),
    async resolve({ ctx, input }) {
      try {
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
          size: "4x6",
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
            // stripePaymentLink: item.stripePaymentLink,
          },
        });
        return updatedItem;
      } catch (error) {
        console.log(error);
      }
    },
  })
  .mutation("deleteItem", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ ctx, input }) {
      try {
        const item = await ctx.prisma.item.findUnique({
          where: {
            id: input.id,
          },
          select: {
            stripeProductId: true,
            stripePaymentLink: true,
          },
        });

        // delete stripe product if it exists
        if (item?.stripeProductId) {
          const del = await stripe.products.del(item.stripeProductId);
          if (!del.deleted) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Stripe product not deleted",
            });
          }
        }

        // deactivate stripe payment link if it exists
        if (item?.stripePaymentLink) {
          const updatedPaymentLink = await stripe.paymentLinks.update(
            item.stripePaymentLink,
            { active: false }
          );
          if (updatedPaymentLink.active) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Stripe product not deactivated",
            });
          }
        }

        const deleted = await ctx.prisma.item.delete({
          where: {
            id: input.id,
          },
        });

        return deleted;
      } catch (error) {
        console.log(error);
      }
    },
  });
