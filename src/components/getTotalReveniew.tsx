"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Equal } from "lucide-react";
import { useServicesStore } from "@/lib/store/services.store";

type TrendDirection = "up" | "down" | "equal";

const TTL_MINUTES = 30;

export function TotalRevenue() {
  const services = useServicesStore((s) => s.services); // ✅ ARRIBA

  const [totalRevenue, setTotalRevenue] = useState("0");
  const [trendValue, setTrendValue] = useState("0%");
  const [trendDirection, setTrendDirection] = useState<TrendDirection>("equal");
  const [loading, setLoading] = useState(true);
  const [periodDescription, setPeriodDescription] = useState("");

  useEffect(() => {
    try {
      if (!services || services.length === 0) return;

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const sixMonthsAgo = new Date(currentYear, currentMonth - 6, 1);
      const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
      const prevMonth = prevMonthDate.getMonth();
      const prevYear = prevMonthDate.getFullYear();

      let currentMonthTotal = 0;
      let previousMonthTotal = 0;
      let last6MonthsTotal = 0;

      services.forEach((service) => {
        const serviceDate = service.serviceDate;
        if (!serviceDate) return;

        const date = new Date(serviceDate);
        const price = (service.servicePrice ?? 0) / 100;

        if (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        ) {
          currentMonthTotal += price;
        }

        if (date.getMonth() === prevMonth && date.getFullYear() === prevYear) {
          previousMonthTotal += price;
        }

        if (date >= sixMonthsAgo && date <= now) {
          last6MonthsTotal += price;
        }
      });

      let variation = 0;
      if (previousMonthTotal > 0) {
        variation =
          ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;
      } else if (currentMonthTotal > 0) {
        variation = 100;
      }

      let direction: TrendDirection = "equal";
      if (variation > 0.1) direction = "up";
      else if (variation < -0.1) direction = "down";

      const formatter = new Intl.NumberFormat("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      setTotalRevenue(formatter.format(last6MonthsTotal));
      setTrendValue(`${Math.abs(variation).toFixed(1)}%`);
      setTrendDirection(direction);
    } catch (err) {
      console.error("Error calculando TotalRevenue", err);
    } finally {
      setLoading(false);
    }
  }, [services]); // ✅ dependencia correcta

  if (loading) {
    return (
      <div className="rounded-md border text-black bg-white p-4 w-1/3 flex items-center justify-center">
        <p className="text-sm text-gray-400">Cargando ingresos...</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border text-black bg-white p-4 w-1/3 flex flex-col gap-4">
      {/* Header */}
      <span className="flex flex-row justify-between items-center">
        <h2 className="text-sm tracking-tight font-medium">Ingresos Totales</h2>

        {/* Trend Badge */}
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
            trendDirection === "up"
              ? "bg-green-100 text-green-700"
              : trendDirection === "down"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {trendDirection === "up" && <TrendingUp className="w-4" />}
          {trendDirection === "down" && <TrendingDown className="w-4" />}
          {trendDirection === "equal" && <Equal className="w-4" />}
          {trendValue}
        </div>
      </span>

      {/* Total */}
      <p className="text-3xl font-bold">${totalRevenue}</p>

      {/* Trend Description */}
      <p className="text-sm text-gray-400">
        {trendDirection === "up" && "📈 Crecimiento respecto al mes anterior"}
        {trendDirection === "down" && "📉 Disminución respecto al mes anterior"}
        {trendDirection === "equal" &&
          "➡️ Sin cambios respecto al mes anterior"}
      </p>

      {/* Period */}
      <p className="text-xs text-gray-400 border-t pt-2">
        Ingresos de los últimos 6 meses
        {periodDescription && ` (${periodDescription})`}
      </p>
    </div>
  );
}
