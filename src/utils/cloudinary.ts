const url = "https://api.cloudinary.com/v1_1/jaronheard/auto/upload";

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "fulne0nm");

  // try to upload file
  try {
    const response = await fetch(url, {
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
