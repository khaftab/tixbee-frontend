import { Link, useFetcher } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Form } from "~/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomFormField from "./CustomFormField";
import { ErrorType, useToastError } from "~/hooks/useToastError";

type AuthFormProps = {
  isSigninPage: boolean;
};

export default function AuthForm({ isSigninPage }: AuthFormProps) {
  const fetcher = useFetcher<ErrorType | null | undefined>();
  useToastError(fetcher.data);
  const formSchema = z.object({
    email: z.string().min(3, "Email is required").email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formdata = new FormData();
    console.log(values);
    formdata.append("email", values.email);
    formdata.append("password", values.password);

    fetcher.submit(formdata, {
      method: "POST",
      encType: "multipart/form-data",
    });
  }

  return (
    <Card className="mx-auto max-w-sm w-full bg-inherit backdrop-blur-[2px]">
      {isSigninPage ? (
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
      ) : (
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
      )}

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <div className="grid gap-2">
                <CustomFormField
                  form={form}
                  name="email"
                  label="Email"
                  placeholder="john@example.com"
                />
              </div>
              <div className="grid gap-2">
                <CustomFormField
                  form={form}
                  name="password"
                  label="Password"
                  placeholder="john1234"
                  type="password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={fetcher.state === "submitting"}>
                {isSigninPage ? "Sign In" : "Sign Up"}
              </Button>
            </div>
            {isSigninPage ? (
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/auth/signup" className="underline">
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="mt-4 text-center text-sm text-primary">
                Already have an account?{" "}
                <Link to="/auth/signin" className="underline">
                  Sign in
                </Link>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
