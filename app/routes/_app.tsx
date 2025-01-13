import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Outlet, useLoaderData } from "@remix-run/react";
import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";
import { cn } from "~/lib/utils";
import DotPattern from "~/components/DotPattern";
import { EnvType, CurrentUser } from "~/types/types";
import { handleError } from "~/lib/handleError";
import { useToastError } from "~/hooks/useToastError";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { HOST } = context.cloudflare.env as EnvType;
  console.log("from _app.tsx", HOST);

  try {
    const response = await fetch(`${HOST}/api/users/currentuser`, {
      headers: {
        "Content-Type": "application/json",
        Cookie: request.headers.get("Cookie") || "",
      },
    });
    let data = await response.json();
    if (!response.ok) {
      return handleError(data, response, { currentUser: null });
    }
    return data as CurrentUser;
  } catch (error: any) {
    return handleError(error, false, { currentUser: null });
  }
}

export default function SomeParent() {
  const data = useLoaderData<CurrentUser>();
  useToastError(data);
  console.log("from _app.tsx", data);

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

      <div className="relative min-h-screen flex flex-col justify-between z-10 mx-auto">
        <Navbar currentUser={data.currentUser} />
        <Outlet context={{ currentUser: data.currentUser }} />
        <Footer />
      </div>
    </div>
  );
}
