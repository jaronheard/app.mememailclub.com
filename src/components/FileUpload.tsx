import { useState } from "react";
import { uploadFile } from "../utils/cloudinary";
import {
  FieldErrorsImpl,
  FieldPath,
  FieldValues,
  Path,
  PathValue,
  UseFormRegister,
} from "react-hook-form";
import Img from "./Img";

// props interface using generics to pass in FormValues as FieldValues
interface FileUploadProps<FormValues extends FieldValues> {
  id: FieldPath<FormValues>;
  label: string;
  required?: boolean;
  accept?: string;
  register: UseFormRegister<FormValues>;
  // getValues and setValue are from react-hook-form
  getValues: any;
  setValue: any;
  errors: FieldErrorsImpl<FormValues>;
  children?: React.ReactNode;
}

function FileUpload<FormValues extends FieldValues>({
  id,
  label,
  required,
  accept,
  register,
  getValues,
  setValue,
  errors,
  children,
}: FileUploadProps<FormValues>) {
  const [status, setStatus] = useState("idle");

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
          className="h-20 w-20 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          href={url || "#"}
          target="_blank"
          rel="noreferrer"
        >
          {url && status !== "uploading" && (
            <Img
              className="h-20 w-20 rounded-md"
              alt="Open file"
              src={url}
              height={80}
              width={80}
              autoCrop
            />
          )}
        </a>
        <label
          htmlFor={`${id}-file-upload`}
          className="inline-flex h-[2.125rem] items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-bold leading-4 text-white shadow-button focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:bg-indigo-700"
        >
          {status === "uploading" ? "Uploading..." : "Upload File"}
          <input
            className="hidden"
            type="text"
            {...register(id, { required })}
          />
          <input
            className="sr-only"
            aria-describedby="file_input_help"
            id={`${id}-file-upload`}
            type="file"
            accept={accept}
            onChange={(e) => {
              if (e.target?.files?.[0]) {
                setStatus("uploading");
                uploadFile(e.target.files[0]).then((url) => {
                  setUrl(url);
                  setStatus("uploaded");
                });
              }
            }}
          ></input>
        </label>
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
