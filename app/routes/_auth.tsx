import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Outlet, useLoaderData } from "@remix-run/react";
import DotPattern from "~/components/DotPattern";
import Navbar from "~/components/Navbar";
import axios from "~/config/axiosConfig";
import { useToastError } from "~/hooks/useToastError";
import { handleError } from "~/lib/handleError";
import { cn } from "~/lib/utils";
import { EnvType } from "~/types/types";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { HOST } = context.cloudflare.env as EnvType;
  try {
    const response = await axios.get(`${HOST}/api/users/currentuser`, {
      headers: {
        Cookie: request.headers.get("Cookie"),
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    return handleError(error, { currentUser: null });
  }
}

export default function Auth() {
  const data = useLoaderData<typeof loader>();
  useToastError(data);
  return (
    <div className="relative min-h-screen">
      {/* Dot Pattern Spread Across Entire Page */}
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn("absolute inset-0 w-full h-full")} // Ensures DotPattern covers the entire screen
      />
      <div className="relative min-h-screen flex flex-col justify-between z-10">
        <Navbar currentUser={data.currentUser} />
        <Outlet />
        <div></div>
      </div>
    </div>
  );
}
