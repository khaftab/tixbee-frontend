import { ActionFunctionArgs, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import OrderView from "~/components/OrderView";
import { handleError } from "~/lib/handleError";
import { EnvType, OrderResult, User } from "~/types/types";
import { useToastError } from "~/hooks/useToastError";
import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [{ title: "TixBee - Order page" }];
};

export const loader: LoaderFunction = async ({ request, params, context }) => {
  const { HOST } = context.cloudflare.env as EnvType;
  const { id } = params;
  try {
    const orderResponse = await fetch(`${HOST}/api/orders/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: request.headers.get("Cookie") || "",
      },
    });

    const userResponse = await fetch(`${HOST}/api/users/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: request.headers.get("Cookie") || "",
      },
    });
    const orderData = (await orderResponse.json()) as any;
    const userData = (await userResponse.json()) as any;
    if (!orderResponse.ok) {
      return handleError(orderData, orderResponse, { order: null, user: null });
    }
    if (!userResponse.ok) {
      return handleError(userData, userResponse, { order: null, user: null });
    }
    return { order: orderData, user: userData };
  } catch (error) {
    return handleError(error, false, { order: null, user: null });
  }
};

export async function action({ request, context }: ActionFunctionArgs) {
  const { HOST } = context.cloudflare.env as EnvType;
  const body = await request.formData();
  const token = body.get("token");
  const orderId = body.get("orderId");
  const name = body.get("name");
  const address = body.get("address");
  const postalCode = body.get("postalCode");
  const city = body.get("city");
  const state = body.get("state");
  const country = body.get("country");

  let billingInfo = {};
  if (!name) {
    billingInfo = {
      name: "John Doe",
      line1: "123 Main St",
      city: "San Francisco",
      state: "CA",
      country: "US",
      postal_code: "94111",
    };
  } else {
    billingInfo = {
      name,
      line1: address,
      postal_code: postalCode,
      city,
      state,
      country,
    };
  }

  try {
    const response = await fetch(`${HOST}/api/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: request.headers.get("Cookie") || "",
      },
      body: JSON.stringify({ token, orderId, billingInfo }),
    });

    const paymentData = (await response.json()) as any;

    if (!response.ok) {
      return handleError(paymentData, response, { order: null, user: null });
    }

    return paymentData;
  } catch (error) {
    return handleError(error, false, { order: null, user: null });
  }
}

export default function OrderRoute() {
  const data = useLoaderData<{ order: OrderResult; user: User }>();
  useToastError(data);
  const { order, user } = data;
  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <h2 className="text-2xl font-semibold">Order not found</h2>
      </div>
    );
  }

  return <OrderView order={order} user={user} />;
}
