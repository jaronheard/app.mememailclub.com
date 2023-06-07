import * as React from "react";
import Image, { ImageLoaderProps, ImageProps } from "next/image";
// docs: https://cloudinary-build-url.netlify.app/
import { buildImageUrl, extractPublicId } from "cloudinary-build-url";
import type {
  CldOptions,
  CloudConfig,
  TransformerOption,
} from "@cld-apis/types";
import { STORAGE_TYPES } from "@cld-apis/utils";
import { ItemSizeOpts, SIZES } from "../utils/itemSize";

const CLOUD_OPTIONS = {
  cloudName: "jaronheard",
};

interface CloudinaryUrlBuilderArgs {
  src: string;
  keepAspectRatio?: boolean;
  aspectRatio?: number;
  options?: CldOptions;
  autoCrop?: boolean;
}

// extend CloudinaryUrlBuilderArgs with a text property
interface CloudinaryUrlBuilderArgsWithText extends CloudinaryUrlBuilderArgs {
  text: string;
  size: ItemSizeOpts;
}

export const cloudinaryUrlBuilder = ({
  src,
  keepAspectRatio,
  autoCrop,
  aspectRatio,
  options = { cloud: CLOUD_OPTIONS },
}: CloudinaryUrlBuilderArgs): string => {
  // use remote image loading
  const publicId = src.includes("cloudinary.com") ? extractPublicId(src) : src;

  if (!src.includes("cloudinary.com")) {
    options.cloud = {
      ...CLOUD_OPTIONS,
      storageType: STORAGE_TYPES.FETCH,
    };
  }

  if (
    keepAspectRatio &&
    aspectRatio &&
    !isNaN(aspectRatio) &&
    options.transformations?.resize !== undefined &&
    typeof options.transformations?.resize?.width
  ) {
    options.transformations.resize.height = Math.round(
      Number(options.transformations?.resize?.width) * aspectRatio
    );
    if (autoCrop) {
      options.transformations.resize.type = "fill";
    }
  }

  return buildImageUrl(publicId, options);
};

// params of text, type string, and size of type itemSizeOpts with default value of "4x6"

export function messageTransformation(
  text: string,
  size: ItemSizeOpts = "4x6"
): TransformerOption {
  // const textWithBranding = text
  //   ? text +
  //     "\n\n                                                Sent from postpostcard.com"
  //   : "";

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
    // overlay: `text:${textStyle}:${text}`,
    overlay: `text:Futura_${SIZES[size].textSize}:${escape(text)}`,
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

export function addTextTransformationToURL({
  src,
  options = { cloud: CLOUD_OPTIONS },
  text,
  size,
}: CloudinaryUrlBuilderArgsWithText): string {
  // use remote image loading
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

  // add chaining to options.transforations
  options.transformations = {
    chaining: chaining as TransformerOption[],
  };

  return buildImageUrl(publicId, options);
}

interface CustomImageProps {
  keepAspectRatio?: boolean;
  autoCrop?: boolean;
  cloud?: CloudConfig;
  transformations?: TransformerOption;
  text?: string;
  textStyle?: string;
  contain?: boolean;
}

export type NextImageCloudinaryProps = CustomImageProps & ImageProps;

const Img = ({
  src,
  alt,
  width,
  height,
  fill,
  className,
  keepAspectRatio = true,
  autoCrop,
  cloud = CLOUD_OPTIONS,
  contain,
  transformations,
  text,
  ...rest
}: NextImageCloudinaryProps): JSX.Element => {
  const aspectRatio = Number(height) / Number(width);
  return (
    <Image
      loader={(params: ImageLoaderProps): string => {
        const { resize, ...restTransformations } = transformations || {};

        return cloudinaryUrlBuilder({
          src: params.src,
          aspectRatio,
          keepAspectRatio,
          autoCrop,
          options: {
            cloud: {
              cloudName: cloud.cloudName,
            },
            transformations: {
              chaining: text
                ? [
                    {
                      quality: params.quality,
                      resize: {
                        ...(resize || {}),
                        width: params.width,
                      },
                    },
                    messageTransformation(text, "4x6"), // TODO: make this dynamic
                    { ...(restTransformations || {}) },
                  ]
                : [
                    {
                      quality: params.quality,
                      resize: {
                        ...(resize || {}),
                        width: params.width,
                      },
                    },
                    { ...(restTransformations || {}) },
                  ],
            },
          },
        });
      }}
      src={src}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      style={{
        objectFit: "contain",
      }}
      {...rest}
    />
  );
};

// double escape all special characters
function escape(text: string): string {
  return encodeURIComponent(encodeURIComponent(text));
}

export default Img;
