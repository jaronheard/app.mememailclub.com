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

// props interface using generics to pass in FormValues as FieldValues
interface FileUploadProps<FormValues extends FieldValues> {
  id: FieldPath<FormValues>;
  label: string;
  // getValues and setValue are from react-hook-form
  getValues: any;
  setValue: any;
  errors: FieldErrorsImpl<FormValues>;
  size: ItemSizeOpts;
  children?: React.ReactNode;
}

function FileUpload<FormValues extends FieldValues>({
  id,
  label,
  getValues,
  setValue,
  errors,
  children,
  size,
}: FileUploadProps<FormValues>) {
  const [status, setStatus] = useState("idle");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const url = getValues()[id];
  const setUrl = (value: PathValue<FormValues, Path<FormValues>>) =>
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
    });

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={`${id}-file-upload`}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="flex items-center gap-3">
        <a
          className={clsx(
            "hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
            size ? SIZES[size].previewClassNames : "h-20 w-20"
          )}
          href={url || "#"}
          target="_blank"
          rel="noreferrer"
        >
          {url && status !== "uploading" && (
            <Img
              className={SIZES[size].previewClassNames}
              alt="Open file"
              src={thumbnailUrl || url}
              height={SIZES[size].previewWidth}
              width={SIZES[size].previewHeight}
              autoCrop
            />
          )}
        </a>
        <CldUploadWidget
          uploadPreset="oe6iang6"
          onUpload={(result: any, widget: any) => {
            if (result.event === "success") {
              setThumbnailUrl(result.info.thumbnail_url);
              setUrl(result.info.secure_url);
              setStatus("uploaded"); // Updating local state with asset details
              widget.close(); // Close widget immediately after successful upload
            }
          }}
          options={{
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
            ],
          }}
        >
          {({ open }) => {
            function handleOnClick(
              event?: React.MouseEvent<HTMLButtonElement>
            ) {
              event?.preventDefault();
              setStatus("uploading");
              open();
            }
            return (
              <Button onClick={handleOnClick} size="sm">
                Upload
              </Button>
            );
          }}
        </CldUploadWidget>
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
