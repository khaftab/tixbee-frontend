import { LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import CreateNewTicketForm from "~/components/CreateNewTicketForm";
import axios from "~/config/axiosConfig";
import { handleError } from "~/lib/handleError";
import { EnvType, TicketResult } from "~/types/types";
import "react-quill/dist/quill.snow.css";
import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [{ title: "TixBee - Edit ticket" }];
};

export const loader: LoaderFunction = async ({ request, params, context }) => {
  const { HOST } = context.cloudflare.env as EnvType;
  const { id } = params;
  console.log("ID:", id);
  try {
    const response = await axios.get(`${HOST}/api/tickets/${id}`, {
      headers: {
        Cookie: request.headers.get("Cookie"),
      },
    });
    return { ticket: response.data };
  } catch (error: any) {
    return handleError(error, { ticket: null });
  }
};

const EditTicketRoute = () => {
  const { ticket } = useLoaderData<{ ticket: TicketResult }>();
  if (!ticket) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <h2 className="text-2xl font-semibold">Ticket not found</h2>
      </div>
    );
  }
  return (
    <div>
      <CreateNewTicketForm mode="edit" ticket={ticket} />
    </div>
  );
};
export default EditTicketRoute;
