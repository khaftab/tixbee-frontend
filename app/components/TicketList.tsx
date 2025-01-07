import { Button } from "~/components/ui/button";
import { generateCloudinaryUrl } from "~/lib/utils";
import { TicketResult } from "~/types/types";
import { ClockIcon } from "lucide-react";
import { Link } from "@remix-run/react";
import { formatDistanceToNow } from "date-fns";

type TicketListProps = {
  tickets: TicketResult[];
};

export default function TicketList({ tickets }: TicketListProps) {
  if (tickets.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <h2 className="text-2xl font-semibold">No tickets available</h2>
      </div>
    );
  }
  return (
    <section className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 justify-items-center w-full md:w-[90%] mx-auto">
      {tickets.map((ticket) => (
        <div
          className="relative overflow-hidden rounded-lg bg-background shadow-md transition-transform duration-300 ease-in-out hover:shadow-lg hover:-translate-y-2 border-[1px] w-64 h-72"
          key={ticket.id}
        >
          <Link to={`/tickets/${ticket.id}`} className="absolute inset-0 z-100">
            <span className="sr-only">View ticket</span>
          </Link>
          <img
            src={generateCloudinaryUrl(
              ticket.thumbnailImagePublicId
              // "w_400,c_fill,f_auto,q_auto"
            )}
            alt={ticket.title}
            className="w-full object-cover border-b"
            style={{ aspectRatio: "300/200" }}
          />
          <div className="p-4">
            <h3 className="text-lg font-inter-light font-semibold truncate">{ticket.title}</h3>
            {ticket.category && (
              <p className="mb-2 mt-1 text-sm text-muted-foreground flex items-center">
                <ClockIcon className="w-4 h-4" />
                <span className="ml-1">
                  {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
                </span>
              </p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-base font-inter-light font-semibold">${ticket.price}</span>
              <Button variant="outline" size="sm" className="rounded-lg">
                Details
              </Button>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
