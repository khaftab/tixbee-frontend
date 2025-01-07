import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import { useActionData, useOutletContext } from "@remix-run/react";
import axios from "../config/axiosConfig";
import { EnvType, OutletContext } from "~/types/types";
import { useToastError } from "~/hooks/useToastError";
import { handleError } from "~/lib/handleError";
import NotSignedIn from "~/components/NotSignedIn";
import { validateAndSanitizeHTML } from "~/lib/validateAndSanitizeHTML";
import CreateNewTicketForm from "~/components/CreateNewTicketForm";
import { ticketSchema } from "~/lib/zodValidationSchema";
import "react-quill/dist/quill.snow.css";
import crypto from "node:crypto";
import type { MetaFunction } from "@remix-run/cloudflare";

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
  const signature = crypto.createHash("sha1").update(signatureString).digest("hex");

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        public_id: publicId,
        timestamp,
        signature,
        api_key: apiKey,
      }
    );
    console.log("Cloudinary Delete Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Cloudinary Delete Error:", error.response?.data || error.message);
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
      await axios.put(
        `${HOST}/api/tickets/${bodyObject.id}`,
        {
          ...data,
          description: cleanHtml,
        },
        {
          headers: {
            Cookie: request.headers.get("Cookie"),
          },
        }
      );
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
      console.log(error);
      return handleError(error);
    }
  } else if (request.method === "POST") {
    try {
      await axios.post(
        `${HOST}/api/tickets`,
        {
          ...data,
          description: cleanHtml,
        },
        {
          headers: {
            Cookie: request.headers.get("Cookie"),
          },
        }
      );
      return redirect(`/tickets`);
    } catch (error) {
      console.log(error);
      return handleError(error);
    }
  }
}

export default function CreateTicketRoute() {
  const actionData = useActionData<typeof action>();
  const { currentUser } = useOutletContext<OutletContext>();

  useToastError(actionData);

  if (!currentUser) {
    return <NotSignedIn />;
  }
  return <CreateNewTicketForm mode="create" />;
}
