import { LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import CreateNewTicketForm from "~/components/CreateNewTicketForm";
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

  try {
    const response = await fetch(`${HOST}/api/tickets/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: request.headers.get("Cookie") || "",
      },
    });
    const ticketData = (await response.json()) as any;
    if (!response.ok) {
      return handleError(ticketData, response, { ticket: null });
    }
    return { ticket: ticketData };
  } catch (error) {
    console.log("Error:", error);
    return handleError(error, false, { ticket: null });
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
