"use client";

import { ColumnDef } from "@tanstack/react-table";
import { BarbersData } from "@/models/Barbers";

export const columns: ColumnDef<BarbersData>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Monto",
  },
  {
    accessorKey: "status",
    header: "Estado",
  },
];
