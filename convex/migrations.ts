import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import {
  itemSize,
  itemStatus,
  publicationStatus,
  tagCategoryName,
  tagName,
  visibility,
} from "./schema";

const toEpochMs = (iso: string): number => {
  const ms = new Date(iso).getTime();
  if (Number.isNaN(ms)) {
    throw new Error(`Invalid date in import payload: ${iso}`);
  }
  return ms;
};

const TABLES = [
  "items",
  "publications",
  "messages",
  "tags",
  "tagCategories",
  "counters",
] as const;

/**
 * One-shot importer for the legacy MySQL dataset. Feed it the rows straight
 * out of Prisma (numeric ids, ISO date strings) and it rebuilds the graph with
 * Convex ids, backfills `items.tagIds` from the join table, and seeds the
 * `counters` table so new rows keep allocating legacy ids where MySQL left off.
 *
 * Runs as a single transaction, so it is bounded by Convex's per-mutation
 * write limits (~8k documents / 16MB args). Split the dataset across
 * deployments-worth of rows only if that limit is hit.
 */
export const clearAll = internalMutation({
  args: { confirm: v.literal("yes-delete-everything") },
  handler: async (ctx) => {
    const deleted: Record<string, number> = {};
    for (const table of TABLES) {
      const rows = await ctx.db.query(table).collect();
      for (const row of rows) await ctx.db.delete(row._id);
      deleted[table] = rows.length;
    }
    return deleted;
  },
});

export const importAll = internalMutation({
  args: {
    tagCategories: v.array(
      v.object({
        id: v.number(),
        createdAt: v.string(),
        name: tagCategoryName,
        label: v.string(),
      })
    ),
    tags: v.array(
      v.object({
        id: v.number(),
        createdAt: v.string(),
        name: tagName,
        label: v.string(),
        tagCategoryId: v.union(v.number(), v.null()),
      })
    ),
    publications: v.array(
      v.object({
        id: v.number(),
        createdAt: v.string(),
        name: v.string(),
        description: v.string(),
        imageUrl: v.string(),
        authorId: v.string(),
        userId: v.string(),
        status: publicationStatus,
        test: v.boolean(),
        featured: v.boolean(),
      })
    ),
    items: v.array(
      v.object({
        id: v.number(),
        createdAt: v.string(),
        name: v.string(),
        description: v.string(),
        front: v.string(),
        back: v.string(),
        status: itemStatus,
        stripeProductId: v.string(),
        stripePaymentLinkId: v.string(),
        stripePaymentLink: v.string(),
        userId: v.string(),
        publicationId: v.number(),
        test: v.boolean(),
        size: itemSize,
        visibility: visibility,
      })
    ),
    messages: v.array(
      v.object({
        id: v.number(),
        createdAt: v.string(),
        message: v.string(),
        userId: v.string(),
        itemId: v.number(),
      })
    ),
    // rows of the implicit Prisma `_ItemToTag` join table
    itemToTag: v.array(
      v.object({ itemId: v.number(), tagId: v.number() })
    ),
    overwrite: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // --- idempotency -------------------------------------------------------
    const existing: string[] = [];
    for (const table of TABLES) {
      const row = await ctx.db.query(table).first();
      if (row) existing.push(table);
    }
    if (existing.length > 0) {
      if (!args.overwrite) {
        throw new Error(
          `Refusing to import: tables already contain data (${existing.join(
            ", "
          )}). Re-run with overwrite: true to replace it.`
        );
      }
      for (const table of TABLES) {
        for (const row of await ctx.db.query(table).collect()) {
          await ctx.db.delete(row._id);
        }
      }
    }

    // --- tagCategories -----------------------------------------------------
    const tagCategoryIds = new Map<number, Id<"tagCategories">>();
    for (const row of args.tagCategories) {
      const id = await ctx.db.insert("tagCategories", {
        legacyId: row.id,
        createdAt: toEpochMs(row.createdAt),
        name: row.name,
        label: row.label,
      });
      tagCategoryIds.set(row.id, id);
    }

    // --- tags --------------------------------------------------------------
    const tagIds = new Map<number, Id<"tags">>();
    for (const row of args.tags) {
      const tagCategoryId =
        row.tagCategoryId === null
          ? undefined
          : tagCategoryIds.get(row.tagCategoryId);
      if (row.tagCategoryId !== null && tagCategoryId === undefined) {
        throw new Error(
          `Tag ${row.id} references missing tagCategory ${row.tagCategoryId}`
        );
      }
      const id = await ctx.db.insert("tags", {
        legacyId: row.id,
        createdAt: toEpochMs(row.createdAt),
        name: row.name,
        label: row.label,
        tagCategoryId,
      });
      tagIds.set(row.id, id);
    }

    // --- publications ------------------------------------------------------
    const publicationIds = new Map<number, Id<"publications">>();
    for (const row of args.publications) {
      const id = await ctx.db.insert("publications", {
        legacyId: row.id,
        createdAt: toEpochMs(row.createdAt),
        name: row.name,
        description: row.description,
        imageUrl: row.imageUrl,
        authorId: row.authorId,
        userId: row.userId,
        status: row.status,
        test: row.test,
        featured: row.featured,
      });
      publicationIds.set(row.id, id);
    }

    // --- items (tagIds filled from the join table) --------------------------
    const tagIdsByItem = new Map<number, Id<"tags">[]>();
    for (const pair of args.itemToTag) {
      const tagId = tagIds.get(pair.tagId);
      if (!tagId) {
        throw new Error(`itemToTag references missing tag ${pair.tagId}`);
      }
      const list = tagIdsByItem.get(pair.itemId) ?? [];
      list.push(tagId);
      tagIdsByItem.set(pair.itemId, list);
    }

    const itemIds = new Map<number, Id<"items">>();
    for (const row of args.items) {
      const publicationId = publicationIds.get(row.publicationId);
      if (!publicationId) {
        throw new Error(
          `Item ${row.id} references missing publication ${row.publicationId}`
        );
      }
      const id = await ctx.db.insert("items", {
        legacyId: row.id,
        createdAt: toEpochMs(row.createdAt),
        name: row.name,
        description: row.description,
        front: row.front,
        back: row.back,
        status: row.status,
        stripeProductId: row.stripeProductId,
        stripePaymentLinkId: row.stripePaymentLinkId,
        stripePaymentLink: row.stripePaymentLink,
        userId: row.userId,
        publicationId,
        test: row.test,
        size: row.size,
        visibility: row.visibility,
        tagIds: tagIdsByItem.get(row.id) ?? [],
      });
      itemIds.set(row.id, id);
    }

    // --- messages ----------------------------------------------------------
    for (const row of args.messages) {
      const itemId = itemIds.get(row.itemId);
      if (!itemId) {
        throw new Error(`Message ${row.id} references missing item ${row.itemId}`);
      }
      await ctx.db.insert("messages", {
        legacyId: row.id,
        createdAt: toEpochMs(row.createdAt),
        message: row.message,
        userId: row.userId,
        itemId,
      });
    }

    // --- counters ----------------------------------------------------------
    const maxPlusOne = (rows: { id: number }[]) =>
      rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;

    const counters = {
      items: maxPlusOne(args.items),
      publications: maxPlusOne(args.publications),
      messages: maxPlusOne(args.messages),
      tags: maxPlusOne(args.tags),
      tagCategories: maxPlusOne(args.tagCategories),
    };
    for (const [name, value] of Object.entries(counters)) {
      await ctx.db.insert("counters", { name, value });
    }

    return {
      inserted: {
        tagCategories: args.tagCategories.length,
        tags: args.tags.length,
        publications: args.publications.length,
        items: args.items.length,
        messages: args.messages.length,
        itemToTag: args.itemToTag.length,
      },
      counters,
      replacedExistingData: existing.length > 0,
    };
  },
});
