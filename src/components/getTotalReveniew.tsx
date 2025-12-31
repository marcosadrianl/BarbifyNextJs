"use client";

import * as React from "react";
import { useEffect, useState } from "react";

type TrendDirection = "up" | "down" | "equal";

const TTL_MINUTES = 30;

export function TotalRevenue() {
  const [totalRevenue, setTotalRevenue] = useState("0");
  const [trendValue, setTrendValue] = useState("0%");
  const [trendDirection, setTrendDirection] = useState<TrendDirection>("equal");
  const [loading, setLoading] = useState(true);
  const [periodDescription, setPeriodDescription] = useState("");

  useEffect(() => {
    try {
      const cached = localStorage.getItem("services");
      const lastSaved = localStorage.getItem("services_last_saved");

      if (!cached) {
        setLoading(false);
        return;
      }

      if (lastSaved) {
        const diff = Date.now() - Number(lastSaved);
        const isExpired = diff > TTL_MINUTES * 60 * 1000;

        if (isExpired) {
          console.warn("⚠️ Cache expirado (usando último valor)");
        }
      }

      const services = JSON.parse(cached) as any[];

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // Fecha de hace 6 meses
      const sixMonthsAgo = new Date(currentYear, currentMonth - 6, 1);

      // Mes anterior
      const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
      const prevMonth = prevMonthDate.getMonth();
      const prevYear = prevMonthDate.getFullYear();

      let currentMonthTotal = 0;
      let previousMonthTotal = 0;
      let last6MonthsTotal = 0;

      services.forEach((service) => {
        // ✅ CORRECCIÓN 1: Acceso correcto a la fecha
        // Antes: service.clientServices.serviceDate (incorrecto)
        // Ahora: service.serviceDate (correcto)
        const serviceDate =
          service.serviceDate || service.clientServices?.serviceDate;

        if (!serviceDate) {
          console.warn("Servicio sin fecha:", service);
          return;
        }

        const date = new Date(serviceDate);

        // ✅ CORRECCIÓN 2: Acceso correcto al precio
        const price =
          (service.servicePrice || service.clientServices?.servicePrice || 0) /
          100;

        // ✅ CORRECCIÓN 3: Calcular totales correctamente

        // Total del mes actual
        if (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        ) {
          currentMonthTotal += price;
        }

        // Total del mes anterior
        if (date.getMonth() === prevMonth && date.getFullYear() === prevYear) {
          previousMonthTotal += price;
        }

        // ✅ CORRECCIÓN 4: Total de últimos 6 meses (incluye mes actual)
        if (date >= sixMonthsAgo && date <= now) {
          last6MonthsTotal += price;
        }
      });

      // ✅ CORRECCIÓN 5: Calcular variación correctamente
      let variation = 0;
      if (previousMonthTotal > 0) {
        variation =
          ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;
      } else if (currentMonthTotal > 0 && previousMonthTotal === 0) {
        // Si el mes anterior fue 0 y este mes hay ingresos, es 100% de aumento
        variation = 100;
      }

      let direction: TrendDirection = "equal";
      if (variation > 0.1) direction = "up"; // Margen de error mínimo
      else if (variation < -0.1) direction = "down";

      const formatter = new Intl.NumberFormat("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      // ✅ CORRECCIÓN 6: Mostrar el total de últimos 6 meses (no solo mes actual)
      setTotalRevenue(formatter.format(last6MonthsTotal));
      setTrendValue(`${Math.abs(variation).toFixed(1)}%`);
      setTrendDirection(direction);

      // Descripción del período
      const monthNames = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];

      const startMonth = monthNames[sixMonthsAgo.getMonth()];
      const endMonth = monthNames[currentMonth];
      setPeriodDescription(`${startMonth} - ${endMonth} ${currentYear}`);
    } catch (err) {
      console.error("Error calculando TotalRevenue", err);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="rounded-md border text-black bg-accent p-4 w-1/3 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Cargando ingresos...</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border text-black bg-accent p-4 w-1/3 flex flex-col gap-4">
      {/* Header */}
      <span className="flex flex-row justify-between items-center">
        <h2 className="text-sm tracking-tight font-medium">Total Revenue</h2>

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
          {trendDirection === "up" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-3"
            >
              <path d="M3 17l6 -6l4 4l8 -8" />
              <path d="M14 7l7 0l0 7" />
            </svg>
          )}
          {trendDirection === "down" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-3"
            >
              <path d="M3 7l6 6l4 -4l8 8" />
              <path d="M14 17l7 0l0 -7" />
            </svg>
          )}
          {trendDirection === "down" && "-"}
          {trendValue}
        </div>
      </span>

      {/* Total */}
      <p className="text-3xl font-bold">${totalRevenue}</p>

      {/* Trend Description */}
      <p className="text-sm text-muted-foreground">
        {trendDirection === "up" && "📈 Crecimiento respecto al mes anterior"}
        {trendDirection === "down" && "📉 Disminución respecto al mes anterior"}
        {trendDirection === "equal" &&
          "➡️ Sin cambios respecto al mes anterior"}
      </p>

      {/* Period */}
      <p className="text-xs text-muted-foreground border-t pt-2">
        Ingresos de los últimos 6 meses
        {periodDescription && ` (${periodDescription})`}
      </p>
    </div>
  );
}
