import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

const INCLUDE_RELATIONS = {
  include: {
    Items: true,
    Subscriptions: true,
  },
};

const BasePublication = z.object({
  authorId: z.string(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string().url(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});
const HadId = z.object({
  id: z.number(),
});
const CreatePublication = BasePublication;
const UpdatePublication = BasePublication.merge(HadId);

export const publications = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      const publications = await ctx.prisma.publication.findMany({
        ...INCLUDE_RELATIONS,
        orderBy: {
          createdAt: "desc",
        },
      });
      return publications;
    },
  })
  .query("getOne", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ ctx, input }) {
      const publication = await ctx.prisma.publication.findUnique({
        where: {
          id: input.id,
        },
        ...INCLUDE_RELATIONS,
      });
      // handle error
      if (!publication) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Publication not found",
        });
      }
      return publication;
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
    input: CreatePublication,
    async resolve({ ctx, input }) {
      const publication = await ctx.prisma.publication.create({
        data: {
          authorId: input.authorId,
          name: input.name,
          description: input.description,
          imageUrl: input.imageUrl,
          status: input.status,
        },
      });
      if (!publication) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Publication not created",
        });
      }
      return publication;
    },
  })
  .mutation("updatePublication", {
    input: UpdatePublication,
    async resolve({ ctx, input }) {
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
      if (!updatedPublication) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Publication not updated",
        });
      }
      return updatedPublication;
    },
  })
  .mutation("deletePublication", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ ctx, input }) {
      const deleted = await ctx.prisma.publication.delete({
        where: {
          id: input.id,
        },
      });
      if (!deleted) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Publication not deleted",
        });
      }
      return deleted;
    },
  });
