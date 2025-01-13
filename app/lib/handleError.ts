// import { isAxiosError } from "axios";
import { json } from "@remix-run/cloudflare";

export const handleError = (errorData: any, errorResponse?: any, data?: any) => {
  const status = (errorResponse?.status || 500) as number; // Default to 500 if no status available
  return json(
    {
      error: true,
      message: (!errorResponse && "An error occurred") as string,
      isNetworkError: errorResponse === false, // Check if error is network error
      status, // Include status code
      // data: error.response?.data?.errors || null, // Include error data if available
      data: errorData?.errors || null, // Include error data if available
      ...data,
    },
    { status }
  );
  // } else {
  //   // throw error; // Will be caught by Remix's error boundary
  // }
};
