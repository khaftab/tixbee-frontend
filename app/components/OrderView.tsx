import { OrderResult, User } from "~/types/types";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "~/components/ui/card";
import { useCallback, useEffect, useState } from "react";
import { MoveLeft } from "lucide-react";
import { Link, useNavigate } from "@remix-run/react";
import StripeWrapper from "./StripeWrapper";
import PaymentForm from "./PaymentForm";
import { toast } from "~/hooks/use-toast";

type OrderViewProps = {
  order: OrderResult;
  user: User;
};

const OrderView = ({ order, user }: OrderViewProps) => {
  console.log("order", order.expiresAt);

  const calculateTimeLeft = useCallback(() => {
    const difference = new Date(order.expiresAt).getTime() - new Date().getTime();
    return Math.max(0, Math.floor(difference / 1000));
  }, [order]);
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);
  useEffect(() => {
    if (order.status === "complete") {
      navigate("/view-orders");
    }
  }, [order]);

  useEffect(() => {
    if (!timeLeft) {
      // return revalidator.revalidate();
      order.status = "cancelled";
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(calculateTimeLeft);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  return (
    <section className="my-8 px-4 sm:my-16">
      <Card className="w-full max-w-md mx-auto overflow-hidden bg-background">
        <CardContent className="px-4 mt-5">
          <CardTitle className="text-xl font-bold mb-4">{order.ticket.title}</CardTitle>
          <div className="flex  sm:flex-row justify-between items-start sm:items-center ">
            <div className="mb-4 sm:mb-0">
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">Price</h3>
              <p className="text-xl font-bold">${order.ticket.price.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">Time left</h3>
              <Badge variant="destructive" className="text-sm font-inter-light">
                {timeLeft}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">Status</h3>
              <Badge
                variant={
                  order.status === "created" || order.status === "complete"
                    ? "default"
                    : "destructive"
                }
                className="text-sm font-inter-light"
              >
                {order.status}
              </Badge>
            </div>
          </div>
        </CardContent>

        {timeLeft === 0 && (
          <CardFooter>
            <div className="w-full">
              <Link to={`/tickets`}>
                <Button className="w-full flex items-center justify-center" size="lg">
                  <MoveLeft className="mr-2 h-5 w-5" aria-hidden="true" />
                  <span>Back</span>
                </Button>
              </Link>
            </div>
          </CardFooter>
        )}

        {timeLeft !== 0 && (
          <StripeWrapper>
            <PaymentForm hasBillingAddress={!!user.billingAddress} orderId={order.id} user={user} />
          </StripeWrapper>
        )}
      </Card>
    </section>
  );
};

export default OrderView;
