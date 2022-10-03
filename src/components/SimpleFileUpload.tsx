import { useState } from "react";
import { uploadFile } from "../utils/cloudinary";
("../pages/publications/[id]/items/[iid]");

type FileUploadProps = {
  label: string;
  url: string;
  setUrl: (url: string) => void;
};

const FileUpload = ({ label, url, setUrl }: FileUploadProps) => {
  const [status, setStatus] = useState("idle");
  return (
    <div>
      {url && (
        <a href={url} target="_blank" rel="noreferrer">
          File
        </a>
      )}
      <input
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
