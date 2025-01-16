import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import CustomFormField from "./CustomFormField";
import { ProfileSchema } from "~/lib/zodValidationSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User } from "~/types/types";
import { useFetcher, useNavigate } from "@remix-run/react";
import { Form } from "./ui/form";
import { Button } from "./ui/button";
import { useToastError } from "~/hooks/useToastError";
import { useEffect, useState } from "react";
import { City, Country, ICity, ICountry, IState, State } from "@kh-micro-srv/country-state-city";
import CustomSelect from "./CustomSelect";

const BillingForm = ({ user }: { user: User }) => {
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const fetcher = useFetcher<any>();
  const navigate = useNavigate();
  useEffect(() => {
    if (fetcher.data?.success) {
      navigate(-1);
    }
  }, [fetcher.data]);

  useEffect(() => {
    setCountries(Country.getAllCountries());
    if (user.billingAddress?.country) {
      setStates(State.getStatesOfCountry(user.billingAddress.country));
      if (user.billingAddress?.state) {
        setCities(City.getCitiesOfState(user.billingAddress.country, user.billingAddress.state));
      }
    }
  }, []);

  const handleCountryChange = async (v: string) => {
    await form.setValue("state", "");
    await form.setValue("city", "");
    setStates(State.getStatesOfCountry(v));
    setCities([]);
    form.setValue("country", v);
    await form.trigger("country");
  };

  const handleStateChange = async (v: string) => {
    form.setValue("city", "");
    setCities(City.getCitiesOfState(form.getValues("country"), v));
    form.setValue("state", v);
    await form.trigger("state");
  };

  useToastError(fetcher.data);

  const onSubmit = (data: z.infer<typeof ProfileSchema>) => {
    const formdata = new FormData();
    formdata.append("name", data.name);
    formdata.append("address", data.address);
    formdata.append("postalCode", data.postalCode);
    formdata.append("city", data.city);
    formdata.append("state", data.state);
    formdata.append("country", data.country);
    fetcher.submit(formdata, {
      method: "post",
      action: "/billing-address",
      encType: "multipart/form-data",
    });
  };
  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    mode: "onTouched",
    defaultValues: {
      name: user.billingAddress?.name ?? "",
      address: user.billingAddress?.address ?? "",
      postalCode: user.billingAddress?.postalCode ?? "",
      city: user.billingAddress?.city ?? "",
      state: user.billingAddress?.state ?? "",
      country: user.billingAddress?.country ?? "",
    },
  });

  return (
    <div className="mx-2">
      <Card className="mx-auto max-w-md w-full my-7">
        <CardHeader>
          <CardTitle className="text-2xl">Billing address</CardTitle>
          <CardDescription>Update / view billing address</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2" method="post">
              <CustomFormField form={form} name="name" label="Name" placeholder="John Smith" />
              <CustomFormField
                form={form}
                name="address"
                label="Address"
                placeholder="136, Karl Marx Sarani Rd"
              />
              <div className="flex space-x-3">
                <CustomFormField
                  form={form}
                  name="postalCode"
                  label="Postal Code"
                  placeholder="701056"
                />

                <CustomSelect
                  form={form}
                  name="city"
                  label="City"
                  placeholder="Select a city"
                  data={cities}
                  handleChange={(v) => form.setValue("city", v)}
                />
              </div>
              <div className="flex space-x-3">
                <CustomSelect
                  form={form}
                  name="state"
                  label="State"
                  placeholder="Select a state"
                  data={states}
                  handleChange={handleStateChange}
                />
                <CustomSelect
                  form={form}
                  name="country"
                  label="Country"
                  placeholder="Select a country"
                  data={countries}
                  handleChange={handleCountryChange}
                />
              </div>
              <Button type="submit" className="w-full" disabled={fetcher.state === "submitting"}>
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingForm;
