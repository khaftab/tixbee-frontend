import { useSubmit, Form, useSearchParams } from "@remix-run/react";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";

export default function DateFilter() {
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const checked = newSearchParams.get("sort") === "past" ? false : true;

  const handleToggle = (checked: boolean) => {
    newSearchParams.set("sort", checked ? "latest" : "past");
    if (!newSearchParams.has("page")) {
      newSearchParams.set("page", "1");
    }
    if (!newSearchParams.has("category")) {
      newSearchParams.set("category", "conference");
    }
    submit(newSearchParams, { method: "get" });
  };

  return (
    <Form method="get" className="flex items-center space-x-2">
      <Switch
        id="ticket-time-toggle"
        defaultChecked={checked}
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-blue-500"
      />
      <Label
        htmlFor="ticket-time-toggle"
        className="text-sm font-medium cursor-pointer select-none"
      >
        Recent Tickets
      </Label>
    </Form>
  );
}
