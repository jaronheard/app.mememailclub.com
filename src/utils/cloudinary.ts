export const CLOUDINARY_UPLOAD_API_URL =
  "https://api.cloudinary.com/v1_1/jaronheard/auto/upload";

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

export const tags = [
  {"category": "content-type", "value": "adventure", "include": true, "label": "Adventure"},
  {"category": "content-type", "value": "astrophotography", "include": true, "label": "Astrophotography"},
  {"category": "content-type", "value": "cityscape", "include": true, "label": "Cityscape"},
  {"category": "content-type", "value": "family", "include": true, "label": "Family"},
  {"category": "content-type", "value": "food", "include": true, "label": "Food"},
  {"category": "content-type", "value": "landscape", "include": true, "label": "Landscape"},
  {"category": "content-type", "value": "pet", "include": true, "label": "Pet"},
  {"category": "content-type", "value": "portrait", "include": true, "label": "Portrait"},
  {"category": "content-type", "value": "real-estate", "include": true, "label": "Real Estate"},
  {"category": "content-type", "value": "seascape", "include": true, "label": "Seascape"},
  {"category": "content-type", "value": "sports", "include": true, "label": "Sports"},
  {"category": "content-type", "value": "street", "include": true, "label": "Street"},
  {"category": "content-type", "value": "underwater", "include": true, "label": "Underwater"},
  {"category": "content-type", "value": "urban-exploration", "include": true, "label": "Urban Exploration"},
  {"category": "content-type", "value": "drone", "include": true, "label": "Drone"},
  {"category": "content-type", "value": "war", "include": true, "label": "War"},
  {"category": "content-type", "value": "product", "include": true, "label": "Product"},
  {"category": "content-type", "value": "special-occasion", "include": true, "label": "Special Occasion"},
  {"category": "content-type", "value": "wildlife", "include": true, "label": "Wildlife"},
  {"category": "content-type", "value": "abstract", "include": true, "label": "Abstract"},
  {"category": "illustration", "value": "illustration", "include": true, "label": "Illustration"},
  {"category": "illustration", "value": "natural", "include": true, "label": "Natural"},
  {"category": "location", "value": "indoor", "include": true, "label": "Indoor"},
  {"category": "location", "value": "outdoor", "include": true, "label": "Outdoor"},
  {"category": "occasion", "value": "wedding", "include": true, "label": "Wedding"},
  {"category": "occasion", "value": "birthday", "include": true, "label": "Birthday"},
  {"category": "occasion", "value": "dances", "include": true, "label": "Dances"},
  {"category": "occasion", "value": "awards", "include": true, "label": "Awards"},
  {"category": "occasion", "value": "funeral", "include": true, "label": "Funeral"},
  {"category": "occasion", "value": "conference", "include": true, "label": "Conference"},
  {"category": "occasion", "value": "live-concert", "include": true, "label": "Live Concert"},
  {"category": "occasion", "value": "holiday", "include": true, "label": "Holiday"},
  {"category": "occasion", "value": "daily-life", "include": true, "label": "Daily Life"},
  {"category": "style", "value": "photo-illustration", "include": true, "label": "Photo Illustration"},
  {"category": "style", "value": "realistic", "include": true, "label": "Realistic"},
  {"category": "style", "value": "still-life", "include": true, "label": "Still Life"},
  {"category": "time", "value": "day", "include": true, "label": "Day"},
  {"category": "time", "value": "night", "include": true, "label": "Night"},
  {"category": "time", "value": "evening", "include": true, "label": "Evening"},
  {"category": "time", "value": "afternoon", "include": true, "label": "Afternoon"}
];
