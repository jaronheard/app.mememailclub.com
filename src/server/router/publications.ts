import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

export const publications = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      try {
        const publications = await ctx.prisma.publication.findMany({
          select: {
            id: true,
            createdAt: true,
            name: true,
            description: true,
            author: true,
            imageUrl: true,
            status: true,
            Subscriptions: true,
            Items: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        return publications;
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
        const publication = await ctx.prisma.publication.findUnique({
          where: {
            id: input.id,
          },
          select: {
            id: true,
            createdAt: true,
            name: true,
            description: true,
            author: true,
            imageUrl: true,
            status: true,
            Subscriptions: true,
            Items: true,
          },
        });
        return publication;
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
      imageUrl: z.string().url(),
      status: z.enum(["DRAFT", "PUBLISHED"]),
    }),
    async resolve({ ctx, input }) {
      try {
        const publication = await ctx.prisma.publication.create({
          data: {
            authorId: input.authorId,
            name: input.name,
            description: input.description,
            imageUrl: input.imageUrl,
            status: input.status,
          },
        });
        return publication;
      } catch (error) {
        console.log(error);
      }
    },
  })
  .mutation("updatePublication", {
    input: z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      imageUrl: z.string().url(),
      status: z.enum(["DRAFT", "PUBLISHED"]),
    }),
    async resolve({ ctx, input }) {
      try {
        const updatedPublication = await ctx.prisma.publication.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            description: input.description,
            imageUrl: input.imageUrl,
            status: input.status,
          },
        });
        return updatedPublication;
      } catch (error) {
        console.log(error);
      }
    },
  })
  .mutation("deletePublication", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ ctx, input }) {
      try {
        const deleted = await ctx.prisma.publication.delete({
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
