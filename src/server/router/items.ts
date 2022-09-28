import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

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
        await ctx.prisma.item.create({
          data: {
            publicationId: input.publicationId,
            name: input.name,
            description: input.description,
            imageUrl: input.imageUrl,
            front: input.front,
            back: input.back,
            status: input.status,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });
