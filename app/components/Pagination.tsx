import { Form, useSearchParams } from "@remix-run/react";
import { Pagination, PaginationContent, PaginationItem } from "~/components/ui/pagination";
import { Button } from "./ui/button";
import { getPageRange } from "~/lib/getPaginationRange";

type PaginationProps = {
  totalCount: number;
  page: number;
};

const PaginationComponent = ({ totalCount, page }: PaginationProps) => {
  const limit = 6;
  const [searchParams] = useSearchParams();
  const totalPages = Math.ceil(totalCount / limit);
  const pageRange = getPageRange(page, totalPages);

  if (totalCount <= limit) {
    return null;
  }

  return (
    <Pagination className="flex justify-center mt-7">
      <PaginationContent>
        <PaginationItem>
          <Form method="get">
            {Array.from(searchParams).map(
              ([key, value]) =>
                key !== "page" && <input key={key} type="hidden" name={key} value={value} />
            )}
            <Button
              variant="outline"
              size="sm"
              name="page"
              value={Math.max(1, page - 1)}
              disabled={page === 1}
              type="submit"
            >
              Previous
            </Button>
          </Form>
        </PaginationItem>
        {pageRange.map((pageNum, index) => (
          <PaginationItem key={index}>
            {pageNum === "..." ? (
              <span className="px-2">...</span>
            ) : (
              <Form method="get">
                {Array.from(searchParams).map(
                  ([key, value]) =>
                    key !== "page" && <input key={key} type="hidden" name={key} value={value} />
                )}
                <Button
                  variant={page === pageNum ? "default" : "outline"}
                  // disabled={page === pageNum}
                  size="sm"
                  name="page"
                  value={pageNum}
                  type="submit"
                >
                  {pageNum}
                </Button>
              </Form>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <Form method="get">
            {Array.from(searchParams).map(
              ([key, value]) =>
                key !== "page" && <input key={key} type="hidden" name={key} value={value} />
            )}
            <Button
              variant="outline"
              size="sm"
              name="page"
              value={Math.min(totalPages, page + 1)}
              disabled={page === totalPages}
              type="submit"
            >
              Next
            </Button>
          </Form>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
export default PaginationComponent;
