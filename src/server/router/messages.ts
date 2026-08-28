import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./context";

export const messages = router({
  createMessage: publicProcedure
    .input(
      z.object({
        message: z.string(),
        userId: z.string(),
        itemId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
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
    }),
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
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
    }),
  getAllByAuthor: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const messages = await ctx.prisma.message.findMany({
        where: {
          userId: input.userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return messages;
    }),
  updateMessage: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        message: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
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
    }),
});
