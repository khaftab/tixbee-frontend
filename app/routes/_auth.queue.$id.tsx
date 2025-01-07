import { LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import TicketQueue from "~/components/Queue";
import { useToastError } from "~/hooks/useToastError";
import { handleError } from "~/lib/handleError";
import { EnvType } from "~/types/types";
import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [{ title: "TixBee - Queue page" }];
};

export const loader: LoaderFunction = async ({ request, params, context }) => {
  const { HOST } = context.cloudflare.env as EnvType;
  const { id } = params;
  if (!HOST) {
    return handleError(new Error("Environment variable HOST not set"), { HOST: "", ticketId: "" });
  }

  return {
    HOST: HOST,
    ticketId: id,
    cookie: request.headers.get("Cookie"),
  };
};

const QueueRoute = () => {
  const data = useLoaderData<{ HOST: string; ticketId: string; cookie: string }>();
  useToastError(data);

  return <TicketQueue HOST={data.HOST} ticketId={data.ticketId} cookie={data.cookie} />;
};

export default QueueRoute;
