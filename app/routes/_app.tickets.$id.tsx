import { useActionData, useLoaderData, useOutletContext } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunction, redirect } from "@remix-run/cloudflare";
import { handleError } from "~/lib/handleError";
import { EnvType, CurrentUser, TicketResult } from "~/types/types";
import ViewTicket from "~/components/ViewTicket";
import { useToastError } from "~/hooks/useToastError";
import "react-quill/dist/quill.snow.css";
import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const { ticket } = data as { ticket: TicketResult };
  if (!ticket) {
    return [{ title: "Ticket Not Found" }];
  }
  return [{ title: `TixBee - ${ticket.title}` }];
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

export async function action({ request, context }: ActionFunctionArgs) {
  const { HOST } = context.cloudflare.env as EnvType;
  const body = await request.formData();
  const ticketId = body.get("ticketId");

  try {
    const response = await fetch(`${HOST}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: request.headers.get("Cookie") || "",
      },
      body: JSON.stringify({ ticketId }),
    });
    const ticketData = (await response.json()) as any;
    if (!response.ok) {
      return handleError(ticketData, response);
    }
    if (response.status === 202) {
      return redirect(`/queue/${ticketData.ticketId}`);
    }
    if (response.status === 206) {
      console.log("Redirecting to order page");
      return redirect(`/orders/${ticketData.orderId}`);
    }
    return redirect(`/orders/${ticketData.id}`);
  } catch (error) {
    console.log("Error:", error);
    return handleError(error, false);
  }
}

const TicketDetails = () => {
  const data = useLoaderData<{ ticket: TicketResult }>();
  const { currentUser } = useOutletContext<CurrentUser>();

  const actionData = useActionData<typeof action>();
  useToastError(data);
  useToastError(actionData);

  if (!data.ticket) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <h2 className="text-xl font-semibold font-inter-light">Ticket not found</h2>
      </div>
    );
  }

  return (
    <div className="flex justify-center max-w-5xl w-full mx-auto px-4 lg:px-0">
      <ViewTicket ticket={data.ticket} isEdit={data.ticket.userId === currentUser?.id} />
    </div>
  );
};

export default TicketDetails;
