import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { itemSize, itemStatus, visibility } from "./schema";
import { ITEM_DEFAULTS } from "./lib/itemSize";
import {
  allocateLegacyId,
  getItemByLegacyId,
  getPublicationByLegacyId,
  itemWithRelations,
  itemsWithRelations,
  optionalUserId,
  shapeItem,
} from "./lib/model";

/** Cache publication legacy ids while shaping a batch of items. */
async function shapeItems(
  ctx: { db: { get: (id: Id<"publications">) => Promise<Doc<"publications"> | null> } },
  items: Doc<"items">[]
) {
  const cache = new Map<string, number>();
  const out = [];
  for (const item of items) {
    let legacy = cache.get(item.publicationId);
    if (legacy === undefined) {
      const publication = await ctx.db.get(item.publicationId);
      legacy = publication?.legacyId ?? 0;
      cache.set(item.publicationId, legacy);
    }
    out.push(shapeItem(item, legacy));
  }
  return out;
}

/**
 * Cursor-paginated item feed. Replaces `items.getInfinite`'s hand-rolled
 * id-cursor with Convex pagination; the filter/order args are unchanged.
 *
 * Filtering happens after pagination (Convex cannot express the tag join in an
 * index), so a page may contain fewer than `numItems` items. `isDone` /
 * `continueCursor` remain correct, so `usePaginatedQuery` keeps working.
 */
export const getInfinite = query({
  args: {
    paginationOpts: paginationOptsValidator,
    order: v.optional(
      v.union(v.literal("asc"), v.literal("desc"), v.null())
    ),
    visibility: v.optional(v.union(visibility, v.null())),
    // array of tag names (TagName enum values)
    filters: v.optional(v.union(v.array(v.string()), v.null())),
    anonymousUserId: v.optional(v.union(v.string(), v.null())),
    publicationId: v.optional(v.union(v.number(), v.null())),
  },
  handler: async (ctx, args) => {
    const sortOrder = args.order || "desc";

    // matches `ctx.auth.userId || input.anonymousUserId || undefined`
    const signedInUserId = await optionalUserId(ctx);
    const userId = signedInUserId || args.anonymousUserId || null;

    // Resolve the tag-name filter to tag document ids. No filters (null,
    // undefined, or empty) means no tag constraint at all. The tRPC version
    // leaned on Prisma's `in: undefined`, which degraded to "the item has at
    // least one tag" and hid every untagged public postcard.
    let filterTagIds: Set<string> | null = null;
    if (args.filters && args.filters.length > 0) {
      const allTags = await ctx.db.query("tags").collect();
      const byName = new Map(allTags.map((t) => [t.name as string, t._id]));
      filterTagIds = new Set();
      for (const name of args.filters) {
        const id = byName.get(name);
        if (id) filterTagIds.add(id);
      }
    }

    const publicationDoc = args.publicationId
      ? await getPublicationByLegacyId(ctx, args.publicationId)
      : null;

    if (args.publicationId && !publicationDoc) {
      return {
        page: [],
        isDone: true,
        continueCursor: args.paginationOpts.cursor ?? "",
      };
    }

    const result = publicationDoc
      ? await ctx.db
          .query("items")
          .withIndex("by_publication_legacy", (q) =>
            q.eq("publicationId", publicationDoc._id)
          )
          .order(sortOrder)
          .paginate(args.paginationOpts)
      : await ctx.db
          .query("items")
          .withIndex("by_legacy_id")
          .order(sortOrder)
          .paginate(args.paginationOpts);

    const filtered = result.page.filter((item) => {
      // filter out deleted items
      if (item.status === "DELETED") return false;
      // filter out unedited items (default values). The Prisma query's
      // name/description clauses (`name != "" OR name != "Private postcard"`)
      // are tautologies, so only front/back actually constrain anything.
      if (item.front === ITEM_DEFAULTS.front) return false;
      if (item.back === ITEM_DEFAULTS.back) return false;

      // public items matching the tag filter, or items belonging to the caller
      const publicMatch =
        item.visibility === "PUBLIC" &&
        (filterTagIds === null ||
          item.tagIds.some((id) => filterTagIds.has(id)));
      // A caller with no identity sees PUBLIC items only. Prisma treated
      // `userId: undefined` as a no-op filter, which leaked every user's
      // PRIVATE postcards to anonymous callers.
      const userMatch = userId !== null && item.userId === userId;
      return publicMatch || userMatch;
    });

    return {
      ...result,
      page: await shapeItems(ctx, filtered),
    };
  },
});

/**
 * PRIVATE items are only ever returned to the user who owns them — the tRPC
 * versions of these feeds returned every user's private postcards to any
 * caller.
 */
function visibleTo(userId: string | null) {
  return (item: Doc<"items">) =>
    item.visibility === "PUBLIC" || (userId !== null && item.userId === userId);
}

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await optionalUserId(ctx);
    const items = await ctx.db
      .query("items")
      .withIndex("by_created_at")
      .order("desc")
      .collect();
    return await itemsWithRelations(
      ctx,
      items.filter((item) => item.status !== "DELETED").filter(visibleTo(userId))
    );
  },
});

export const getAllPublished = query({
  // `latestId` is ignored by the original resolver; kept for arg compatibility
  args: { latestId: v.string() },
  handler: async (ctx) => {
    const userId = await optionalUserId(ctx);
    const items = await ctx.db
      .query("items")
      .withIndex("by_status_created_at", (q) => q.eq("status", "PUBLISHED"))
      .order("desc")
      .collect();
    return await itemsWithRelations(ctx, items.filter(visibleTo(userId)));
  },
});

export const getPublished = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query("items")
      .withIndex("by_status_visibility_created_at", (q) =>
        q.eq("status", "PUBLISHED").eq("visibility", "PUBLIC")
      )
      .order("desc")
      .collect();
    return await itemsWithRelations(ctx, items);
  },
});

export const getOne = query({
  args: { id: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const item =
      args.id === undefined ? null : await getItemByLegacyId(ctx, args.id);
    if (!item) {
      throw new Error("Item not found");
    }
    return await itemWithRelations(ctx, item);
  },
});

export const getOneByStripeProductId = query({
  args: { stripeProductId: v.string() },
  handler: async (ctx, args) => {
    const item = await ctx.db
      .query("items")
      .withIndex("by_stripe_product_id", (q) =>
        q.eq("stripeProductId", args.stripeProductId)
      )
      .unique();
    if (!item) {
      throw new Error("Item not found");
    }
    // does not include publication / Messages, matching the original
    const publication = await ctx.db.get(item.publicationId);
    return shapeItem(item, publication?.legacyId ?? 0);
  },
});

/* -------------------------------------------------------------------------- */
/*  Internal halves used by the node actions in convex/itemsNode.ts            */
/* -------------------------------------------------------------------------- */

export const getInternal = internalQuery({
  args: { id: v.number() },
  handler: async (ctx, args) => {
    const item = await getItemByLegacyId(ctx, args.id);
    if (!item) return null;
    const publication = await ctx.db.get(item.publicationId);
    return shapeItem(item, publication?.legacyId ?? 0);
  },
});

export const insertInternal = internalMutation({
  args: {
    publicationId: v.number(),
    name: v.string(),
    description: v.string(),
    front: v.string(),
    back: v.string(),
    status: itemStatus,
    stripeProductId: v.string(),
    stripePaymentLink: v.string(),
    stripePaymentLinkId: v.string(),
    size: itemSize,
    test: v.boolean(),
    userId: v.string(),
    visibility: visibility,
  },
  handler: async (ctx, args) => {
    const publication = await getPublicationByLegacyId(
      ctx,
      args.publicationId
    );
    if (!publication) {
      throw new Error("Item creation failed - publication not found");
    }
    const legacyId = await allocateLegacyId(ctx, "items");
    const id = await ctx.db.insert("items", {
      legacyId,
      createdAt: Date.now(),
      name: args.name,
      description: args.description,
      front: args.front,
      back: args.back,
      status: args.status,
      stripeProductId: args.stripeProductId,
      stripePaymentLink: args.stripePaymentLink,
      stripePaymentLinkId: args.stripePaymentLinkId,
      size: args.size,
      test: args.test,
      userId: args.userId,
      visibility: args.visibility,
      publicationId: publication._id,
      tagIds: [],
    });
    const item = await ctx.db.get(id);
    if (!item) {
      throw new Error("Item creation failed");
    }
    return shapeItem(item, publication.legacyId);
  },
});

export const patchInternal = internalMutation({
  args: {
    id: v.number(),
    name: v.string(),
    description: v.string(),
    front: v.string(),
    back: v.string(),
    status: itemStatus,
    stripeProductId: v.string(),
    size: itemSize,
    visibility: visibility,
  },
  handler: async (ctx, args) => {
    const item = await getItemByLegacyId(ctx, args.id);
    if (!item) {
      throw new Error("Item update failed");
    }
    await ctx.db.patch(item._id, {
      name: args.name,
      description: args.description,
      front: args.front,
      back: args.back,
      status: args.status,
      stripeProductId: args.stripeProductId,
      size: args.size,
      visibility: args.visibility,
    });
    const updated = await ctx.db.get(item._id);
    if (!updated) {
      throw new Error("Item update failed");
    }
    const publication = await ctx.db.get(updated.publicationId);
    return shapeItem(updated, publication?.legacyId ?? 0);
  },
});

export const deleteInternal = internalMutation({
  args: { id: v.number() },
  handler: async (ctx, args) => {
    const item = await getItemByLegacyId(ctx, args.id);
    if (!item) {
      throw new Error("Item not deleted");
    }
    const publication = await ctx.db.get(item.publicationId);
    const shaped = shapeItem(item, publication?.legacyId ?? 0);
    await ctx.db.delete(item._id);
    return shaped;
  },
});

/**
 * Attaches tags to an item. Not part of the tRPC surface (tags were only ever
 * written by hand / by the importer) but needed to keep tagIds maintainable.
 */
export const setTags = mutation({
  args: { id: v.number(), tagNames: v.array(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to perform this action");
    }
    const item = await getItemByLegacyId(ctx, args.id);
    if (!item) {
      throw new Error("Item not found");
    }
    if (
      !(item.userId.startsWith("anonymous") || identity.subject === item.userId)
    ) {
      throw new Error(
        "You must be logged in as the correct user to update a postcard"
      );
    }
    const allTags = await ctx.db.query("tags").collect();
    const byName = new Map(allTags.map((t) => [t.name as string, t._id]));
    const tagIds = args.tagNames
      .map((name) => byName.get(name))
      .filter((id): id is Id<"tags"> => id !== undefined);
    await ctx.db.patch(item._id, { tagIds });
    return { id: item.legacyId, tagIds };
  },
});
