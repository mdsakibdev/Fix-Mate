import { authClient } from "./auth-client";

export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

// Get the logged-in user's JWT token (the Express server verifies this)
export async function getToken() {
  const { data } = await authClient.token();
  return data?.token || "";
}
