"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { TablePagination } from "./TablePagination";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export function TableList({
  columns,
  data = [],
  totalRecord = 0,
  page,
  loading = false,
  setPage,
  length,
  onSortChange,
}) {
  const [sorting, setSorting] = useState([]);

  // When the caller sorts on the server, `data` is already the correct page in
  // the correct order — re-sorting it here would only shuffle that one page.
  const manualSorting = !!onSortChange;

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    manualSorting,
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;

      setSorting(newSorting);

      if (newSorting.length > 0) {
        onSortChange?.({
          sort_by: newSorting[0].id,
          sort_order: newSorting[0].desc ? "desc" : "asc",
        });
      } else {
        // Sorting was toggled off; fall back to a stable default so the server
        // isn't left applying the previous sort.
        onSortChange?.({ sort_by: "id", sort_order: "asc" });
      }
    },
    getCoreRowModel: getCoreRowModel(),
    ...(manualSorting ? {} : { getSortedRowModel: getSortedRowModel() }),
  });

  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const sortDir = header.column.getIsSorted();

                return (
                  <TableHead
                    key={header.id}
                    onClick={
                      canSort
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                    className={canSort ? "cursor-pointer select-none" : ""}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {sortDir === "asc" && <ArrowUp size={14} />}
                      {sortDir === "desc" && <ArrowDown size={14} />}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody className='!max-h-96 overflow-y-auto'>
          {loading ? (
            [...Array(length || 10)].map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={columns.length}>
                  <Skeleton className="h-5 w-full rounded-md" />
                </TableCell>
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No result found
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalRecord > length && (
        <TablePagination
          totalRecord={totalRecord}
          page={page}
          setPage={setPage}
          length={length}
        />
      )}
    </>
  );
}
