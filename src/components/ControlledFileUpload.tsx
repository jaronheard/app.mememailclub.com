import { forwardRef, useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { uploadFile } from "../utils/cloudinary";
import { FormValues } from "../pages/publications/[id]/items/[iid]";

const FileUpload = forwardRef<
  HTMLInputElement,
  { label: string; url: string } & ReturnType<UseFormRegister<FormValues>>
>(function FileUpload({ onChange, onBlur, name, label, url }, ref) {
  const [link, setLink] = useState(url);
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
      />
      <input
        aria-describedby="file_input_help"
        id={`${name}-file-upload`}
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
});

export default FileUpload;
