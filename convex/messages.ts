import { v } from "convex/values";
import { internalQuery, mutation, query } from "./_generated/server";
import {
  allocateLegacyId,
  getItemByLegacyId,
  getMessageByLegacyId,
  requireUserId,
  shapeMessage,
} from "./lib/model";

export const createMessage = mutation({
  args: {
    message: v.string(),
    userId: v.string(),
    itemId: v.number(),
  },
  handler: async (ctx, args) => {
    const item = await getItemByLegacyId(ctx, args.itemId);
    if (!item) {
      throw new Error("Message not created");
    }
    const legacyId = await allocateLegacyId(ctx, "messages");
    const id = await ctx.db.insert("messages", {
      legacyId,
      createdAt: Date.now(),
      message: args.message,
      userId: args.userId,
      itemId: item._id,
    });
    const message = await ctx.db.get(id);
    if (!message) {
      throw new Error("Message not created");
    }
    return shapeMessage(message, item.legacyId);
  },
});

export const getOne = query({
  args: { id: v.number() },
  handler: async (ctx, args) => {
    await requireUserId(ctx);
    const message = await getMessageByLegacyId(ctx, args.id);
    if (!message) {
      throw new Error("Message not found");
    }
    const item = await ctx.db.get(message.itemId);
    return shapeMessage(message, item?.legacyId ?? 0);
  },
});

export const getAllByAuthor = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    await requireUserId(ctx);
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_user_created_at", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
    const cache = new Map<string, number>();
    const out = [];
    for (const message of messages) {
      let legacy = cache.get(message.itemId);
      if (legacy === undefined) {
        const item = await ctx.db.get(message.itemId);
        legacy = item?.legacyId ?? 0;
        cache.set(message.itemId, legacy);
      }
      out.push(shapeMessage(message, legacy));
    }
    return out;
  },
});

export const updateMessage = mutation({
  args: {
    id: v.number(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    await requireUserId(ctx);
    const message = await getMessageByLegacyId(ctx, args.id);
    if (!message) {
      throw new Error("Message not created");
    }
    await ctx.db.patch(message._id, { message: args.message });
    const updated = await ctx.db.get(message._id);
    if (!updated) {
      throw new Error("Message not created");
    }
    const item = await ctx.db.get(updated.itemId);
    return shapeMessage(updated, item?.legacyId ?? 0);
  },
});

/** Used by convex/lob.ts to resolve `client_reference_id` to a message. */
export const getInternal = internalQuery({
  args: { id: v.number() },
  handler: async (ctx, args) => {
    const message = await getMessageByLegacyId(ctx, args.id);
    if (!message) return null;
    const item = await ctx.db.get(message.itemId);
    return shapeMessage(message, item?.legacyId ?? 0);
  },
});
