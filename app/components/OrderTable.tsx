import { Button } from "~/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "~/components/ui/table";
import { Link } from "@remix-run/react";
import { OrderData } from "~/types/types";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import { Download, SquareArrowOutUpRight } from "lucide-react";
import { generateCloudinaryUrl } from "~/lib/utils";

const OrderTable = ({ orders }: { orders: OrderData[] }) => {
  console.log(orders);
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-left">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium w-[40%]">{order.ticket.title}</TableCell>
              <TableCell className="w-1/6">${order.ticket.price.toFixed(2)}</TableCell>
              <TableCell className="w-1/6">
                {format(new Date(order.updatedAt), "dd/MM/yyyy")}
              </TableCell>
              <TableCell className="w-1/6">
                <Badge
                  className={
                    order.status === "complete"
                      ? "bg-green-600 hover:bg-green-500 text-white"
                      : order.status === "created"
                      ? ""
                      : ""
                  }
                  variant={
                    order.status === "complete" || order.status === "created"
                      ? "default"
                      : "destructive"
                  }
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="w-1/6">
                {order.ticket.ticketImagePublicId ? (
                  <Button size="sm" variant="outline">
                    <a
                      href={generateCloudinaryUrl(order.ticket.ticketImagePublicId)}
                      target="_blank"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </Button>
                ) : order.status === "created" ? (
                  <Link to={`/orders/${order.id}`} target="_blank">
                    <Button size="sm" variant="outline">
                      <SquareArrowOutUpRight className="w-4 h-4" />
                    </Button>
                  </Link>
                ) : (
                  <Button size="sm" variant="outline" className="cursor-not-allowed">
                    <Download className="w-4 h-4 cursor-not-allowed" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderTable;
