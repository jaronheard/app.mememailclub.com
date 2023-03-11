export const CLOUDINARY_UPLOAD_API_URL =
  "https://api.cloudinary.com/v1_1/jaronheard/auto/upload";

// docs: https://cloudinary.com/documentation/fetch_remote_images#fetch_and_deliver_remote_files
export const CLOUDINARY_IMAGE_FETCH_URL =
  "https://res.cloudinary.com/jaronheard/image/fetch/";

export const cacheImageUrl = (url: string) => {
  return `${CLOUDINARY_IMAGE_FETCH_URL}${url}`;
};

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "fulne0nm");

  // try to upload file
  try {
    const response = await fetch(CLOUDINARY_UPLOAD_API_URL, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    console.log(data);
    return data.secure_url;
  } catch (error) {
    console.error(error);
  }
}
