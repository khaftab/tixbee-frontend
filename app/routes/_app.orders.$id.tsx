import { ActionFunctionArgs, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import axios from "~/config/axiosConfig";
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
    const orderResponse = await axios.get(`${HOST}/api/orders/${id}`, {
      headers: {
        Cookie: request.headers.get("Cookie"),
      },
    });

    const userResponse = await axios.get(`${HOST}/api/users/user`, {
      headers: {
        Cookie: request.headers.get("Cookie"),
      },
    });

    return { order: orderResponse.data, user: userResponse.data };
  } catch (error: any) {
    console.log(error.response.data);
    return { order: null, user: null };
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
    const response = await axios.post(
      `${HOST}/api/payments`,
      {
        token,
        orderId,
        billingInfo,
      },
      {
        headers: {
          Cookie: request.headers.get("Cookie"),
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    return handleError(error, { order: null, user: null });
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
