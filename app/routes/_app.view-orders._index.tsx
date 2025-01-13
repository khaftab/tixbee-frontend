import { LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import CustomerOrderList from "~/components/CustomerOrderList";
import PaginationComponent from "~/components/Pagination";
import { handleError } from "~/lib/handleError";
import { useToastError } from "~/hooks/useToastError";
import { EnvType, OrderData } from "~/types/types";
import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [{ title: "TixBee - View orders" }];
};

export const loader: LoaderFunction = async ({ request, context }) => {
  const { HOST } = context.cloudflare.env as EnvType;
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const sortOrder = url.searchParams.get("sortOrder") || "desc";
  const sortBy = url.searchParams.get("sortBy") || "date";
  const filterBy = url.searchParams.get("filterBy") || "all";

  try {
    const response = await fetch(
      `${HOST}/api/orders?sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}&filterBy=${filterBy}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: request.headers.get("Cookie") || "",
        },
      }
    );

    const orderData = (await response.json()) as any;

    if (!response.ok) {
      return handleError(orderData, response, { orders: [], totalOrders: 0, page: 1 });
    }

    return { orders: orderData.orders, totalOrders: orderData.totalOrders, page };
  } catch (error) {
    return handleError(error, false, { orders: [], totalOrders: 0, page: 1 });
  }
};

const ViewAllOrdersRoute = () => {
  const data = useLoaderData<{ orders: OrderData[]; totalOrders: number; page: number }>();
  useToastError(data);

  return (
    <div className="my-14 px-4 lg:px-0">
      <CustomerOrderList orders={data.orders} totalOrders={data.totalOrders} />
      <PaginationComponent totalCount={data.totalOrders} page={data.page} />
    </div>
  );
};

export default ViewAllOrdersRoute;
