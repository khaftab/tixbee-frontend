import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, useNavigation } from "@remix-run/react";
import axios from "../config/axiosConfig";
import TicketList from "~/components/TicketList";
import Loader from "~/components/Loader";
import PaginationComponent from "~/components/Pagination";
import SortAndFilter from "~/components/SortAndFilter";
import { EnvType, TicketResult } from "~/types/types";
import { handleError } from "~/lib/handleError";
import { useToastError } from "~/hooks/useToastError";
import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [{ title: "TixBee - Tickets" }];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { HOST } = context.cloudflare.env as EnvType;
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const category = url.searchParams.get("category") || "conference";
  const sortOrder = url.searchParams.get("sortOrder") || "desc";
  const sortBy = url.searchParams.get("sortBy") || "date";
  const filterBy = url.searchParams.get("filterBy") || "all";

  try {
    const response = await axios.get(
      `${HOST}/api/tickets/category/${category}?sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}&filterBy=${filterBy}`,
      {
        headers: {
          Cookie: request.headers.get("Cookie"),
        },
      }
    );
    return {
      tickets: response.data.tickets,
      totalTickets: response.data.totalTickets,
      page,
    };
  } catch (error) {
    return handleError(error, { tickets: [], totalTickets: 0, page });
  }
}

export default function TicketsRoute() {
  const data = useLoaderData<{ tickets: TicketResult[]; totalTickets: number; page: number }>();
  useToastError(data);
  const { tickets, totalTickets, page } = data;
  const navigation = useNavigation();

  console.log("tickets", tickets);
  const filterList = {
    mytickets: "My Tickets",
    all: "All Tickets",
  };

  return (
    <div className="max-w-5xl w-full mx-auto flex-1 grid sm:grid-cols-[1fr] relative justify-center my-7 space-y-5 sm:space-y-0">
      <div className="mb-7 mt-3 sm:sticky top-5 z-50 mr-10">
        <div>
          <SortAndFilter
            filterList={filterList}
            context="ticket"
            className="flex justify-center flex-wrap space-x-5 gap-y-3"
          />
        </div>
      </div>
      {navigation.state === "loading" ? (
        <Loader />
      ) : totalTickets === 0 ? (
        <div className="flex items-center justify-center absolute top-[65%] sm:top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-50">
          <h2 className="text-xl font-semibold font-inter-light">No tickets available</h2>
        </div>
      ) : (
        <div className="">
          <TicketList tickets={tickets} />
          <PaginationComponent totalCount={totalTickets} page={page} />
        </div>
      )}
    </div>
  );
}
