import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import { useActionData, useOutletContext } from "@remix-run/react";
import { EnvType, CurrentUser } from "~/types/types";
import { useToastError } from "~/hooks/useToastError";
import { handleError } from "~/lib/handleError";
import NotSignedIn from "~/components/NotSignedIn";
import { validateAndSanitizeHTML } from "~/lib/validateAndSanitizeHTML";
import CreateNewTicketForm from "~/components/CreateNewTicketForm";
import { ticketSchema } from "~/lib/zodValidationSchema";
import "react-quill/dist/quill.snow.css";
// import crypto from "node:crypto";
import type { MetaFunction } from "@remix-run/cloudflare";
import { createSha1Hash } from "~/lib/utils";

export const meta: MetaFunction = () => {
  return [{ title: "TixBee - Create ticket" }];
};

type Ticket = {
  title: string;
  price: string;
  category: string;
  thumbnailImagePublicId: string;
  ticketImagePublicId: string;
  description: string;
};

const deleteCloudinaryImage = async (
  publicId: string,
  cloudName: string,
  apiKey: string,
  apiSecret: string
) => {
  // Generate timestamp
  const timestamp = Math.floor(Date.now() / 1000);

  // Create signature
  const signatureString = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  // const signature = crypto.createHash("sha1").update(signatureString).digest("hex");
  const signature = await createSha1Hash(signatureString);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ public_id: publicId, timestamp, signature, api_key: apiKey }),
    });
    const data = (await response.json()) as any;
    if (!response.ok) {
      console.log("Cloudinary error", response);
    }
    return data;
  } catch (error) {
    console.log("Cloudinary error", error);
  }
};

export async function action({ request, context }: ActionFunctionArgs) {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, HOST } = context
    .cloudflare.env as EnvType;
  const body = await request.formData();
  const schema = ticketSchema.omit({ thumbnail: true, ticket: true });

  const bodyObject: any = {};
  body.forEach((value, key) => {
    bodyObject[key] = value.toString();
  });

  const data: Ticket = {
    title: bodyObject.title,
    price: bodyObject.price,
    category: bodyObject.category,
    thumbnailImagePublicId: bodyObject.thumbnailImagePublicId,
    ticketImagePublicId: bodyObject.ticketImagePublicId,
    description: bodyObject.description,
  };

  const validationResult = schema.safeParse(data);
  if (!validationResult.success) {
    return handleError(new Error("Validation failed in backend"));
  }

  const dirtyHtml = body.get("description") as string;

  const cleanHtml = validateAndSanitizeHTML(dirtyHtml);
  // const cleanHtml = dirtyHtml;

  if (request.method === "PUT") {
    try {
      const response = await fetch(`${HOST}/api/tickets/${bodyObject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: request.headers.get("Cookie") || "",
        },
        body: JSON.stringify({ ...data, description: cleanHtml }),
      });
      const ticketData = (await response.json()) as any;
      if (!response.ok) {
        return handleError(ticketData, response);
      }

      if (bodyObject.oldTicketImagePublicId) {
        deleteCloudinaryImage(
          bodyObject.oldTicketImagePublicId,
          CLOUDINARY_CLOUD_NAME,
          CLOUDINARY_API_KEY,
          CLOUDINARY_API_SECRET
        );
      }
      if (bodyObject.oldThumbnailImagePublicId) {
        deleteCloudinaryImage(
          bodyObject.oldThumbnailImagePublicId,
          CLOUDINARY_CLOUD_NAME,
          CLOUDINARY_API_KEY,
          CLOUDINARY_API_SECRET
        );
      }
      return redirect(`/tickets/${bodyObject.id}`);
    } catch (error) {
      return handleError(error, false);
    }
  } else if (request.method === "POST") {
    try {
      const response = await fetch(`${HOST}/api/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: request.headers.get("Cookie") || "",
        },
        body: JSON.stringify({ ...data, description: cleanHtml }),
      });
      const ticketData = (await response.json()) as any;
      if (!response.ok) {
        return handleError(ticketData, response);
      }
      return redirect(`/tickets`);
    } catch (error) {
      return handleError(error);
    }
  }
}

export default function CreateTicketRoute() {
  const actionData = useActionData<typeof action>();
  const { currentUser } = useOutletContext<CurrentUser>();

  useToastError(actionData);

  if (!currentUser) {
    return <NotSignedIn />;
  }
  return <CreateNewTicketForm mode="create" />;
}
