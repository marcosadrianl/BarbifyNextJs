"use client";

import { useServicesStore } from "@/lib/store/services.store";
import { Receipt, TrendingUp } from "lucide-react";

export function AverageTicketCard() {
  const services = useServicesStore((s) => s.services);

  if (!services.length) {
    return (
      <div className="rounded-xl border bg-background p-4 w-1/4">
        <p className="text-sm text-gray-400 animate-pulse">
          Cargando ticket promedio…
        </p>
      </div>
    );
  }

  let totalRevenue = 0;
  let totalServices = services.length;

  services.forEach((s) => {
    totalRevenue += s.servicePrice / 100;
  });

  const averageTicket = totalRevenue / totalServices;

  // --- Combo Corte + Peinado ---
  const groupedByClientDay: Record<
    string,
    { total: number; services: string[] }
  > = {};

  services.forEach((s) => {
    const day = new Date(s.serviceDate).toISOString().split("T")[0];

    const key = `${s._id.toString()}-${day}`;

    if (!groupedByClientDay[key]) {
      groupedByClientDay[key] = { total: 0, services: [] };
    }

    groupedByClientDay[key].total += s.servicePrice / 100;
    groupedByClientDay[key].services.push(s.serviceName.toLowerCase());
  });

  const comboTickets = Object.values(groupedByClientDay).filter(
    (g) => g.services.includes("corte") && g.services.includes("peinado"),
  );

  const comboAverage =
    comboTickets.reduce((acc, g) => acc + g.total, 0) /
    (comboTickets.length || 1);

  const formatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  return (
    <div className="rounded-xl border bg-white p-4 flex flex-col gap-4 w-1/4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Receipt className="h-4 w-4 text-gray-400" />
        <h3 className="text-sm font-medium">Ticket promedio</h3>
      </div>

      {/* Main metric */}
      <p className="text-2xl font-bold">{formatter.format(averageTicket)}</p>

      {/* Insight */}
      <div className="flex items-start gap-2 text-sm text-gray-400 h-full">
        {comboAverage ? (
          <p className="border-t w-full mt-auto">
            <TrendingUp className="h-4 w-4 mt-0.5" />
            Los clientes que hacen{" "}
            <span className="font-medium text-foreground/80">
              Corte + Peinado
            </span>{" "}
            gastan{" "}
            <span className="font-medium text-foreground/80">
              {formatter.format(comboAverage)}
            </span>
          </p>
        ) : (
          <p className="border-t w-full mt-auto">
            Ningún cliente ha realizado un combo de{" "}
            <span className="font-medium text-foreground/80">
              Corte + Peinado
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
