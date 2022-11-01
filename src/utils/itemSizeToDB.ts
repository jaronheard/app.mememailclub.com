import { ItemSize } from "@prisma/client";

export type ItemSizeOpts = "4x6" | "6x9" | "9x11";
export const itemSizeToDB = (size: ItemSizeOpts): ItemSize => {
  return `sz_${size}` as ItemSize;
};
export const itemSizeToClient = (size: ItemSize): ItemSizeOpts => {
  return size.replace("sz_", "") as ItemSizeOpts;
};
