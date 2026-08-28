"use node";

/**
 * Port of src/server/router/lob.tsx. Every procedure here talks to the Lob API
 * and/or sends mail, so the whole module runs in the Node runtime as actions.
 *
 * Client mapping:
 *   trpc.lob.createAddress  -> api.lob.createAddress
 *   trpc.lob.createPostcard -> api.lob.createPostcard
 */
import React from "react";
import { v } from "convex/values";
import {
  Configuration,
  AddressesApi,
  AddressEditable,
  PostcardEditable,
  PostcardsApi,
} from "@lob/lob-typescript-sdk";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { itemSizeToClient } from "./lib/itemSize";
import { addTextTransformationToURL } from "./lib/cloudinary";
import type { ItemShape, MessageShape } from "./lib/model";
import sendMail from "../emails";
import PostcardSent from "../emails/PostcardSent";
import PostcardError from "../emails/PostcardError";

const config: Configuration = new Configuration({
  username: process.env.LOB_API_KEY,
});

/** Convex only accepts plain values; the Lob SDK hands back class instances. */
function toPlain<T>(value: T): unknown {
  return JSON.parse(JSON.stringify(value));
}

export const createAddress = action({
  args: {
    name: v.string(),
    address_line1: v.string(),
    address_line2: v.optional(v.string()),
    address_city: v.string(),
    address_state: v.string(),
    address_zip: v.string(),
  },
  handler: async (_ctx, args) => {
    const addressApi = new AddressesApi(config);
    const addressCreate = new AddressEditable({
      name: args.name,
      address_line1: args.address_line1,
      address_line2: args.address_line2,
      address_city: args.address_city,
      address_state: args.address_state,
      address_zip: args.address_zip,
    });
    const myAddress = await addressApi.create(addressCreate);
    const myAddressFromApi = await addressApi.get(myAddress.id);
    if (!myAddressFromApi) {
      throw new Error("Address not created from Lob API");
    }
    return toPlain(myAddressFromApi) as { id: string } & Record<
      string,
      unknown
    >;
  },
});

export const createPostcard = action({
  args: {
    addressId: v.string(),
    itemId: v.number(),
    quantity: v.number(),
    test: v.optional(v.boolean()),
    // no `size` arg: the item's stored size is the source of truth
    client_reference_id: v.optional(v.string()),
    email: v.string(),
  },
  handler: async (ctx, args): Promise<unknown> => {
    const message: MessageShape | null = args.client_reference_id
      ? await ctx.runQuery(internal.messages.getInternal, {
          // use client_reference_id to find message as integer
          id: parseInt(args.client_reference_id),
        })
      : null;

    const item: ItemShape | null = await ctx.runQuery(
      internal.items.getInternal,
      { id: args.itemId }
    );
    if (!item) {
      throw new Error("Item not found");
    }

    const backWithText = message
      ? addTextTransformationToURL({
          src: item.back,
          text: message.message,
          size: itemSizeToClient(item.size),
        })
      : item.back;

    console.log("backWithText", backWithText);

    const postcardCreate = new PostcardEditable({
      to: args.addressId,
      front: item.front,
      back: backWithText,
      size: itemSizeToClient(item.size),
      // set to send date in 5 minutes
      // send_date: new Date(Date.now() + 5 * 60000).toISOString(),
      quantity: args.quantity,
    });
    const myPostcard = await new PostcardsApi(config).create(postcardCreate);
    if (!myPostcard) {
      await sendMail({
        to: "hi@postpostcard.com",
        subject: "Test Postcard Error Email",
        component: React.createElement(PostcardError, {
          postcardData: {
            to: args.addressId,
            front: item.front,
            back: backWithText,
            size: itemSizeToClient(item.size),
            // set to send date in 5 minutes
            // send_date: new Date(Date.now() + 5 * 60000).toISOString(),
            quantity: args.quantity,
          },
        }),
      });
      throw new Error("Postcard not created from Lob API");
    }
    await sendMail({
      to: args.email,
      component: React.createElement(PostcardSent, { postcard: myPostcard }),
    });
    return toPlain(myPostcard);
  },
});

/**
 * Not part of the tRPC surface: the Stripe webhook currently emails this
 * itself. Exposed so the webhook handler can stay a thin Convex client.
 */
export const sendPostcardErrorEmail = action({
  args: { error: v.string() },
  handler: async (_ctx, args) => {
    await sendMail({
      to: "hi@postpostcard.com",
      component: React.createElement(PostcardError, { error: args.error }),
    });
    return null;
  },
});
