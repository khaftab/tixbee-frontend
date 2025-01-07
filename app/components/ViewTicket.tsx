import { generateCloudinaryUrl } from "~/lib/utils";
import { TicketResult } from "~/types/types";
import { Card, CardContent } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { Link, Form, useNavigation } from "@remix-run/react";
import { Button } from "~/components/ui/button";

const ViewTicket = ({ ticket, isEdit }: { ticket: TicketResult; isEdit: Boolean }) => {
  const navigation = useNavigation();
  return (
    <section className="w-full max-w-md md:max-w-full my-12 md:my-16 lg:my-20">
      <Card className="rounded-lg overflow-hidden shadow-lg bg-background">
        <div className="md:flex items-center bg-red-4000">
          <div className="flex-shrink-0 md:w-1/2 p-4 md:p-6">
            <img
              src={generateCloudinaryUrl(ticket.thumbnailImagePublicId)}
              alt="Product Image"
              className="max-h-96 object-contain mx-auto"
            />
          </div>
          <CardContent className="p-4 md:p-6 md:!pl-0 md:w-1/2 bg-background flex-1 flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-inter-light font-semibold">{ticket.title}</h3>
                  <div className="my-5 space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TagIcon className="w-4 h-4" />
                      <span>{ticket.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <ClockIcon className="w-4 h-4" />
                      <span>
                        {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>

                <span className="text-2xl font-inter-light font-semibold text-primary">
                  ${ticket.price}
                </span>
              </div>
              <ScrollArea
                className={ticket.description.length > 300 ? "ql-editor !h-60 pr-3" : "ql-editor"}
              >
                <div dangerouslySetInnerHTML={{ __html: ticket.description }} />
              </ScrollArea>
            </div>
            <div className="flex gap-4 mt-7">
              <Form method="post" className="flex-1">
                <Button
                  size="sm"
                  value={ticket.id}
                  name="ticketId"
                  className="w-full bg-primary text-primary-foreground"
                  disabled={navigation.state === "submitting"}
                >
                  Buy Now
                </Button>
              </Form>
              <div className="flex-1">
                {isEdit && (
                  <Link to={`/edit-ticket/${ticket.id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-muted-foreground hover:bg-muted"
                    >
                      Edit
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </section>
  );
};

export default ViewTicket;

function ClockIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function TagIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
      <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
    </svg>
  );
}
