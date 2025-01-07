import { loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<any>;
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      "pk_test_51JZUyxSA5dDFdYCX0ezQTZ4MlnOConxXpSHMsa84V1Niv7YKgEzQ0hw9bWggm6mrMkwguXrUTu11aplv3ovg6y37006yore1Y1"
    );
  }
  return stripePromise;
};
