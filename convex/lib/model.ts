/**
 * Shared server helpers: legacy-id allocation, auth guards, and the join /
 * reshaping logic that makes Convex documents look like the Prisma rows the
 * React client already consumes (`id` is the numeric legacy id, relations are
 * numeric ids, `publication` and `Messages` are inlined).
 */
import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

export type CounterName =
  | "items"
  | "publications"
  | "messages"
  | "tags"
  | "tagCategories";

/** Transactionally hand out the next numeric legacy id for a table. */
export async function allocateLegacyId(
  ctx: MutationCtx,
  name: CounterName
): Promise<number> {
  const counter = await ctx.db
    .query("counters")
    .withIndex("by_name", (q) => q.eq("name", name))
    .unique();
  if (!counter) {
    await ctx.db.insert("counters", { name, value: 2 });
    return 1;
  }
  await ctx.db.patch(counter._id, { value: counter.value + 1 });
  return counter.value;
}

/** tRPC `protectedProcedure` equivalent. Returns the Clerk user id. */
export async function requireUserId(
  ctx: QueryCtx | MutationCtx | { auth: QueryCtx["auth"] },
  message = "UNAUTHORIZED"
): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error(message);
  }
  return identity.subject;
}

/** Returns the Clerk user id or null, without throwing. */
export async function optionalUserId(ctx: {
  auth: QueryCtx["auth"];
}): Promise<string | null> {
  const identity = await ctx.auth.getUserIdentity();
  return identity?.subject ?? null;
}

export type PublicationSummary = {
  name: string;
  description: string;
  imageUrl: string;
  userId: string;
};

export type MessageShape = Omit<Doc<"messages">, "itemId"> & {
  id: number;
  itemId: number;
};

export type ItemShape = Omit<Doc<"items">, "publicationId"> & {
  id: number;
  publicationId: number;
  publicationDocId: Id<"publications">;
};

export type ItemWithRelations = ItemShape & {
  publication: PublicationSummary;
  Messages: MessageShape[];
};

export type PublicationShape = Doc<"publications"> & { id: number };

export type PublicationWithItems = PublicationShape & { Items: ItemShape[] };

export type TagShape = Omit<Doc<"tags">, "tagCategoryId"> & {
  id: number;
  tagCategoryId: number | null;
  tagCategoryDocId?: Id<"tagCategories">;
};

export type TagCategoryWithTags = Doc<"tagCategories"> & {
  id: number;
  Tags: TagShape[];
};

/** Prisma row shape for an item: numeric `id` and numeric `publicationId`. */
export function shapeItem(
  item: Doc<"items">,
  publicationLegacyId: number
): ItemShape {
  const { publicationId, ...rest } = item;
  return {
    ...rest,
    id: item.legacyId,
    publicationId: publicationLegacyId,
    publicationDocId: publicationId,
  };
}

export function shapeMessage(
  message: Doc<"messages">,
  itemLegacyId: number
): MessageShape {
  const { itemId, ...rest } = message;
  void itemId;
  return {
    ...rest,
    id: message.legacyId,
    itemId: itemLegacyId,
  };
}

export function shapePublication(
  publication: Doc<"publications">
): PublicationShape {
  return { ...publication, id: publication.legacyId };
}

export function shapeTag(
  tag: Doc<"tags">,
  tagCategoryLegacyId: number | null
): TagShape {
  const { tagCategoryId, ...rest } = tag;
  return {
    ...rest,
    id: tag.legacyId,
    tagCategoryId: tagCategoryLegacyId,
    tagCategoryDocId: tagCategoryId,
  };
}

/**
 * Reproduces Prisma's `INCLUDE_PUBLICATION_FIELDS`:
 * `include: { publication: { select: { name, description, imageUrl, userId } }, Messages: true }`
 */
export async function itemWithRelations(
  ctx: QueryCtx,
  item: Doc<"items">
): Promise<ItemWithRelations> {
  const publication = await ctx.db.get(item.publicationId);
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_item", (q) => q.eq("itemId", item._id))
    .collect();
  return {
    ...shapeItem(item, publication?.legacyId ?? 0),
    publication: {
      name: publication?.name ?? "",
      description: publication?.description ?? "",
      imageUrl: publication?.imageUrl ?? "",
      userId: publication?.userId ?? "",
    },
    Messages: messages.map((m) => shapeMessage(m, item.legacyId)),
  };
}

export async function itemsWithRelations(
  ctx: QueryCtx,
  items: Doc<"items">[]
): Promise<ItemWithRelations[]> {
  return Promise.all(items.map((item) => itemWithRelations(ctx, item)));
}

/**
 * Reproduces Prisma's `include: { Items: true }` on a publication, minus the
 * items the caller is not allowed to see. `isVisible` defaults to "everything",
 * so callers must opt into a policy explicitly.
 */
export async function publicationWithItems(
  ctx: QueryCtx,
  publication: Doc<"publications">,
  isVisible: (item: Doc<"items">) => boolean = () => true
): Promise<PublicationWithItems> {
  const items = await ctx.db
    .query("items")
    .withIndex("by_publication", (q) => q.eq("publicationId", publication._id))
    .collect();
  return {
    ...shapePublication(publication),
    Items: items
      .filter(isVisible)
      .map((item) => shapeItem(item, publication.legacyId)),
  };
}

/**
 * Item visibility for the publication feeds: PUBLIC to everyone, otherwise
 * only to the owner — identified by their Clerk subject or, for signed-out
 * anonymous authors, by the anonymousUserId the page carries.
 */
export function itemVisibleToViewer(
  clerkUserId: string | null,
  anonymousUserId?: string | null
) {
  return (item: Doc<"items">): boolean =>
    item.visibility === "PUBLIC" ||
    (clerkUserId !== null && item.userId === clerkUserId) ||
    (!!anonymousUserId && item.userId === anonymousUserId);
}

export async function getItemByLegacyId(
  ctx: QueryCtx,
  legacyId: number
): Promise<Doc<"items"> | null> {
  return await ctx.db
    .query("items")
    .withIndex("by_legacy_id", (q) => q.eq("legacyId", legacyId))
    .unique();
}

export async function getPublicationByLegacyId(
  ctx: QueryCtx,
  legacyId: number
): Promise<Doc<"publications"> | null> {
  return await ctx.db
    .query("publications")
    .withIndex("by_legacy_id", (q) => q.eq("legacyId", legacyId))
    .unique();
}

export async function getMessageByLegacyId(
  ctx: QueryCtx,
  legacyId: number
): Promise<Doc<"messages"> | null> {
  return await ctx.db
    .query("messages")
    .withIndex("by_legacy_id", (q) => q.eq("legacyId", legacyId))
    .unique();
}
