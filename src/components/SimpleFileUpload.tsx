import { useState } from "react";
import { uploadFile } from "../utils/cloudinary";
import { FormValues } from "../pages/publications/[id]/items/[iid]";
import {
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

type FileUploadProps = {
  id: keyof FormValues;
  label: string;
  required?: boolean;
  register: UseFormRegister<FormValues>;
  getValues: UseFormGetValues<FormValues>;
  setValue: UseFormSetValue<FormValues>;
};

const FileUpload = ({
  id,
  label,
  required,
  register,
  getValues,
  setValue,
}: FileUploadProps) => {
  const [status, setStatus] = useState("idle");

  const url = getValues()[id];
  const setUrl = (value: string) =>
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
    });

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={`${id}-file-upload`}
        className="block text-sm font-medium capitalize text-gray-700"
      >
        {id}
      </label>
      <div className="flex gap-3">
        <label
          htmlFor={`${id}-file-upload`}
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:bg-indigo-700"
        >
          {status === "uploading" ? "Uploading..." : "Upload File"}
          <input
            className="sr-only"
            {...register(id, { required })}
            aria-describedby="file_input_help"
            id={`${id}-file-upload`}
            type="file"
            onChange={(e) => {
              if (e.target?.files?.[0]) {
                setStatus("uploading");
                uploadFile(e.target.files[0]).then((url) => {
                  setStatus("uploaded");
                  setUrl(url);
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
      <p
        className="mt-1 text-sm text-gray-500 dark:text-gray-300"
        id="file_input_help"
      >
        {label}
      </p>
    </div>
  );
};

export default FileUpload;
