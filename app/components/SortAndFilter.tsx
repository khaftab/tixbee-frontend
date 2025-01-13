import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import {
  BookOpenIcon,
  CalendarIcon,
  ChevronDownIcon,
  FilterIcon,
  GavelIcon,
  List,
  ListOrderedIcon,
  LoaderIcon,
  MoveHorizontalIcon,
  Music2Icon,
  PencilIcon,
  VenetianMaskIcon,
} from "lucide-react";
import { useState } from "react";
import { useRevalidator, useSearchParams, useSubmit } from "@remix-run/react";

type SortAndFilterProps = {
  filterList: Record<string, string>;
  context: "order" | "ticket";
  className?: string;
};

const CategoryList = [
  { value: "conference", icon: CalendarIcon, label: "Conference" },
  { value: "lecture", icon: BookOpenIcon, label: "Lecture" },
  { value: "workshop", icon: PencilIcon, label: "Workshop" },
  { value: "auction", icon: GavelIcon, label: "Auction" },
  { value: "concert", icon: Music2Icon, label: "Concert" },
  { value: "theater", icon: VenetianMaskIcon, label: "Theater" },
  { value: "other", icon: MoveHorizontalIcon, label: "Others" },
  { value: "all", icon: List, label: "All" },
];
const SortAndFilter = ({ filterList, context, className }: SortAndFilterProps) => {
  const [searchParams] = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const [sortBy, setSortBy] = useState(newSearchParams.get("sortBy") || "date");
  const [sortOrder, setSortOrder] = useState(newSearchParams.get("sortOrder") || "desc");
  const [filterBy, setFilterBy] = useState(newSearchParams.get("filterBy") || "all");
  const [category, setCategory] = useState(newSearchParams.get("category") || "conference");
  const submit = useSubmit();
  const revalidator = useRevalidator();

  const handleRefresh = () => {
    revalidator.revalidate();
  };

  const handleSortChange = (
    newSortBy: string,
    newSortOrder: string,
    newFilterBy: string,
    newCategory: string
  ) => {
    const newSearchParams = new URLSearchParams(searchParams);

    // Only update parameters that have changed from their current values
    if (newSortBy !== sortBy) {
      setSortBy(newSortBy);
      newSearchParams.set("sortBy", newSortBy);
    }

    if (newSortOrder !== sortOrder) {
      setSortOrder(newSortOrder);
      newSearchParams.set("sortOrder", newSortOrder);
    }

    if (newFilterBy !== filterBy) {
      setFilterBy(newFilterBy);
      newSearchParams.set("filterBy", newFilterBy);
    }

    if (context === "ticket" && newCategory !== category) {
      setCategory(newCategory);
      newSearchParams.set("category", newCategory);
    }

    // Always reset to page 1 when changing filters
    newSearchParams.set("page", "1");

    // Only submit if at least one parameter changed
    if (
      newSortBy !== sortBy ||
      newSortOrder !== sortOrder ||
      newFilterBy !== filterBy ||
      (context === "ticket" && newCategory !== category)
    ) {
      submit(newSearchParams, { method: "get" });
    }
  };

  const selectedOption = CategoryList.find((option) => option.value === category);
  // border-gray-300 dark:border-muted-foreground
  return (
    <div className={`${className}`}>
      {context === "ticket" && (
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background h-10 px-4 py-2 w-[160px] flex items-center justify-between border-border hover:bg-accent text-foreground hover:text-foreground transition-colors duration-200">
              <div className="flex items-center gap-2">
                {selectedOption && <selectedOption.icon className="h-4 w-4" />}
                <span className="">{selectedOption?.label}</span>
              </div>
              <ChevronDownIcon className="h-4 w-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[160px] shadow-lg border border-border rounded-md overflow-hidden bg-background">
            <DropdownMenuRadioGroup
              defaultValue={category}
              onValueChange={(value) => handleSortChange(sortBy, sortOrder, filterBy, value)}
            >
              {CategoryList.map(({ value, icon: Icon, label }) => (
                <DropdownMenuRadioItem
                  key={value}
                  value={value}
                  className={
                    "px-3 py-2 focus:bg-accent/50 cursor-pointer transition-colors duration-20 text-muted-foreground " +
                    (category === value ? "bg-accent/50 text-accent-foreground" : "")
                  }
                >
                  <div className="flex items-center gap-3 w-full">
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{label}</span>
                  </div>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <div className="justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background h-10 px-4 py-2 flex items-center gap-2 border-border hover:bg-accent text-foreground hover:text-foreground transition-colors duration-200">
            <FilterIcon className="w-4 h-4" />
            Filter by
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-48 bg-background shadow-lg border border-border rounded-md overflow-hidden"
        >
          <DropdownMenuRadioGroup
            value={filterBy}
            onValueChange={(value) => handleSortChange(sortBy, sortOrder, value, category)}
          >
            {Object.entries(filterList).map(([key, value]) => (
              <DropdownMenuRadioItem
                key={key}
                value={key}
                className={
                  "focus:bg-accent/50 text-muted-foreground " +
                  (filterBy == key ? "bg-accent/50 text-foreground" : "hover:bg-accentt/50")
                }
              >
                {value}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <div className="justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background h-10 px-4 py-2 flex items-center gap-2 border-border hover:bg-accent text-foreground hover:text-foreground transition-colors duration-200">
            <ListOrderedIcon className="w-4 h-4" />
            Sort by
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-48 bg-background shadow-lg border border-border rounded-md overflow-hidden"
        >
          <DropdownMenuRadioGroup
            value={sortBy}
            onValueChange={(value) => handleSortChange(value, sortOrder, filterBy, category)}
          >
            <DropdownMenuRadioItem
              value="price"
              className={
                sortBy === "price"
                  ? "bg-accent/50 text-foreground focus:bg-accent/50"
                  : "focus:bg-accent/50"
              }
            >
              Price
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              value="date"
              className={
                sortBy === "date"
                  ? "bg-accent/50 text-foreground focus:bg-accent/50"
                  : "focus:bg-accent/50"
              }
            >
              Date
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={sortOrder}
            onValueChange={(value) => handleSortChange(sortBy, value, filterBy, category)}
            className="focus:bg-accent/50 text-muted-foreground"
          >
            <DropdownMenuRadioItem
              value="asc"
              className={
                sortOrder === "asc"
                  ? "bg-accent/50 text-foreground focus:bg-accent/50"
                  : "focus:bg-accent/50"
              }
            >
              Ascending
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              value="desc"
              className={
                sortOrder === "desc"
                  ? "bg-accent/50 text-foreground focus:bg-accent/50"
                  : "focus:bg-accent/50"
              }
            >
              Descending
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {context === "order" && (
        <Button
          variant="outline"
          className="flex items-center gap-2 hover:bg-accent text-foreground bg-background transition-colors duration-200 border-border"
          onClick={handleRefresh}
          disabled={revalidator.state === "loading"}
        >
          <LoaderIcon className="w-4 h-4" />
          {"Refresh"}
        </Button>
      )}
    </div>
  );
};

export default SortAndFilter;
