import { useActionData, useLoaderData, useOutletContext } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunction, redirect } from "@remix-run/cloudflare";
import axios from "~/config/axiosConfig";
import { handleError } from "~/lib/handleError";
import { EnvType, OutletContext, TicketResult } from "~/types/types";
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

export async function action({ request, context }: ActionFunctionArgs) {
  const { HOST } = context.cloudflare.env as EnvType;
  const body = await request.formData();
  const ticketId = body.get("ticketId");

  try {
    const res = await axios.post(
      `${HOST}/api/orders`,
      {
        ticketId,
      },
      {
        headers: {
          Cookie: request.headers.get("Cookie"),
        },
      }
    );
    console.log(res.data);
    if (res.status === 202) {
      return redirect(`/queue/${res.data.ticketId}`);
    }

    if (res.status === 206) {
      console.log("Redirecting to order page");
      return redirect(`/orders/${res.data.orderId}`);
      // if user tries to visit queue page or tries to buy same ticket, while the order is still pending.
    }

    return redirect(`/orders/${res.data.id}`);
  } catch (error: any) {
    return handleError(error);
  }
}

const TicketDetails = () => {
  const data = useLoaderData<{ ticket: TicketResult }>();
  const { currentUser } = useOutletContext<OutletContext>();

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
