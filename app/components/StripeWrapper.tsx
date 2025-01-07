import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "~/lib/stripe-client";

export default function StripeWrapper({ children }: { children: React.ReactNode }) {
  return <Elements stripe={getStripe()}>{children}</Elements>;
}
