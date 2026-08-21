import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
// TablePagination component handles page navigation for tables
export const TablePagination = ({ totalRecord, page, setPage, length }) => {
  // Calculate total number of pages
  const totalPages = Math.ceil(totalRecord / length) || 1;

  // Function to render page numbers including "dots" for large page counts
  const renderPages = () => {
    const pages = [];

    if (totalPages <= 10) {
      // If total pages <= 10, show all page numbers
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      // Show dots if current page is greater than 4
      if (page > 4) pages.push("dots");
      // Show a window of pages around the current page
      const start = Math.max(2, page - 2);
      const end = Math.min(totalPages - 1, page + 2);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      // Show dots before last page if not in the last few pages
      if (page < totalPages - 3) pages.push("dots");
      // Always show last page
      pages.push(totalPages);
    }
    // Render PaginationItem components
    return pages.map((item, index) =>
      item === "dots" ? (
        // Render dots for skipped pages
        <PaginationItem key={`dots-${index}`}>
          <span className="px-2 text-muted-foreground">...</span>
        </PaginationItem>
      ) : (
        // Render page number buttons
        <PaginationItem key={item}>
          <PaginationLink
            className={`!rounded-full ${
              item === page
                ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                : "bg-muted text-foreground hover:bg-accent"
            }`}
            isActive={item === page}
            onClick={() => setPage(item)} // Set the page when clicked
          >
            {item}
          </PaginationLink>
        </PaginationItem>
      )
    );
  };

  return (
    <Pagination className="flex justify-end mt-5">
      <PaginationContent className="cursor-pointer gap-2">
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            onClick={page > 1 ? () => setPage(page - 1) : undefined}
            aria-disabled={page === 1}
            className={`!rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground ${
              page === 1 ? "pointer-events-none opacity-50" : ""
            }`}
          />
        </PaginationItem>

        {/* Page Numbers */}
        {renderPages()}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            onClick={page < totalPages ? () => setPage(page + 1) : undefined}
            aria-disabled={page === totalPages}
            className={`!rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground ${
              page === totalPages ? "pointer-events-none opacity-50" : ""
            }`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
