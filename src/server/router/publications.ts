import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

const INCLUDE_RELATIONS = {
  include: {
    Items: true,
  },
};

const BasePublication = z.object({
  name: z.string(),
  description: z.string(),
  imageUrl: z.string().url(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});
// TODO: check if these types are needed anymore
const HasUserId = z.object({
  userId: z.string(),
});
const HadId = z.object({
  id: z.number(),
});
const CreatePublication = BasePublication.merge(HasUserId);
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
  .query("getFeatured", {
    async resolve({ ctx }) {
      const publications = await ctx.prisma.publication.findMany({
        where: {
          featured: true,
        },
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
  .query("getAllByAuthor", {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const publications = await ctx.prisma.publication.findMany({
        where: {
          userId: input.userId,
        },
        ...INCLUDE_RELATIONS,
        orderBy: {
          createdAt: "desc",
        },
      });
      return publications;
    },
  })
  .query("getAllByNotAuthor", {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const publications = await ctx.prisma.publication.findMany({
        where: {
          userId: input.userId,
        },
        ...INCLUDE_RELATIONS,
        orderBy: {
          createdAt: "desc",
        },
      });
      return publications;
    },
  })
  .middleware(async ({ ctx, next }) => {
    // Any queries or mutations after this middleware will
    // raise an error unless there is a current session
    if (!ctx.auth.userId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next();
  })
  .mutation("createPublication", {
    input: CreatePublication,
    async resolve({ ctx, input }) {
      const publication = await ctx.prisma.publication.create({
        data: {
          authorId: input.userId,
          userId: input.userId,
          name: input.name,
          description: input.description,
          imageUrl: input.imageUrl,
          status: input.status,
          test: process.env.NODE_ENV === "development",
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
      // find publication
      const publication = await ctx.prisma.publication.findUnique({
        where: {
          id: input.id,
        },
        select: {
          userId: true,
        },
      });

      // check if item exists
      if (!publication) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Item not found",
        });
      }

      // check if user is authorized
      if (
        publication.userId !== "anonymous" &&
        ctx.auth.userId !== publication.userId
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "You must be logged in as the correct user to delete a publication",
        });
      }

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
          message: "Publication not found or not authorized",
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
      // find publication
      const publication = await ctx.prisma.publication.findUnique({
        where: {
          id: input.id,
        },
        select: {
          userId: true,
        },
      });

      // check if item exists
      if (!publication) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Item not found",
        });
      }

      // check if user is authorized
      if (
        publication.userId !== "anonymous" &&
        ctx.auth.userId !== publication.userId
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "You must be logged in as the correct user to delete a publication",
        });
      }

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
