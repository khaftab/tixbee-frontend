import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Outlet, useLoaderData } from "@remix-run/react";
import DotPattern from "~/components/DotPattern";
import Navbar from "~/components/Navbar";
import { useToastError } from "~/hooks/useToastError";
import { handleError } from "~/lib/handleError";
import { cn } from "~/lib/utils";
import { CurrentUser, EnvType } from "~/types/types";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { HOST } = context.cloudflare.env as EnvType;

  try {
    const response = await fetch(`${HOST}/api/users/currentuser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: request.headers.get("Cookie") || "",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      return handleError(data, response, { currentUser: null });
    }
    return data as CurrentUser;
  } catch (error: any) {
    return handleError(error, false, { currentUser: null });
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
