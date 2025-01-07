import { isAxiosError } from "axios";
import { json } from "@remix-run/cloudflare";

export const handleError = (error: any, data?: any) => {
  const status = (error.response?.status || 500) as number; // Default to 500 if no status available
  return json(
    {
      error: true,
      message: (error?.message || "An error occurred") as string,
      isNetworkError: isAxiosError(error) && !error.response,
      status, // Include status code
      data: error.response?.data?.errors || null, // Include error data if available
      ...data,
    },
    { status }
  );
  // } else {
  //   // throw error; // Will be caught by Remix's error boundary
  // }
};
