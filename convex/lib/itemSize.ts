/**
 * Port of src/utils/itemSize.ts without the `@prisma/client` import so it can
 * be bundled into Convex functions. Values must stay in sync with the Next.js
 * copy — they control Cloudinary transformations and the DB enum encoding.
 */

export type ItemSizeOpts = "4x6" | "6x9" | "6x11";
export type ItemSizeDB = "sz_4x6" | "sz_6x9" | "sz_6x11";

export const itemSizeToDB = (size: ItemSizeOpts): ItemSizeDB =>
  `sz_${size}` as ItemSizeDB;

export const itemSizeToClient = (size: ItemSizeDB): ItemSizeOpts =>
  size.replace("sz_", "") as ItemSizeOpts;

export const SIZES = {
  "4x6": {
    widthPx: 1875,
    heightPx: 1275,
    textX: 80,
    textWidth: 650,
    textSize: 24,
    textMargin: 20,
    previewWidth: 187.5,
    previewHeight: 127.5,
    stripePreviewWidth: 187.5 * 2,
    stripePreviewHeight: 127.5 * 2,
    brandingTextX: 75,
    brandingTextY: 75,
    brandingTextWidth: 975,
    brandingTextSize: 36,
    brandingTextMargin: 30,
    qrWidth: 332,
    qrHeight: 380,
    qrX: 75,
    qrY: 75,
  },
  "6x9": {
    widthPx: 2775,
    heightPx: 1875,
    textX: 150,
    textWidth: 975,
    textSize: 36,
    textMargin: 30,
    previewWidth: 277.5,
    previewHeight: 187.5,
    stripePreviewWidth: 277.5 * 2,
    stripePreviewHeight: 187.5 * 2,
    brandingTextX: 75,
    brandingTextY: 75,
    brandingTextWidth: 975,
    brandingTextSize: 36,
    brandingTextMargin: 30,
    qrWidth: 332,
    qrHeight: 380,
    qrX: 75,
    qrY: 75,
  },
  "6x11": {
    widthPx: 3375,
    heightPx: 1875,
    textX: 150,
    textWidth: 975,
    textSize: 36,
    textMargin: 30,
    previewWidth: 337.5,
    previewHeight: 187.5,
    stripePreviewWidth: 337.5 * 2,
    stripePreviewHeight: 187.5 * 2,
    brandingTextX: 75,
    brandingTextY: 75,
    brandingTextWidth: 975,
    brandingTextSize: 36,
    brandingTextMargin: 30,
    qrWidth: 332,
    qrHeight: 380,
    qrX: 75,
    qrY: 75,
  },
};

export const ITEM_DEFAULTS = {
  name: "",
  description: "",
  front: `https://res.cloudinary.com/jaronheard/image/upload/v1692491797/bluePixel_eklcos_r17q8i.png`,
  back: `https://res.cloudinary.com/jaronheard/image/upload/v1692491790/redPixel_peptry_jukrao.png`,
  status: "DRAFT",
  size: "6x9",
  visibility: "PRIVATE",
} as const;

export const PRIVATE_ITEM_DEFAULTS = {
  ...ITEM_DEFAULTS,
  name: "Private postcard",
  description: "Private postcard",
} as const;
