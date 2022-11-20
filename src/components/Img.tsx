import * as React from "react";
import Image, { ImageLoaderProps, ImageProps } from "next/image";
// docs: https://cloudinary-build-url.netlify.app/
import { buildImageUrl, extractPublicId } from "cloudinary-build-url";
import type {
  CldOptions,
  CloudConfig,
  TransformerOption,
  TextArea,
  TextStyle,
} from "@cld-apis/types";
import { STORAGE_TYPES } from "@cld-apis/utils";

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

interface CustomImageProps {
  keepAspectRatio?: boolean;
  autoCrop?: boolean;
  cloud?: CloudConfig;
  transformations?: TransformerOption;
  text?: string;
  textStyle?: string;
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
  transformations,
  text,
  textStyle,
  ...rest
}: NextImageCloudinaryProps): JSX.Element => {
  const aspectRatio = Number(height) / Number(width);
  const lorem =
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sed ut debitis ipsam, neque mollitia laborum iure sunt dolores ea fuga at, officia quis non? Debitis mollitia quia facere est voluptates.";
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
                    {
                      background: "white",
                      border: "20px_solid_white",
                      resize: {
                        type: "fit",
                        width: 350,
                      },
                      gravity: "west",
                      position: {
                        x: 80,
                      },
                      flags: "layer_apply",
                      // overlay: `text:${textStyle}:${text}`,
                      overlay: `text:Futura_18:${escape(text)}`,
                    },
                  ]
                : [
                    {
                      quality: params.quality,
                      resize: {
                        ...(resize || {}),
                        width: params.width,
                      },
                    },
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
      {...rest}
    />
  );
};

// double escape special characters for cloudinary
const escape = (text: string): string => {
  return encodeURIComponent(text.replace(/\,/g, "%2C").replace(/\//g, "%2F"));
};

export default Img;
