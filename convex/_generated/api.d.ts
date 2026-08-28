/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as items from "../items.js";
import type * as itemsNode from "../itemsNode.js";
import type * as lib_cloudinary from "../lib/cloudinary.js";
import type * as lib_itemSize from "../lib/itemSize.js";
import type * as lib_model from "../lib/model.js";
import type * as lob from "../lob.js";
import type * as messages from "../messages.js";
import type * as migrations from "../migrations.js";
import type * as publications from "../publications.js";
import type * as tags from "../tags.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  items: typeof items;
  itemsNode: typeof itemsNode;
  "lib/cloudinary": typeof lib_cloudinary;
  "lib/itemSize": typeof lib_itemSize;
  "lib/model": typeof lib_model;
  lob: typeof lob;
  messages: typeof messages;
  migrations: typeof migrations;
  publications: typeof publications;
  tags: typeof tags;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
