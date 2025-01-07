import { useActionData } from "@remix-run/react";
import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import axios from "../config/axiosConfig";
import { useToastError } from "~/hooks/useToastError";
import { handleError } from "~/lib/handleError";
import AuthForm from "~/components/AuthForm";
import { EnvType } from "~/types/types";
import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [{ title: "TixBee - Signin" }];
};

export async function action({ request, context }: ActionFunctionArgs) {
  const { HOST } = context.cloudflare.env as EnvType;
  const body = await request.formData();
  const email = body.get("email");
  const password = body.get("password");
  try {
    const response = await axios.post(`${HOST}/api/users/signin`, {
      email,
      password,
    });
    return redirect("/", {
      headers: {
        "Set-Cookie": Array.isArray(response.headers["set-cookie"])
          ? response.headers["set-cookie"][0]
          : "",
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

export default function SigninRoute() {
  const actionData = useActionData<typeof action>();
  useToastError(actionData);

  return (
    <div className="px-4 lg:px-0">
      <AuthForm isSigninPage={true} />
    </div>
  );
}
