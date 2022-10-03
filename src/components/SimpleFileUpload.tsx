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
    <div>
      {url && (
        <a href={url} target="_blank" rel="noreferrer">
          File
        </a>
      )}
      <input
        {...register(id, { required })}
        aria-describedby="file_input_help"
        id={`${name}-file-upload`}
        type="file"
        onChange={(e) => {
          if (e.target?.files?.[0]) {
            setStatus("uploading...");
            uploadFile(e.target.files[0]).then((url) => {
              setStatus("uploaded");
              setUrl(url);
            });
          }
        }}
      />
      <p
        className="mt-1 text-sm text-gray-500 dark:text-gray-300"
        id="file_input_help"
      >
        {label}
      </p>
      <p
        className="mt-1 text-sm text-gray-500 dark:text-gray-300"
        id="file_input_help"
      >
        {status === "Uploading..."}
      </p>
    </div>
  );
};

export default FileUpload;
