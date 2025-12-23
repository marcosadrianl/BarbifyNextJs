"use client";

import { DataTable } from "@/components/ui/dataTable";

import { IBarbers } from "@/models/Barbers";
import * as React from "react";
import { BarbersData } from "@/models/Barbers";
import { DefaultSession } from "next-auth";

interface sessionUser extends DefaultSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    active?: boolean;
  };
}

export function BarberTable({ data }: { data: BarbersData[] }) {
  if (!data.length)
    return (
      <DataTable
        data={[
          {
            id: "1",
            name: "Cargando...",
            email: "Cargando...",
            amount: 0,
            status: "inactivo",
          },
        ]}
      />
    );

  return <DataTable data={data} />;
}
