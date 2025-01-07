import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { UseFormReturn } from "react-hook-form";
import { ICity, ICountry, IState } from "@kh-micro-srv/country-state-city";
type SelectProps = {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder: string;
  data: ICountry[] | IState[] | ICity[];
  handleChange: (v: string) => void;
};
const CustomSelect = ({ form, name, label, data, handleChange }: SelectProps) => {
  return (
    <div className="flex-1">
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {label}
            </label>
            <FormControl>
              <Select onValueChange={handleChange} value={field.value}>
                <SelectTrigger className="min-w-full">
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  {data.map((d) => (
                    <SelectItem
                      key={d.name}
                      // @ts-ignore
                      value={name === "city" ? d.name : d.isoCode}
                    >
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <div className="min-h-[20px]">
              <FormMessage className="text-red-500" />
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

export default CustomSelect;
