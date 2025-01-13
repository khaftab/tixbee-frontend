import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
const crypto = globalThis.crypto;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateCloudinaryUrl = (publicId: string | undefined, transformations?: string) => {
  if (!publicId) {
    return "";
  }
  const cloudName = "dinoawbez";
  // const transformations = "ar_1.5,c_crop,w_100";
  if (!transformations) return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
};

export const ticketCategory = {
  conference: "Conference",
  lecture: "Lecture",
  workshop: "Workshop",
  auction: "Auction",
  concert: "Concert",
  theater: "Theater",
  other: "Other",
};

export function jsonResponse(data: any, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...headers,
    },
  });
}

export const getCookieValue = (cookieString: string, cookieName: string) => {
  const cookies = cookieString.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === cookieName) {
      return decodeURIComponent(value);
    }
  }
  return ""; // If the cookie is not found
};

export async function createSha1Hash(text: string) {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
