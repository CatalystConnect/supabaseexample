"use client";

import { SquarePen, Trash2 } from "lucide-react";

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
    accessorKey: "action",
    header: "Created At",
    cell: ({ row }) => {
      return (
        <>
          <div className="flex gap-2 items-center">
            <SquarePen
              onClick={() => handleEditCountry(row?.original)}
              className="text-green-500 cursor-pointer"
            />
            <Trash2
              onClick={() => handleDeleteCountry(row?.original)}
              className="text-red-500 cursor-pointer"
            />
          </div>
        </>
      );
    },
  },
];
