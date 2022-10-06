import { useState } from "react";
import { uploadFile } from "../utils/cloudinary";
import {
  FieldErrorsImpl,
  FieldValues,
  Path,
  PathValue,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

// props interface using generics to pass in FormValues as FieldValues
interface FileUploadProps<FormValues extends FieldValues> {
  id: Path<FormValues>;
  label: string;
  required?: boolean;
  accept?: string;
  register: UseFormRegister<FormValues>;
  getValues: UseFormGetValues<FormValues>;
  setValue: UseFormSetValue<FormValues>;
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
      <div className="flex gap-3">
        <label
          htmlFor={`${id}-file-upload`}
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:bg-indigo-700"
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
        {url && status !== "uploading" && (
          <a
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-3 py-2 text-sm font-medium leading-4 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            View File
          </a>
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
