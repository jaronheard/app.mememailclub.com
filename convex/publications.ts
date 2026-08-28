import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { publicationStatus } from "./schema";
import {
  allocateLegacyId,
  getPublicationByLegacyId,
  itemVisibleToViewer,
  optionalUserId,
  publicationWithItems,
  requireUserId,
  shapePublication,
} from "./lib/model";

const DEFAULT_PUBLICATION_IMAGE =
  "https://res.cloudinary.com/jaronheard/image/upload/v1685474738/folder_fpgnfp.png";

export const getAll = query({
  args: { anonymousUserId: v.optional(v.union(v.string(), v.null())) },
  handler: async (ctx, args) => {
    const clerkUserId = await optionalUserId(ctx);
    const isVisible = itemVisibleToViewer(clerkUserId, args.anonymousUserId);
    const publications = await ctx.db
      .query("publications")
      .withIndex("by_created_at")
      .order("desc")
      .collect();
    return await Promise.all(
      publications.map((p) => publicationWithItems(ctx, p, isVisible))
    );
  },
});

/**
 * Homepage surface: the inlined items are rendered publicly, so only
 * PUBLISHED + PUBLIC ones are included regardless of who is asking.
 */
export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    const publications = await ctx.db
      .query("publications")
      .withIndex("by_featured_created_at", (q) => q.eq("featured", true))
      .order("desc")
      .collect();
    return await Promise.all(
      publications.map((p) =>
        publicationWithItems(
          ctx,
          p,
          (item) => item.status === "PUBLISHED" && item.visibility === "PUBLIC"
        )
      )
    );
  },
});

export const getOne = query({
  args: {
    id: v.number(),
    anonymousUserId: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const clerkUserId = await optionalUserId(ctx);
    const publication = await getPublicationByLegacyId(ctx, args.id);
    if (!publication) {
      throw new Error("Publication not found");
    }
    return await publicationWithItems(
      ctx,
      publication,
      itemVisibleToViewer(clerkUserId, args.anonymousUserId)
    );
  },
});

export const getAllByAuthor = query({
  args: {
    userId: v.string(),
    anonymousUserId: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const clerkUserId = await optionalUserId(ctx);
    const isVisible = itemVisibleToViewer(clerkUserId, args.anonymousUserId);
    const publications = await ctx.db
      .query("publications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    publications.sort((a, b) => b.createdAt - a.createdAt);
    return await Promise.all(
      publications.map((p) => publicationWithItems(ctx, p, isVisible))
    );
  },
});

export const createPublication = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    imageUrl: v.string(),
    status: publicationStatus,
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    await requireUserId(ctx);
    const legacyId = await allocateLegacyId(ctx, "publications");
    const id = await ctx.db.insert("publications", {
      legacyId,
      createdAt: Date.now(),
      authorId: args.userId,
      userId: args.userId,
      name: args.name,
      description: args.description,
      imageUrl: args.imageUrl,
      status: args.status,
      test: process.env.NODE_ENV === "development",
      featured: false,
    });
    const publication = await ctx.db.get(id);
    if (!publication) {
      throw new Error("Publication not created");
    }
    return shapePublication(publication);
  },
});

export const updatePublication = mutation({
  args: {
    id: v.number(),
    name: v.string(),
    description: v.string(),
    imageUrl: v.string(),
    status: publicationStatus,
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const publication = await getPublicationByLegacyId(ctx, args.id);
    if (!publication) {
      throw new Error("Item not found");
    }
    if (publication.userId !== "anonymous" && userId !== publication.userId) {
      throw new Error(
        "You must be logged in as the correct user to delete a publication"
      );
    }
    await ctx.db.patch(publication._id, {
      name: args.name,
      description: args.description,
      imageUrl: args.imageUrl,
      status: args.status,
    });
    const updated = await ctx.db.get(publication._id);
    if (!updated) {
      throw new Error("Publication not found or not authorized");
    }
    return shapePublication(updated);
  },
});

export const deletePublication = mutation({
  args: { id: v.number() },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const publication = await getPublicationByLegacyId(ctx, args.id);
    if (!publication) {
      throw new Error("Item not found");
    }
    if (publication.userId !== "anonymous" && userId !== publication.userId) {
      throw new Error(
        "You must be logged in as the correct user to delete a publication"
      );
    }
    const shaped = shapePublication(publication);
    await ctx.db.delete(publication._id);
    return shaped;
  },
});

/**
 * `findFirst({ where: { userId } })`, creating the "My Postcards" default
 * publication when the user has none. Used by the item-creation actions; run
 * as a mutation so the find-or-create is transactional.
 */
export const ensureForUserInternal = internalMutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("publications")
      .withIndex("by_user_legacy", (q) => q.eq("userId", args.userId))
      .first();
    if (existing) {
      return shapePublication(existing);
    }
    const legacyId = await allocateLegacyId(ctx, "publications");
    const id = await ctx.db.insert("publications", {
      legacyId,
      createdAt: Date.now(),
      authorId: args.userId,
      userId: args.userId,
      name: "My Postcards",
      description: "Uncategorized postcards",
      imageUrl: DEFAULT_PUBLICATION_IMAGE,
      status: "PUBLISHED",
      test: false,
      featured: false,
    });
    const created = await ctx.db.get(id);
    if (!created) {
      throw new Error("Postcard creation failed - error creating publication");
    }
    return shapePublication(created);
  },
});
