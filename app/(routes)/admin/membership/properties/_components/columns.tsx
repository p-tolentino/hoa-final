"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type PropertyColumn = {
  id: string;
  address: string;
  lotNumber: string;
  lotSize: string;
  userId: string;
  purchaseDate: string;
};

export const columns: ColumnDef<PropertyColumn>[] = [
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "lotNumber",
    header: "Lot No.",
  },
  {
    accessorKey: "lotSize",
    header: "Lot Size (sq. m.)",
  },
  {
    accessorKey: "occupantName",
    header: "Occupant",
  },
  {
    accessorKey: "purchaseDate",
    header: "Purchase Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
