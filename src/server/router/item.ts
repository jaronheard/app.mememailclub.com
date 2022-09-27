import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

export const itemRouter = createRouter()
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
      name: z.string().max(100),
      front: z.string().max(100),
      back: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        await ctx.prisma.item.create({
          data: {
            name: input.name,
            front: input.front,
            back: input.back,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });
