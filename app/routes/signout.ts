import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import axios from "../config/axiosConfig";
import { EnvType } from "~/types/types";

export async function action({ request, context }: ActionFunctionArgs) {
  const { HOST } = context.cloudflare.env as EnvType;
  // Actions run on server-side. To delete cookie from client we need forward the respose from our backend to clinet.
  try {
    const response = await axios.get(`${HOST}/api/users/signout`, {
      headers: {
        Cookie: request.headers.get("Cookie") || "",
      },
    });
    /**  'set-cookie': [
      'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=none; secure; httponly'
    ] 
    */
    return redirect("/", {
      headers: {
        "Set-Cookie": Array.isArray(response.headers["set-cookie"])
          ? response.headers["set-cookie"][0]
          : "",
      },
    });
  } catch (error) {
    console.error(error);
  }
  return null;
}
