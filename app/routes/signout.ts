import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import { EnvType } from "~/types/types";
import { handleError } from "~/lib/handleError";

export async function action({ request, context }: ActionFunctionArgs) {
  const { HOST } = context.cloudflare.env as EnvType;
  try {
    const response = await fetch(`${HOST}/api/users/signout`, {
      method: "GET",
      headers: {
        Cookie: request.headers.get("Cookie") || "",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      return handleError(data, response);
    }

    // Get all cookies from response headers
    const cookie = response.headers.get("set-cookie") || "";
    // cookie value is a string event if there are multiple cookies.

    return redirect("/", {
      headers: {
        "Set-Cookie": cookie,
      },
    });
  } catch (error) {
    handleError(error, false);
  }
  return null;
}
