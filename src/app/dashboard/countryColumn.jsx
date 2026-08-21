"use client";

import { SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const countryColumn = (handleEditCountry, handleDeleteCountry) => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => row.original.id ?? "-",
  },
  {
    accessorKey: "name",
    header: "Country Name",
    cell: ({ row }) => row.original.name ?? "-",
  },
  {
    accessorKey: "cuntry_code",
    header: "Country Code",
    cell: ({ row }) => row.original.cuntry_code ?? "-",
  },
  {
    accessorKey: "country_region",
    header: "Region",
    cell: ({ row }) => row.original.country_region ?? "-",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) =>
      row.original.created_at
        ? new Date(row.original.created_at).toLocaleString()
        : "-",
  },
  {
    id: "action",
    header: () => <div className="text-right">Actions</div>,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex justify-end gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Edit ${row.original.name ?? "country"}`}
          onClick={() => handleEditCountry(row?.original)}
          className="cursor-pointer text-emerald-600 hover:text-emerald-600"
        >
          <SquarePen />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Delete ${row.original.name ?? "country"}`}
          onClick={() => handleDeleteCountry(row?.original)}
          className="cursor-pointer text-destructive hover:text-destructive"
        >
          <Trash2 />
        </Button>
      </div>
    ),
  },
];
