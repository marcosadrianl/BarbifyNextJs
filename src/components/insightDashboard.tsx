"use client";

import { useMemo, useState } from "react";
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
import useTheme from "@/hooks/useTheme";

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
      <TableCell className="rounded-none">No hay servicios realizados</TableCell>
      <TableCell className="rounded-none"> </TableCell>
      <TableCell className="rounded-none"> </TableCell>
      <TableCell className="rounded-none"> </TableCell>
    </TableRow>
  );
}

export default function ServicesDashboard() {
  const { services, refreshFromAPI } = useServicesStore();
  const { theme } = useTheme();

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

  const themeStyles = {
    "--theme-bg": theme.bg,
    "--theme-bgCard": theme.bgCard,
    "--theme-text-primary": theme.textPrimary,
    "--theme-text-secondary": theme.textSecondary,
    "--theme-border": theme.border,
    "--theme-primary": theme.primary,
    "--theme-accent-bg": theme.accentBg,
  } as React.CSSProperties;

  return (
    <div
      className="space-y-6 w-full p-4 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bgCard)] text-[var(--theme-text-primary)]"
      style={themeStyles}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[var(--theme-text-primary)]">
          Servicios realizados
        </h2>

        <Select value={period} onValueChange={(v) => setPeriod(v as any)}>
          <SelectTrigger className="w-40 cursor-pointer border-[var(--theme-border)] bg-[var(--theme-bgCard)] text-[var(--theme-text-primary)]">
            <SelectValue placeholder="Periodo" />
          </SelectTrigger>
          <SelectContent
            className="border-[var(--theme-border)] bg-[var(--theme-bgCard)] text-[var(--theme-text-primary)]"
            style={{ backgroundColor: theme.bgCard, color: theme.textPrimary }}
          >
            {Object.entries(PERIODS).map(([key, label]) => (
              <SelectItem
                key={key}
                value={key}
                className="cursor-pointer "
              >
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-2xl border border-[var(--theme-border)] shadow-sm overflow-hidden bg-[var(--theme-bgCard)]">
        <Table>
          <TableHeader>
            <TableRow className="bg-[var(--theme-accent-bg)]/60">
              <TableHead
                onClick={() => toggleSort("date")}
                className=" text-[var(--theme-text-primary)]"
              >
                Fecha <ArrowUpDown className="hover:cursor-pointer inline h-3 w-3 ml-1" />
              </TableHead>
              <TableHead
                onClick={() => toggleSort("client")}
                className="text-[var(--theme-text-primary)]"
              >
                Cliente <ArrowUpDown className="hover:cursor-pointer inline h-3 w-3 ml-1" />
              </TableHead>
              <TableHead
                onClick={() => toggleSort("service")}
                className="text-[var(--theme-text-primary)]"
              >
                Servicio <ArrowUpDown className="hover:cursor-pointer inline h-3 w-3 ml-1" />
              </TableHead>
              <TableHead
                onClick={() => toggleSort("price")}
                className="text-right rounded-tr-2xl text-[var(--theme-text-primary)]"
              >
                Precio <ArrowUpDown className="hover:cursor-pointer inline h-3 w-3 ml-1" />
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredAndSorted.length > 0 ? (
              filteredAndSorted.map((s) => (
                <TableRow key={s._id.toString() + s.serviceDate.toString()} className="hover:bg-[var(--theme-accent-bg)]/70">
                  <TableCell className="text-[var(--theme-text-prymary)] rounded-none">
                    {new Date(s.serviceDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-[var(--theme-text-prymary)] rounded-none">
                    <Link
                      href={`/clients/${s._id.toString()}`}
                      className="hover:underline text-[var(--theme-text-primary)] hover:text-[var(--theme-primary)]"
                    >
                      {s.clientName.toLocaleUpperCase().toWellFormed()} {" "}
                      {s.clientLastName.toLocaleUpperCase().toWellFormed()}
                    </Link>
                  </TableCell>
                  <TableCell className="text-[var(--theme-text-prymary)] rounded-none">
                    {s.serviceName.toLocaleUpperCase().toWellFormed()}
                  </TableCell>
                  <TableCell className="text-right font-medium px-4 text-[var(--theme-text-primary)] rounded-none">
                    ${(s.servicePrice / 100).toLocaleString("es-AR")}
                  </TableCell>
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
