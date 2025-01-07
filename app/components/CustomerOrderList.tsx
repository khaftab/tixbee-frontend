import { useEffect } from "react";
import OrderTable from "./OrderTable";
import { useRevalidator, useSearchParams } from "@remix-run/react";

import { OrderData } from "~/types/types";
import SortAndFilter from "./SortAndFilter";

type OrderListProps = {
  orders: OrderData[];
  totalOrders: number;
};

const CustomerOrderList = ({ orders }: OrderListProps) => {
  const revalidator = useRevalidator();
  const [searchParams] = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  useEffect(() => {
    if (newSearchParams.get("source") === "payment_success") {
      setTimeout(() => {
        revalidator.revalidate();
      }, 3000);
    }
  }, []);

  const orderStep = {
    all: "All",
    complete: "Complete",
    cancelled: "Cancelled",
  };

  return (
    <div className="flex flex-col justify-center mx-auto bg-backgroundd faded-bg p-0 md:p-6 rounded-lg shadow-md max-w-3xl border">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h2 className="text-xl my-4 font-bold">Order History</h2>
        <SortAndFilter
          filterList={orderStep}
          context="order"
          className="flex flex-wrap justify-center items-center gap-4"
        />
      </div>
      {orders.length === 0 ? (
        <div className="flex items-end justify-center pb-5 md:pb-0 mt-5">
          <h2 className="text-md font-semibold">No order found</h2>
        </div>
      ) : (
        <OrderTable orders={orders} />
      )}
    </div>
  );
};
export default CustomerOrderList;
