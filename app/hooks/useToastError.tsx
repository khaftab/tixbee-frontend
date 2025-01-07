import { useEffect } from "react";
import { useToast } from "~/hooks/use-toast";

// Define the structure of actionData. actionData can be undefined, so we need to make all properties optional.
// If there is network error, then data will be undefined (since no response from backend).

export interface ErrorType {
  error: boolean;
  message: string;
  isNetworkError: boolean;
  status: number;
  data?: Array<{ message: string }>;
}

// export type ToastErrorType = ErrorType | null | undefined;
export type ToastErrorType = any;

export const useToastError = (actionData: ToastErrorType) => {
  const { toast } = useToast();
  useEffect(() => {
    if (actionData?.error) {
      if (actionData.isNetworkError) {
        toast({
          title: "Network Error",
          description: "Please check your internet connection",
          variant: "destructive",
        });
      } else if (actionData.data) {
        actionData.data.forEach((err: any) => {
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive",
          });
        });
      } else {
        toast({
          title: "Error",
          description: actionData.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    }
  }, [actionData, toast]);
};
