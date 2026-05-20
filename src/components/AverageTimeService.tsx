"use client";

import { useServicesStore } from "@/lib/store/services.store";
import { Timer, Info } from "lucide-react";
import useTheme from "@/hooks/useTheme";

type AvgService = {
  name: string;
  avgDuration: number;
  count: number;
};

export function AverageDurationCard() {
  const services = useServicesStore((s) => s.services);
  const theme = useTheme();

  if (!services.length) {
    return (
      <div
        className="rounded-xl border bg-background p-4 w-1/4"
        style={{
          backgroundColor: theme.theme.bgCard,
          borderColor: theme.theme.border,
        }}
      >
        <p className="text-sm text-gray-400 animate-pulse">
          Calculando duraciones…
        </p>
      </div>
    );
  }

  /**
   * Agrupa los servicios por nombre y calcula la duración promedio de cada uno
   */

  const grouped: Record<string, { totalDuration: number; count: number }> = {};

  services.forEach((s) => {
    const name = s.serviceName.trim().toLocaleLowerCase();

    if (!grouped[name]) {
      grouped[name] = { totalDuration: 0, count: 0 };
    }

    grouped[name].totalDuration += s.serviceDuration;
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
    <div
      className="rounded-xl border p-4 flex flex-col gap-4 w-1/4"
      style={{
        backgroundColor: theme.theme.bgCard,
        borderColor: theme.theme.border,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <h3
          className="text-sm font-medium"
          style={{ color: theme.theme.textPrimary }}
        >
          Duración promedio por servicio
        </h3>
      </div>

      {/* Services */}
      <ul className="space-y-2" style={{ color: theme.theme.textSecondary }}>
        {averages.map((s, i) => (
          <li key={s.name} className="flex justify-between text-sm">
            <span className="font-medium capitalize">
              {i + 1}. {s.name}
            </span>
            <span>{Math.round(s.avgDuration)} min</span>
          </li>
        ))}
      </ul>

      {/* Insight */}
      <div
        className="flex items-start gap-2 text-sm border-t pt-2 mt-auto"
        style={{ color: theme.theme.textSecondary }}
      >
        <Info className="h-6 w-6" />
        <p className="text-xs h-full">
          Los servicios más rápidos son ideales para ofrecer como{" "}
          <span
            className="font-medium"
            style={{ color: theme.theme.textMuted }}
          >
            extra
          </span>
        </p>
      </div>
    </div>
  );
}
