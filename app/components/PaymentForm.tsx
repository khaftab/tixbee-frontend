import React, { useEffect, useRef, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import type { StripeCardElementOptions } from "@stripe/stripe-js";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { CreditCard } from "lucide-react";
import { Link, useFetcher, useNavigate } from "@remix-run/react";
import { Checkbox } from "./ui/checkbox";
import { User } from "~/types/types";
import { toast } from "~/hooks/use-toast";
import { useToastError } from "~/hooks/useToastError";

type PaymentFormProps = {
  hasBillingAddress: Boolean;
  orderId: string;
  user: User;
};
export default function PaymentForm({ hasBillingAddress, orderId, user }: PaymentFormProps) {
  const fetcher = useFetcher<{ requiresAction: boolean; clientSecret: string; status: number }>();
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [isChecked, setIsChecked] = useState(!!hasBillingAddress);
  const [textColor, setTextColor] = useState("#333");
  const navigate = useNavigate();

  const cardStyle: StripeCardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: textColor,
        fontFamily: "sans-serif",
        fontWeight: "500",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };
  useToastError(fetcher.data);
  useEffect(() => {
    setTextColor(
      document.documentElement.getAttribute("data-theme") === "dark" ? "#f3f3f3" : "#333"
    );
    const run = async () => {
      // Step 3: Handle potential 3D Secure authentication
      if (fetcher.data) {
        if (!stripe || !elements) return;
        if (fetcher.data.requiresAction) {
          const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
            fetcher.data.clientSecret
          );
          if (confirmError) {
            setProcessing(false);

            toast({
              title: "Error",
              description: confirmError.message || "An unexpected error occurred.",
              variant: "destructive",
            });
          } else if (paymentIntent.status === "succeeded") {
            // Payment successful after 3D Secure authentication
            console.log("Payment succeeded after 3D Secure");
            navigate("/view-orders?source=payment_success");
          }
        } else if (fetcher.data.status === 200) {
          // Payment successful without 3D Secure
          console.log("Payment succeeded without 3D Secure");
          navigate("/view-orders?source=payment_success");
        }
      }
    };
    run();
  }, [fetcher.data]);
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || processing || !isChecked) return; // for countering enter key press (which bypasses the button disabled state)
    if (!stripe || !elements) return;

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);

    if (cardElement) {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message ?? "An unknown error occurred",
          variant: "destructive",
        });
        setProcessing(false);
      } else {
        fetcher.submit(
          {
            token: paymentMethod.id,
            orderId,
            ...user.billingAddress,
          },
          { method: "post" }
        );
      }
    } else {
      toast({
        title: "Error",
        description: "Card element not found",
        variant: "destructive",
      });
      setProcessing(false);
    }
  };
  const spanRef = useRef(null);

  const handleDoubleClick = () => {
    if (spanRef.current) {
      const range = document.createRange();
      range.selectNodeContents(spanRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-none bg-background backdrop-blur-md">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>Enter your card information to complete the payment</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <CardElement
              options={cardStyle}
              className="p-3 border rounded-md shadow-sm text-muted-foreground"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Use card number{" "}
              <span
                className="font-inter-medium cursor-text text-gray-700 dark:text-gray-300"
                ref={spanRef}
                onDoubleClick={handleDoubleClick}
              >
                4000 0000 0000 3220
              </span>
              {""} with any future expiry date, CVC, and ZIP code to test payment.
            </p>
          </div>
          {!hasBillingAddress && (
            <div>
              <p className="text-sm text-pretty">
                Billing address is missing.{" "}
                <span className="text-blue-500 underline">
                  <Link to="/billing-address">Update here</Link>
                </span>{" "}
                or
              </p>
              <div className="flex items-center space-x-2 my-4">
                <Checkbox
                  id="terms"
                  checked={isChecked}
                  onCheckedChange={(checked) => setIsChecked(!!checked)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Use dummy billling address
                </label>
              </div>
            </div>
          )}
          <Button
            className="w-full flex items-center justify-center"
            type="submit"
            size="lg"
            disabled={!stripe || processing || !isChecked}
          >
            <CreditCard className="mr-2 h-5 w-5" aria-hidden="true" />
            <span>{processing ? "Processing..." : "Pay Now"}</span>
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-sm text-gray-500 text-center">
        Your payment is secure and encrypted
      </CardFooter>
    </Card>
  );
}
