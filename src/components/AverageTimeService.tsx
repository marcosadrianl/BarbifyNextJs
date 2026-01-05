"use client";

import { useServicesStore } from "@/lib/store/services.store";
import { Timer, Info } from "lucide-react";

type AvgService = {
  name: string;
  avgDuration: number;
  count: number;
};

export function AverageDurationCard() {
  const services = useServicesStore((s) => s.services);

  if (!services.length) {
    return (
      <div className="rounded-xl border bg-background p-4">
        <p className="text-sm text-muted-foreground">Calculando duraciones…</p>
      </div>
    );
  }

  const grouped: Record<string, { totalDuration: number; count: number }> = {};

  services.forEach((s) => {
    const name = s.clientServices.serviceName.trim();

    if (!grouped[name]) {
      grouped[name] = { totalDuration: 0, count: 0 };
    }

    grouped[name].totalDuration += s.clientServices.serviceDuration;
    grouped[name].count += 1;
  });

  const averages: AvgService[] = Object.entries(grouped)
    .map(([name, data]) => ({
      name,
      avgDuration: data.totalDuration / data.count,
      count: data.count,
    }))
    .sort((a, b) => a.avgDuration - b.avgDuration)
    .slice(0, 5);

  return (
    <div className="rounded-xl border bg-accent p-4 flex flex-col gap-4 w-1/4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Timer className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Duración promedio por servicio</h3>
      </div>

      {/* Services */}
      <ul className="space-y-2">
        {averages.map((s, i) => (
          <li key={s.name} className="flex justify-between text-sm">
            <span className="font-medium">
              {i + 1}. {s.name}
            </span>
            <span className="text-muted-foreground">
              {Math.round(s.avgDuration)} min
            </span>
          </li>
        ))}
      </ul>

      {/* Insight */}
      <div className="flex items-start gap-2 text-sm text-muted-foreground border-t pt-2 mt-auto">
        <Info className="h-6 w-6 text-muted-foreground" />
        <p>
          Los servicios más rápidos son ideales para ofrecer como{" "}
          <span className="font-medium text-foreground">extra</span>
        </p>
      </div>
    </div>
  );
}
