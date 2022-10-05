import * as React from "react";
import Image, { ImageLoaderProps, ImageProps } from "next/future/image";
// docs: https://cloudinary-build-url.netlify.app/
import { buildImageUrl, extractPublicId } from "cloudinary-build-url";
import type {
  CldOptions,
  CloudConfig,
  TransformerOption,
} from "@cld-apis/types";
import { STORAGE_TYPES } from "@cld-apis/utils";

const CLOUD_OPTIONS = {
  cloudName: "jaronheard",
};

interface LoaderArgs {
  src: string;
  keepAspectRatio?: boolean;
  aspectRatio?: number;
  options: CldOptions;
}
const loader = ({
  src,
  keepAspectRatio,
  aspectRatio,
  options,
}: LoaderArgs): string => {
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
  }
  return buildImageUrl(publicId, options);
};

interface CustomImageProps {
  keepAspectRatio?: boolean;
  cloud?: CloudConfig;
  transformations?: TransformerOption;
  layout?: "intrinsic" | "fixed" | "responsive" | "fill";
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
  cloud = CLOUD_OPTIONS,
  transformations,
  ...rest
}: NextImageCloudinaryProps): JSX.Element => {
  const aspectRatio = Number(height) / Number(width);
  return (
    <Image
      loader={(params: ImageLoaderProps): string => {
        const { resize, ...restTransformations } = transformations || {};
        return loader({
          src: params.src,
          aspectRatio,
          keepAspectRatio,
          options: {
            cloud: {
              cloudName: cloud.cloudName,
            },
            transformations: {
              quality: params.quality,
              resize: {
                ...(resize || {}),
                width: params.width,
              },
              ...(restTransformations || {}),
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

export default Img;
