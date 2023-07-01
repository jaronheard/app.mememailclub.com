import { ItemSize } from "@prisma/client";

export type ItemSizeOpts = "4x6" | "6x9" | "6x11";

export const itemSizeToDB = (size: ItemSizeOpts): ItemSize => {
  return `sz_${size}` as ItemSize;
};
export const itemSizeToClient = (size: ItemSize): ItemSizeOpts => {
  return size.replace("sz_", "") as ItemSizeOpts;
};

export const SIZES = {
  "4x6": {
    widthPx: 1875,
    heightPx: 1275,
    textX: 80,
    textWidth: 650,
    textSize: 24,
    textMargin: 20,
    previewClassNames: "w-[187.5px] h-[127.5px]",
    previewWidth: 187.5,
    previewHeight: 127.5,
    // not reviewed
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
    previewClassNames: "w-[277.5px] h-[187.5px]",
    previewWidth: 277.5,
    previewHeight: 187.5,
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
    previewClassNames: "w-[337.5px] h-[187.5px]",
    previewWidth: 337.5,
    previewHeight: 187.5,
    // not reviewed
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
  front: `https://res.cloudinary.com/jaronheard/image/upload/w_2775,h_1875/v1687555005/bluePixel_eklcos.jpg`,
  back: `https://res.cloudinary.com/jaronheard/image/upload/w_2775,h_1875/v1687555005/redPixel_peptry.jpg`,
  status: "DRAFT",
  size: "6x9",
  visibility: "PRIVATE",
} as const;

export const PRIVATE_ITEM_DEFAULTS = {
  ...ITEM_DEFAULTS,
  name: "Private postcard",
  description: "Private postcard",
} as const;
