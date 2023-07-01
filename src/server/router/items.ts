import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Context, createRouter } from "./context";
import Stripe from "stripe";
import { env } from "../../env/server.mjs";
import {
  ITEM_DEFAULTS,
  PRIVATE_ITEM_DEFAULTS,
  itemSizeToDB,
} from "../../utils/itemSize";
import { TagName } from "@prisma/client";

const bannerHeading = encodeURIComponent("Your postcard is on its way! 📮✨");
const bannerText = encodeURIComponent("Send another for just $1!");

const INCLUDE_PUBLICATION_FIELDS = {
  include: {
    publication: {
      select: {
        name: true,
        description: true,
        imageUrl: true,
        userId: true,
      },
    },
    Messages: true,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15",
});

const createPostcardInput = z.object({
  publicationId: z.number(),
  name: z.string(),
  description: z.string(),
  front: z.string().url(),
  back: z.string().url(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  size: z.enum(["4x6", "6x9", "6x11"]),
  visibility: z.enum(["PUBLIC", "PRIVATE"]),
  anonymousUserId: z.string().optional(),
});

type CreatePostcard = z.infer<typeof createPostcardInput>;

async function createPostcard({
  ctx,
  input,
}: {
  ctx: Context;
  input: CreatePostcard;
}) {
  if (!input.anonymousUserId && !ctx.auth.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to create an item",
    });
  }

  // stripe logic
  const product = await stripe.products.create({
    name: input.name || "Postcard",
    // active: input.status === "PUBLISHED",
    description: `6"x9" postcard with your message`,
    statement_descriptor: `postcard: ${input.name.slice(0, 12)}`,
    images: [input.front, input.back],
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
    custom_text: {
      shipping_address: {
        message: "The shipping address is where we’ll send the postcard.",
      },
    },
    after_completion: {
      type: "redirect",
      redirect: {
        url: `${env.NEXT_PUBLIC_APP_URL}/send?bannerHeading=${bannerHeading}&bannerText=${bannerText}&utm_source=stripe&utm_medium=paymentlink&utm_campaign=send`,
      },
    },
  });

  const newItem = await ctx.prisma.item.create({
    data: {
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
      userId: ctx.auth.userId || input.anonymousUserId || "anonymous",
      visibility: input.visibility,
    },
  });

  if (!newItem) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Item creation failed",
    });
  }

  return newItem;
}

export const items = createRouter()
  .query("getInfinite", {
    input: z.object({
      limit: z.number().min(1).max(100).nullish(),
      order: z.enum(["asc", "desc"]).nullish(),
      visibility: z.enum(["PUBLIC", "PRIVATE"]).nullish(),
      // filters is an array of tag category names
      filters: z.array(z.string()).nullish(),
      cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
      anonymousUserId: z.string().nullish(), // optional anonymous user id to get a single item
    }),
    async resolve({ ctx, input }) {
      const sortOrder = input.order || "desc";
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const items = await ctx.prisma.item.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor if there is no id specified
        where: {
          AND: [
            {
              // filter out deleted items
              status: {
                not: "DELETED",
              },
            },
            {
              // filter out unedited items (default values)
              AND: [
                {
                  front: {
                    not: ITEM_DEFAULTS.front,
                  },
                },
                {
                  back: {
                    not: ITEM_DEFAULTS.back,
                  },
                },
                {
                  OR: [
                    {
                      name: {
                        not: ITEM_DEFAULTS.name,
                      },
                    },
                    { name: { not: PRIVATE_ITEM_DEFAULTS.name } },
                  ],
                },
                {
                  OR: [
                    {
                      description: {
                        not: ITEM_DEFAULTS.description,
                      },
                    },
                    { description: { not: PRIVATE_ITEM_DEFAULTS.description } },
                  ],
                },
              ],
            },
          ],
          OR: [
            // public items with matching tags, or private items belonging to the user
            {
              visibility: "PUBLIC",
              Tags: {
                some: {
                  name: {
                    in: input.filters as TagName[],
                  },
                },
              },
            },
            {
              userId: ctx.auth.userId || input.anonymousUserId || undefined,
            },
          ],
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: sortOrder,
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }
      return {
        items,
        nextCursor,
      };
    },
  })
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
          createdAt: "desc",
        },
      });
      return items;
    },
  })
  .query("getAllPublished", {
    input: z.object({
      latestId: z.string(),
    }),
    async resolve({ ctx }) {
      const items = await ctx.prisma.item.findMany({
        where: {
          status: "PUBLISHED",
        },
        ...INCLUDE_PUBLICATION_FIELDS,
        orderBy: {
          createdAt: "desc",
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
          visibility: "PUBLIC",
        },
        ...INCLUDE_PUBLICATION_FIELDS,
        orderBy: {
          createdAt: "desc",
        },
      });
      return items;
    },
  })
  .query("getOne", {
    input: z.object({
      id: z.number().optional(),
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
  .mutation("createItemForAnonymousUser", {
    input: z.object({
      name: z.string(),
      description: z.string(),
      front: z.string().url(),
      back: z.string().url(),
      status: z.enum(["DRAFT", "PUBLISHED"]),
      size: z.enum(["4x6", "6x9", "6x11"]),
      visibility: z.enum(["PUBLIC", "PRIVATE"]),
      anonymousUserId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const publication = await ctx.prisma.publication.findFirst({
        where: {
          userId: input.anonymousUserId,
        },
      });
      let newPublication;
      if (!publication) {
        // create a publication for this user
        newPublication = await ctx.prisma.publication.create({
          data: {
            authorId: input.anonymousUserId,
            userId: input.anonymousUserId,
            name: "My Postcards",
            description: "Uncategorized postcards",
            imageUrl:
              "https://res.cloudinary.com/jaronheard/image/upload/v1685474738/folder_fpgnfp.png",
            status: "PUBLISHED",
          },
        });
        if (!newPublication) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Postcard creation failed - error creating publication",
          });
        }
      }

      // ensure publication promise is resolved
      const publicationId = publication?.id || newPublication?.id;
      if (!publicationId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Postcard creation failed - error determining publication",
        });
      }

      const newItem = await createPostcard({
        ctx,
        input: {
          publicationId: publicationId,
          name: input.name,
          description: input.description,
          front: input.front,
          back: input.back,
          status: input.status,
          size: input.size,
          visibility: input.visibility,
          anonymousUserId: input.anonymousUserId,
        },
      });
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
      visibility: z.enum(["PUBLIC", "PRIVATE"]),
    }),
    async resolve({ ctx, input }) {
      const item = await ctx.prisma.item.findUnique({
        where: {
          id: input.id,
        },
        select: {
          userId: true,
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

      // check if user is authorized to update this item
      if (
        !(
          item.userId.startsWith("anonymous") || ctx.auth.userId === item.userId
        )
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "You must be logged in as the correct user to update a postcard",
        });
      }

      // stripe logic
      const product = await stripe.products.update(item.stripeProductId, {
        name: input.name,
        active: input.status === "PUBLISHED",
        statement_descriptor: `postcard: ${input.name.slice(0, 12)}`,
        images: [input.front, input.back],
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
          status: input.status,
          stripeProductId: product.id,
          size: itemSizeToDB(input.size),
          visibility: input.visibility,
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
  .middleware(async ({ ctx, next }) => {
    // Any queries or mutations after this middleware will
    // raise an error unless there is a current session
    if (!ctx.auth.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to perform this action",
      });
    }
    return next();
  })
  .mutation("createItem", {
    input: z.object({
      // TODO: ensure that the user is the owner of the publication
      publicationId: z.number(),
      name: z.string(),
      description: z.string(),
      front: z.string().url(),
      back: z.string().url(),
      status: z.enum(["DRAFT", "PUBLISHED"]),
      size: z.enum(["4x6", "6x9", "6x11"]),
      visibility: z.enum(["PUBLIC", "PRIVATE"]),
    }),
    resolve: createPostcard,
  })
  .mutation("createItemForUser", {
    input: z.object({
      name: z.string(),
      description: z.string(),
      front: z.string().url(),
      back: z.string().url(),
      status: z.enum(["DRAFT", "PUBLISHED"]),
      size: z.enum(["4x6", "6x9", "6x11"]),
      visibility: z.enum(["PUBLIC", "PRIVATE"]),
    }),
    async resolve({ ctx, input }) {
      if (!ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to create a new item",
        });
      }
      const publication = await ctx.prisma.publication.findFirst({
        where: {
          userId: ctx.auth.userId,
        },
      });
      let newPublication;
      if (!publication) {
        // create a publication for this user
        newPublication = await ctx.prisma.publication.create({
          data: {
            authorId: ctx.auth.userId,
            userId: ctx.auth.userId,
            name: "My Postcards",
            description: "Uncategorized postcards",
            imageUrl:
              "https://res.cloudinary.com/jaronheard/image/upload/v1685474738/folder_fpgnfp.png",
            status: "PUBLISHED",
          },
        });
        if (!newPublication) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Postcard creation failed - error creating publication",
          });
        }
      }

      // ensure publication promise is resolved
      const publicationId = publication?.id || newPublication?.id;
      if (!publicationId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Postcard creation failed - error determining publication",
        });
      }

      const newItem = await createPostcard({
        ctx,
        input: {
          publicationId: publicationId,
          name: input.name,
          description: input.description,
          front: input.front,
          back: input.back,
          status: input.status,
          size: input.size,
          visibility: input.visibility,
        },
      });
      return newItem;
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
          userId: true,
          stripeProductId: true,
          stripePaymentLinkId: true,
        },
      });

      // check if item exists
      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Item not found",
        });
      }

      // check if stripe product and payment link exist
      if (!item.stripeProductId || !item.stripePaymentLinkId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Stripe product or product link not found",
        });
      }

      // check if user is authorized to delete this item
      if (
        !(
          item.userId.startsWith("anonymous") || ctx.auth.userId === item.userId
        )
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "You must be logged in as the correct user to delete a postcard",
        });
      }

      // deactive stripe product
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

      // delete item
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
