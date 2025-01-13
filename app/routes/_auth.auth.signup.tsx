import { useActionData } from "@remix-run/react";
import AuthForm from "~/components/AuthForm";
import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import { useToastError } from "~/hooks/useToastError";
import { handleError } from "~/lib/handleError";
import { EnvType } from "~/types/types";
import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [{ title: "TixBee - Signup" }];
};

export async function action({ request, context }: ActionFunctionArgs) {
  const { HOST } = context.cloudflare.env as EnvType;

  const body = await request.formData();
  const email = body.get("email");
  const password = body.get("password");

  try {
    const response = await fetch(`${HOST}/api/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return handleError(data, response);
    }

    // Get all cookies from response headers
    const cookie = response.headers.get("set-cookie") || "";

    return redirect("/", {
      headers: {
        "Set-Cookie": cookie,
      },
    });
  } catch (error) {
    return handleError(error, false);
  }
}

export default function SignupRoute() {
  const actionData = useActionData<typeof action>();
  useToastError(actionData);

  return (
    <div className="px-4 lg:px-0">
      <AuthForm isSigninPage={false} />
    </div>
  );
}
