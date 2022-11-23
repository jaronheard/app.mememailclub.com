import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

export const messages = createRouter()
  .middleware(async ({ ctx, next }) => {
    // Any queries or mutations after this middleware will
    // raise an error unless there is a current session
    if (!ctx.session) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next();
  })
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
