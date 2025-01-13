import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { jsonResponse } from "~/lib/utils";
import { EnvType } from "~/types/types";

export async function action({ request, context }: ActionFunctionArgs) {
  if (request.method === "PUT") {
    console.log("PUT request received");

    return jsonResponse({ public_id: null, context: null, status: 201 }, 201);
  }
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } = context.cloudflare.env as EnvType;
  const body = await request.formData();
  const file = body.get("file") as File | null;
  const contextOf = body.get("context") as string | null;
  body.delete("context");

  if (!file) {
    return jsonResponse({ public_id: null, context: null, status: 400 }, 400);
  }

  body.append("upload_preset", CLOUDINARY_UPLOAD_PRESET as string);

  try {
    // Use fetch to make the request
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body, // Pass the form data directly
        headers: {
          Accept: "application/json", // Accept JSON response from Cloudinary
        },
      }
    );

    if (!response.ok) {
      return jsonResponse({ public_id: null, context: null, status: 500 }, 500);
    }

    const result = (await response.json()) as any;
    return jsonResponse({ public_id: result.public_id, context: contextOf, status: 201 }, 201);
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return jsonResponse({ public_id: null, context: null, status: 500 }, 500);
  }
}
