"use client";

import { use, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ArrowUpDown } from "lucide-react";
import { useServicesStore } from "@/lib/store/services.store";
import Link from "next/link";
import { useEffect } from "react";

const PERIODS = {
  day: "Día",
  week: "Semana",
  fortnight: "Quincena",
  month: "Mes",
} as const;

type SortField = "date" | "client" | "service" | "price" | "barber";

type SortOrder = "asc" | "desc";

function TableSkeleton() {
  return (
    <TableRow>
      <TableCell>No hay servicios realizados</TableCell>
      <TableCell> </TableCell>
      <TableCell> </TableCell>
      <TableCell> </TableCell>
    </TableRow>
  );
}

export default function ServicesDashboard() {
  const { services, refreshFromAPI, loading } = useServicesStore();

  useEffect(() => {
    refreshFromAPI(); // al montar

    window.addEventListener("focus", refreshFromAPI);
    return () => window.removeEventListener("focus", refreshFromAPI);
  }, [refreshFromAPI]);

  const [period, setPeriod] = useState<keyof typeof PERIODS>("day");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const filteredAndSorted = useMemo(() => {
    const now = new Date();

    const start = new Date(now);
    if (period === "day") start.setDate(now.getDate() - 1);
    if (period === "week") start.setDate(now.getDate() - 7);
    if (period === "fortnight") start.setDate(now.getDate() - 15);
    if (period === "month") start.setMonth(now.getMonth() - 1);

    return services
      .filter((s) => new Date(s.serviceDate) >= start)
      .sort((a, b) => {
        let aVal: any;
        let bVal: any;

        switch (sortField) {
          case "date":
            aVal = new Date(a.serviceDate).getTime();
            bVal = new Date(b.serviceDate).getTime();
            break;
          case "client":
            aVal = a.clientName;
            bVal = b.clientName;
            break;
          case "service":
            aVal = a.serviceName;
            bVal = b.serviceName;
            break;
          case "price":
            aVal = a.servicePrice;
            bVal = b.servicePrice;
            break;
          case "barber":
            aVal = a.fromBarberId;
            bVal = b.fromBarberId;
            break;
        }

        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [services, period, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-6 w-full text-black/70 p-4 bg-white rounded-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Servicios realizados</h2>

        <Select value={period} onValueChange={(v) => setPeriod(v as any)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Periodo" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PERIODS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-2xl border bg-background shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                onClick={() => toggleSort("date")}
                className="cursor-pointer rounded-tl-2xl"
              >
                Fecha <ArrowUpDown className="inline h-3 w-3 ml-1" />
              </TableHead>
              <TableHead
                onClick={() => toggleSort("client")}
                className="cursor-pointer"
              >
                Cliente <ArrowUpDown className="inline h-3 w-3 ml-1" />
              </TableHead>
              <TableHead
                onClick={() => toggleSort("service")}
                className="cursor-pointer"
              >
                Servicio <ArrowUpDown className="inline h-3 w-3 ml-1" />
              </TableHead>
              <TableHead
                onClick={() => toggleSort("price")}
                className="cursor-pointer text-right rounded-tr-2xl"
              >
                Precio <ArrowUpDown className="inline h-3 w-3 ml-1" />
              </TableHead>
              {/* <TableHead
                onClick={() => toggleSort("barber")}
                className="cursor-pointer"
              >
                Atendido por <ArrowUpDown className="inline h-3 w-3 ml-1" />
              </TableHead> */}
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredAndSorted.length > 0 ? (
              filteredAndSorted.map((s) => (
                <TableRow key={s._id.toString() + s.serviceDate.toString()}>
                  <TableCell>
                    {new Date(s.serviceDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/clients/${s._id.toString()}`}
                      className="hover:underline"
                    >
                      {s.clientName.toLocaleUpperCase().toWellFormed()}{" "}
                      {s.clientLastName.toLocaleUpperCase().toWellFormed()}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {s.serviceName.toLocaleUpperCase().toWellFormed()}
                  </TableCell>
                  <TableCell className="text-right font-medium px-4">
                    ${(s.servicePrice / 100).toLocaleString("es-AR")}
                  </TableCell>
                  {/* <TableCell>{s.fromBarberId}</TableCell> */}
                </TableRow>
              ))
            ) : (
              <TableSkeleton />
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
