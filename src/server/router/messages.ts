import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

export const messages = createRouter()
  .mutation("createMessage", {
    input: z.object({
      message: z.string(),
      userId: z.string(),
      itemId: z.number(),
    }),
    async resolve({ ctx, input }) {
      const message = await ctx.prisma.message.create({
        data: {
          message: input.message,
          userId: input.userId,
          itemId: input.itemId,
        },
      });
      if (!message) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Message not created",
        });
      }
      return message;
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
  .query("getOne", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ ctx, input }) {
      const message = await ctx.prisma.message.findUnique({
        where: {
          id: input.id,
        },
      });
      // handle error
      if (!message) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Message not found",
        });
      }
      return message;
    },
  })
  .query("getAllByAuthor", {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const messages = await ctx.prisma.message.findMany({
        where: {
          userId: input.userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return messages;
    },
  })
  .mutation("updateMessage", {
    input: z.object({
      id: z.number(),
      message: z.string(),
    }),
    async resolve({ ctx, input }) {
      const message = await ctx.prisma.message.update({
        where: {
          id: input.id,
        },
        data: {
          message: input.message,
        },
      });
      if (!message) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Message not created",
        });
      }
      return message;
    },
  });
