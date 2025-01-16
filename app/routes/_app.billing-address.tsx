import { ActionFunctionArgs, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import BillingForm from "~/components/BillingForm";
import NotSignedIn from "~/components/NotSignedIn";
import { useToastError } from "~/hooks/useToastError";
import { handleError } from "~/lib/handleError";
import { ProfileSchema } from "~/lib/zodValidationSchema";
import { EnvType, CurrentUser } from "~/types/types";
import type { MetaFunction } from "@remix-run/cloudflare";
import { jsonResponse } from "~/lib/utils";

export const meta: MetaFunction = () => {
  return [{ title: "TixBee - Billing address" }];
};

export const loader: LoaderFunction = async ({ request, context }) => {
  const { HOST } = context.cloudflare.env as EnvType;
  try {
    const response = await fetch(`${HOST}/api/users/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: request.headers.get("Cookie") || "",
      },
    });
    const userData = (await response.json()) as any;
    if (!response.ok) {
      return handleError(userData, response, { currentUser: null });
    }
    return { currentUser: userData };
  } catch (error) {
    return handleError(error, false, { currentUser: null });
  }
};

export async function action({ request, context }: ActionFunctionArgs) {
  const { HOST } = context.cloudflare.env as EnvType;
  const body = await request.formData();
  const bodyObject: Record<string, string> = {};
  body.forEach((value, key) => {
    bodyObject[key] = value.toString();
  });

  const validationResult = ProfileSchema.safeParse(bodyObject);
  if (!validationResult.success) {
    return handleError(new Error("Validation failed in backend"));
  }

  try {
    const response = await fetch(`${HOST}/api/users/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: request.headers.get("Cookie") || "",
      },
      body: JSON.stringify(bodyObject),
    });
    const userData = (await response.json()) as any;
    if (!response.ok) {
      return handleError(userData, response);
    }
    return jsonResponse({ success: true });
  } catch (error) {
    return handleError(error, false);
  }
}

const EditProfileRoute = () => {
  const data = useLoaderData<CurrentUser>();

  useToastError(data);

  if (!data.currentUser) {
    return <NotSignedIn />;
  }
  return (
    <div>
      <BillingForm user={data.currentUser} />
    </div>
  );
};

export default EditProfileRoute;
