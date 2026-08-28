/**
 * Server-side half of src/components/Img.tsx, minus anything that touches
 * `next/image`, so the Cloudinary URL transformations can run inside Convex
 * node actions. The output URLs must match the Next.js copy exactly — Stripe
 * product images and the Lob postcard back overlay depend on them.
 */
import { buildImageUrl, extractPublicId } from "cloudinary-build-url";
import type { CldOptions, TransformerOption } from "@cld-apis/types";
import { STORAGE_TYPES } from "@cld-apis/utils";
import { SIZES, type ItemSizeOpts } from "./itemSize";

const CLOUD_OPTIONS = {
  cloudName: "jaronheard",
};

// double escape all special characters (matches Img.tsx's local `escape`)
function escapeText(text: string): string {
  return encodeURIComponent(encodeURIComponent(text));
}

export function messageTransformation(
  text: string,
  size: ItemSizeOpts = "4x6"
): TransformerOption {
  return {
    background: "white",
    border: `${SIZES[size].textMargin}px_solid_white`,
    resize: {
      type: "fit",
      width: SIZES[size].textWidth,
    },
    gravity: "west",
    position: {
      x: SIZES[size].textX,
    },
    flags: "layer_apply",
    overlay: `text:Futura_${SIZES[size].textSize}:${escapeText(text)}`,
  };
}

export function qrStampTransformation(
  size: ItemSizeOpts = "4x6"
): TransformerOption {
  return {
    resize: {
      type: "fit",
      width: SIZES[size].qrWidth,
      height: SIZES[size].qrHeight,
    },
    gravity: "north_east",
    position: {
      x: SIZES[size].qrX,
      y: SIZES[size].qrY,
    },
    overlay: `postpostcard-stamp-qr_fxwrje`,
  };
}

export function stripePreviewTransformation(
  size: ItemSizeOpts = "4x6"
): TransformerOption {
  return {
    resize: {
      type: "fit",
      width: SIZES[size].stripePreviewWidth,
      height: SIZES[size].stripePreviewHeight,
    },
  };
}

export function addTextTransformationToURL({
  src,
  options = { cloud: CLOUD_OPTIONS },
  text,
  size,
}: {
  src: string;
  options?: CldOptions;
  text: string;
  size: ItemSizeOpts;
}): string {
  const publicId = src.includes("cloudinary.com") ? extractPublicId(src) : src;
  const { ...restTransformations } = options.transformations || {};

  if (!src.includes("cloudinary.com")) {
    options.cloud = {
      ...CLOUD_OPTIONS,
      storageType: STORAGE_TYPES.FETCH,
    };
  }

  const chaining = text
    ? [
        messageTransformation(text, size),
        qrStampTransformation(size),
        { ...(restTransformations || {}) },
      ]
    : [{ ...(restTransformations || {}) }];

  options.transformations = {
    chaining: chaining as TransformerOption[],
  };

  return buildImageUrl(publicId, options);
}

export function addStripePreviewTransformationToURL({
  src,
  options = { cloud: CLOUD_OPTIONS },
  size,
}: {
  src: string;
  options?: CldOptions;
  size: ItemSizeOpts;
}): string {
  const publicId = src.includes("cloudinary.com") ? extractPublicId(src) : src;
  const { ...restTransformations } = options.transformations || {};

  if (!src.includes("cloudinary.com")) {
    options.cloud = {
      ...CLOUD_OPTIONS,
      storageType: STORAGE_TYPES.FETCH,
    };
  }

  const chaining = size
    ? [stripePreviewTransformation(size), { ...(restTransformations || {}) }]
    : [{ ...(restTransformations || {}) }];

  options.transformations = {
    chaining: chaining as TransformerOption[],
  };

  return buildImageUrl(publicId, options);
}
