import { authClient } from "./auth-client";

export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

// Get the logged-in user's JWT token (the Express server verifies this)
export async function getToken() {
  const { data } = await authClient.token();
  return data?.token || "";
}

// Upload an image to ImgBB and return its URL
export async function uploadImageToImgBB(file: File) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
    { method: "POST", body: formData }
  );
  const data = await res.json();
  return (data?.data?.url as string) || "";
}
