import { useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { uploadFile } from "../utils/cloudinary";
import { FormValues } from "../pages/publications/[id]/items/[iid]";

const FileUpload = (
  props: { label: string } & ReturnType<UseFormRegister<FormValues>>
) => {
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("idle");
  return (
    <div>
      {link && (
        <a href={link} target="_blank" rel="noreferrer">
          File
        </a>
      )}
      <input
        className="hidden"
        name={name}
        ref={ref}
        onChange={onChange}
        onBlur={onBlur}
        value={link}
      />
      <input
        aria-describedby="file_input_help"
        id={`${props.name}-file-upload`}
        type="file"
        onChange={(e) => {
          if (e.target?.files?.[0]) {
            setStatus("uploading...");
            uploadFile(e.target.files[0]).then((url) => {
              setStatus("uploaded");
              setLink(url);
            });
          }
        }}
      />
      <p
        className="mt-1 text-sm text-gray-500 dark:text-gray-300"
        id="file_input_help_text"
      >
        Testing: {field.value}
      </p>
      <p
        className="mt-1 text-sm text-gray-500 dark:text-gray-300"
        id="file_input_help"
      >
        {props.label}
      </p>
      <p
        className="mt-1 text-sm text-gray-500 dark:text-gray-300"
        id="file_input_help"
      >
        {status === "Uploading..."}
      </p>
      {fieldState.error && (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {field.name} is required.
        </p>
      )}
    </div>
  );
};

FileUpload.defaultProps = { url: "No file" };

export default FileUpload;
