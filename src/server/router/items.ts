import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-08-01",
});

export const items = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      try {
        return await ctx.prisma.item.findMany({
          select: {
            name: true,
            front: true,
            back: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
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
        return await ctx.prisma.item.findUnique({
          where: {
            id: input.id,
          },
          select: {
            name: true,
            description: true,
            imageUrl: true,
            front: true,
            back: true,
            stripePaymentLink: true,
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
        });
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
        return await ctx.prisma.item.findUnique({
          where: {
            stripeProductId: input.stripeProductId,
          },
          select: {
            id: true,
            front: true,
            back: true,
          },
        });
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
      imageUrl: z.string().url(),
      front: z.string().url(),
      back: z.string().url(),
      status: z.enum(["DRAFT", "PUBLISHED"]),
    }),
    async resolve({ ctx, input }) {
      try {
        // stripe logic
        const product = await stripe.products.create({
          name: input.name,
          active: input.status === "PUBLISHED",
          description: input.description,
          statement_descriptor: `postcard: ${input.name.slice(0, 12)}`,
          images: [input.imageUrl],
          // default item information
          shippable: true,
          tax_code: "txcd_35020200",
          default_price_data: {
            unit_amount_decimal: "200",
            currency: "usd",
          },
        });

        if (typeof product.default_price !== "string") {
          throw new Error("No default price id");
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

        await ctx.prisma.item.create({
          data: {
            publicationId: input.publicationId,
            name: input.name,
            description: input.description,
            imageUrl: input.imageUrl,
            front: input.front,
            back: input.back,
            status: input.status,
            stripeProductId: product.id,
            stripePaymentLink: paymentLink.url,
          },
        });
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
      imageUrl: z.string().url(),
      front: z.string().url(),
      back: z.string().url(),
      status: z.enum(["DRAFT", "PUBLISHED"]),
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
          images: [input.imageUrl],
        });

        // TODO: update payment link with new price

        await ctx.prisma.item.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            description: input.description,
            imageUrl: input.imageUrl,
            front: input.front,
            back: input.back,
            status: input.status,
            stripeProductId: product.id,
            // stripePaymentLink: item.stripePaymentLink,
          },
        });
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

        await ctx.prisma.item.delete({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });
