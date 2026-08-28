import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Enum values are kept byte-for-byte identical to what Prisma/MySQL stored so
 * that the React client needs no translation layer.
 */
export const itemStatus = v.union(
  v.literal("DELETED"),
  v.literal("DRAFT"),
  v.literal("PUBLISHED")
);

export const publicationStatus = v.union(
  v.literal("DELETED"),
  v.literal("DRAFT"),
  v.literal("PUBLISHED")
);

export const itemSize = v.union(
  v.literal("sz_4x6"),
  v.literal("sz_6x9"),
  v.literal("sz_6x11")
);

export const visibility = v.union(v.literal("PUBLIC"), v.literal("PRIVATE"));

export const tagCategoryName = v.union(
  v.literal("OCCASION"),
  v.literal("TONE")
);

export const tagName = v.union(
  v.literal("ANNIVERSARY"),
  v.literal("BIRTHDAY"),
  v.literal("CONGRATS"),
  v.literal("FRIENDSHIP"),
  v.literal("GET_WELL"),
  v.literal("LOVE"),
  v.literal("SYMPATHY"),
  v.literal("THANK_YOU"),
  v.literal("WEDDING"),
  v.literal("FUNNY"),
  v.literal("HEARTFELT"),
  v.literal("INSPIRATIONAL"),
  v.literal("ROMANTIC"),
  v.literal("SWEET"),
  v.literal("THOUGHTFUL"),
  v.literal("UPLIFTING"),
  v.literal("WITTY")
);

export default defineSchema({
  items: defineTable({
    // numeric id carried over from Prisma; public URLs and Stripe metadata use it
    legacyId: v.number(),
    createdAt: v.number(), // epoch ms
    name: v.string(),
    description: v.string(),
    front: v.string(),
    back: v.string(),
    status: itemStatus,
    stripeProductId: v.string(),
    stripePaymentLinkId: v.string(),
    stripePaymentLink: v.string(),
    userId: v.string(),
    publicationId: v.id("publications"),
    test: v.boolean(),
    size: itemSize,
    visibility: visibility,
    // many-to-many with tags (was the implicit Prisma _ItemToTag join table)
    tagIds: v.array(v.id("tags")),
  })
    .index("by_legacy_id", ["legacyId"])
    .index("by_publication", ["publicationId"])
    .index("by_publication_legacy", ["publicationId", "legacyId"])
    .index("by_user", ["userId"])
    .index("by_stripe_product_id", ["stripeProductId"])
    .index("by_created_at", ["createdAt"])
    .index("by_status_created_at", ["status", "createdAt"])
    .index("by_status_visibility_created_at", [
      "status",
      "visibility",
      "createdAt",
    ]),

  publications: defineTable({
    legacyId: v.number(),
    createdAt: v.number(),
    name: v.string(),
    description: v.string(),
    imageUrl: v.string(),
    authorId: v.string(),
    userId: v.string(),
    status: publicationStatus,
    test: v.boolean(),
    featured: v.boolean(),
  })
    .index("by_legacy_id", ["legacyId"])
    .index("by_user", ["userId"])
    .index("by_user_legacy", ["userId", "legacyId"])
    .index("by_created_at", ["createdAt"])
    .index("by_featured_created_at", ["featured", "createdAt"]),

  messages: defineTable({
    legacyId: v.number(),
    createdAt: v.number(),
    message: v.string(),
    userId: v.string(),
    itemId: v.id("items"),
  })
    .index("by_legacy_id", ["legacyId"])
    .index("by_item", ["itemId"])
    .index("by_user", ["userId"])
    .index("by_user_created_at", ["userId", "createdAt"]),

  tags: defineTable({
    legacyId: v.number(),
    createdAt: v.number(),
    name: tagName,
    label: v.string(),
    tagCategoryId: v.optional(v.id("tagCategories")),
  })
    .index("by_legacy_id", ["legacyId"])
    .index("by_name", ["name"])
    .index("by_tag_category", ["tagCategoryId"]),

  tagCategories: defineTable({
    legacyId: v.number(),
    createdAt: v.number(),
    name: tagCategoryName,
    label: v.string(),
  })
    .index("by_legacy_id", ["legacyId"])
    .index("by_name", ["name"]),

  // allocates the next numeric legacyId per table, transactionally
  counters: defineTable({
    name: v.string(),
    value: v.number(),
  }).index("by_name", ["name"]),
});
