import { useState } from "react";
import {
  FieldErrorsImpl,
  FieldPath,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";
import Img from "./Img";
import { ItemSizeOpts, SIZES } from "../utils/itemSize";
import clsx from "clsx";
import { CldUploadWidget } from "next-cloudinary";
import Button from "./Button";
import { PostcardBackWithOverlay } from "./PostcardBackWithOverlay";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

// props interface using generics to pass in FormValues as FieldValues
interface FileUploadProps<FormValues extends FieldValues> {
  id: FieldPath<FormValues>;
  label: string;
  // getValues and setValue are from react-hook-form
  getValues: any;
  setValue: any;
  postcardBackWithOverlay?: boolean;
  postcardFrontWithRotation?: boolean;
  errors: FieldErrorsImpl<FormValues>;
  size: ItemSizeOpts;
  children?: React.ReactNode;
}

function FileUpload<FormValues extends FieldValues>({
  id,
  label,
  getValues,
  setValue,
  postcardBackWithOverlay,
  postcardFrontWithRotation,
  size,
  errors,
  children,
}: FileUploadProps<FormValues>) {
  const [status, setStatus] = useState("idle");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "landscape"
  );

  const url = getValues()[id];
  const setUrl = (value: PathValue<FormValues, Path<FormValues>>) =>
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
    });

  const cloudinaryWidgetProps = {
    uploadPreset: "6x9_postcard_landscape",
    onUpload: (result: any, widget: any) => {
      if (result.event === "success") {
        setThumbnailUrl(result.info.thumbnail_url);
        setUrl(result.info.secure_url);
        setStatus("uploaded"); // Updating local state with asset details
        widget.close(); // Close widget immediately after successful upload
      }
    },
    onClose: () => setStatus("idle"),
    options: {
      cropping: true,
      croppingAspectRatio: SIZES[size].widthPx / SIZES[size].heightPx,
      croppingShowBackButton: true,
      showSkipCropButton: false,
      showUploadMoreButton: false,
      sources: [
        "local",
        "url",
        "google_drive",
        "instagram",
        "facebook",
        "unsplash",
      ] as any,
      styles: {
        palette: {
          window: "#F7D832",
          windowBorder: "#5520F8",
          tabIcon: "#5520F8",
          menuIcons: "#5520F8",
          textDark: "#120F0C",
          textLight: "#FFFCFA",
          link: "#5520F8",
          action: "#FF620C",
          inactiveTabIcon: "#120F0C",
          error: "#F44235",
          inProgress: "#0078FF",
          complete: "#20B832",
          sourceBg: "#FFFCFA",
        },
        fonts: {
          default: null,
          "'Sen', sans-serif": {
            url: "https://fonts.googleapis.com/css2?family=Sen:wght@400;700;800&display=swap",
            active: true,
          },
        },
        frame: {
          background: "#120F0C90",
        },
      },
    },
  };

  const cloudinaryWidgetPropsPortrait = {
    ...cloudinaryWidgetProps,
    uploadPreset: "6x9_postcard_portrait",
    options: {
      ...cloudinaryWidgetProps.options,
      croppingAspectRatio: SIZES[size].heightPx / SIZES[size].widthPx,
    },
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={`${id}-file-upload`}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="flex items-center gap-3">
        {/* start with editing this and then copy paste */}
        {orientation === "landscape" && (
          <CldUploadWidget {...cloudinaryWidgetProps}>
            {({ open }) => {
              function handleOnClick(
                event?: React.MouseEvent<HTMLButtonElement>
              ) {
                event?.preventDefault();
                setStatus("uploading");
                if (open) {
                  open();
                }
              }
              return (
                <button
                  className="flex flex-col items-center gap-3 sm:flex-row"
                  onClick={handleOnClick}
                >
                  <div
                    className={clsx(
                      "hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                      size
                        ? orientation === "landscape"
                          ? SIZES[size].previewClassNames
                          : SIZES[size].previewClassNamesPortrait
                        : "h-20 w-20"
                    )}
                  >
                    {url && status !== "uploading" && !postcardBackWithOverlay && (
                      <Img
                        className={
                          orientation === "landscape"
                            ? SIZES[size].previewClassNames
                            : SIZES[size].previewClassNamesPortrait
                        }
                        alt="Open file"
                        src={thumbnailUrl || url}
                        height={
                          orientation === "landscape"
                            ? SIZES[size].previewHeight
                            : SIZES[size].previewWidth
                        }
                        width={
                          orientation === "landscape"
                            ? SIZES[size].previewWidth
                            : SIZES[size].previewHeight
                        }
                        autoCrop
                        cover
                        // rotateToPortrait={orientation === "portrait"}
                      />
                    )}
                    {url &&
                      status !== "uploading" &&
                      postcardBackWithOverlay && (
                        <PostcardBackWithOverlay
                          back={thumbnailUrl || url}
                          size={size}
                          optimizeImages
                        />
                      )}
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <Button visualOnly size="sm">
                      Upload
                    </Button>
                    {/* orientation button, using rotation icon, positioned above upload button */}
                    {postcardFrontWithRotation && (
                      <Button
                        className="z-10"
                        size="sm"
                        variant="secondary"
                        onClick={(event) => {
                          event?.preventDefault();
                          event?.stopPropagation();
                          if (orientation === "landscape") {
                            setOrientation("portrait");
                          } else {
                            setOrientation("landscape");
                          }
                        }}
                      >
                        <ArrowPathIcon
                          className={clsx([
                            "-mb-2.5 h-6 w-6 text-indigo-700",
                            { "-rotate-45": orientation === "landscape" },
                          ])}
                          aria-hidden="true"
                        />
                        Rotate
                      </Button>
                    )}
                  </div>
                </button>
              );
            }}
          </CldUploadWidget>
        )}
        {orientation === "portrait" && (
          <CldUploadWidget {...cloudinaryWidgetPropsPortrait}>
            {({ open }) => {
              function handleOnClick(
                event?: React.MouseEvent<HTMLButtonElement>
              ) {
                event?.preventDefault();
                setStatus("uploading");
                if (open) {
                  open();
                }
              }
              return (
                <button
                  className="mx-auto flex flex-col items-center gap-3 sm:mx-0 sm:flex-row"
                  onClick={handleOnClick}
                >
                  <div
                    className={clsx(
                      "hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                      size ? SIZES[size].previewClassNamesPortrait : "h-20 w-20"
                    )}
                  >
                    {url &&
                      status !== "uploading" &&
                      !postcardBackWithOverlay && (
                        <Img
                          className={SIZES[size].previewClassNamesPortrait}
                          alt="Open file"
                          src={thumbnailUrl || url}
                          height={SIZES[size].previewWidth}
                          width={SIZES[size].previewHeight}
                          autoCrop
                          cover
                          rotateToPortrait={true}
                        />
                      )}
                    {url &&
                      status !== "uploading" &&
                      postcardBackWithOverlay && (
                        <PostcardBackWithOverlay
                          back={thumbnailUrl || url}
                          size={size}
                          optimizeImages
                        />
                      )}
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <Button visualOnly size="sm">
                      Upload
                    </Button>
                    {/* orientation button, using rotation icon, positioned above upload button */}
                    {postcardFrontWithRotation && (
                      <Button
                        className="z-10"
                        size="sm"
                        variant="secondary"
                        onClick={(event) => {
                          event?.preventDefault();
                          event?.stopPropagation();
                          setOrientation("landscape");
                        }}
                      >
                        <ArrowPathIcon
                          className={clsx([
                            "-mb-2.5 h-6 w-6 text-indigo-700",
                            {
                              "-ml-1 mr-1 rotate-[225deg] -scale-y-100":
                                orientation === "portrait",
                            },
                          ])}
                          aria-hidden="true"
                        />
                        Rotate
                      </Button>
                    )}
                  </div>
                </button>
              );
            }}
          </CldUploadWidget>
        )}
      </div>
      {errors[id] && (
        <p className="mt-1 text-sm text-red-600" id="email-error">
          {label} is required.
        </p>
      )}
      {children && (
        <p className="mt-1 text-sm text-gray-500" id="file_input_help">
          {children}
        </p>
      )}
    </div>
  );
}

export default FileUpload;
