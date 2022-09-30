import { useState } from "react";
import { uploadFile } from "../utils/cloudinary";

interface FileUploadProps {
  id: string;
  value: string;
  label: string;
  register: any;
  errors: any;
  required: boolean;
}

const FileUpload = (props: FileUploadProps) => {
  const { id, label, register, required, errors } = props;
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
        {...register(id, { required })}
        id={id}
        type="text"
        value={link}
      />
      <input
        aria-describedby="file_input_help"
        id={`${id}-file-upload`}
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
      {errors[id] && (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {id} is required.
        </p>
      )}
    </div>
  );
};

FileUpload.defaultProps = { url: "No file" };

export default FileUpload;
