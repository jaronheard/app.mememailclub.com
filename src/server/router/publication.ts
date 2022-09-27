import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

export const publicationRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      try {
        return await ctx.prisma.publication.findMany({
          select: {
            name: true,
            description: true,
            author: true,
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
  .mutation("createPublication", {
    input: z.object({
      authorId: z.string(),
      name: z.string(),
      description: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        await ctx.prisma.publication.create({
          data: {
            authorId: input.authorId,
            name: input.name,
            description: input.description,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });
