"use client";

import { useEffect, useState } from "react";

export function FinancialSummaryCard() {
  const [currentTotal, setCurrentTotal] = useState(0);
  const [previousTotal, setPreviousTotal] = useState(0);
  const [variation, setVariation] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("services");
      if (!raw) {
        setLoading(false);
        return;
      }

      const services = JSON.parse(raw);

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const prevDate = new Date(currentYear, currentMonth - 1, 1);
      const prevMonth = prevDate.getMonth();
      const prevYear = prevDate.getFullYear();

      let current = 0;
      let previous = 0;

      services.forEach((service: any) => {
        // ✅ CORRECCIÓN: Acceso correcto a la fecha y precio
        const serviceDate =
          service.serviceDate || service.clientServices?.serviceDate;
        const servicePrice =
          service.servicePrice || service.clientServices?.servicePrice;

        if (!serviceDate || servicePrice === undefined) {
          console.warn("Servicio con datos faltantes:", service);
          return;
        }

        const date = new Date(serviceDate);
        const price = servicePrice / 100;

        // Mes actual
        if (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        ) {
          current += price;
        }

        // Mes anterior
        if (date.getMonth() === prevMonth && date.getFullYear() === prevYear) {
          previous += price;
        }
      });

      // ✅ CORRECCIÓN: Calcular variación correctamente
      let diff = 0;
      if (previous > 0) {
        diff = ((current - previous) / previous) * 100;
      } else if (current > 0 && previous === 0) {
        // Si el mes anterior fue 0 pero este mes hay ingresos
        diff = 100;
      }

      setCurrentTotal(current);
      setPreviousTotal(previous);
      setVariation(diff);
    } catch (err) {
      console.error("Error leyendo services del localStorage", err);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="rounded-md border bg-accent p-4 flex items-center justify-center min-h-35">
        <p className="text-sm text-muted-foreground">Cargando ingresos...</p>
      </div>
    );
  }

  const formatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const trend = variation > 0.1 ? "up" : variation < -0.1 ? "down" : "equal";

  return (
    <div className="rounded-md  text-black border bg-accent p-4 flex flex-col gap-3 w-1/3">
      {/* Header con variación */}
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-medium">Ingresos del mes</h2>

        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
            trend === "up"
              ? "bg-green-100 text-green-700"
              : trend === "down"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {trend === "up" && (
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
          {trend === "down" && (
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
          {trend === "down" && "-"}
          {Math.abs(variation).toFixed(1)}%
        </div>
      </div>

      {/* Total del mes actual */}
      <p className="text-3xl font-bold mb-2">
        {formatter.format(currentTotal)}
      </p>

      {/* Descripción */}
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">
          {trend === "up" && "📈 Mejor que el mes anterior"}
          {trend === "down" && "📉 Menor que el mes anterior"}
          {trend === "equal" && "➡️ Igual que el mes anterior"}
        </p>

        {previousTotal > 0 && (
          <p className="text-xs text-muted-foreground border-t pt-2 mt-2">
            Mes anterior: {formatter.format(previousTotal)}
          </p>
        )}
      </div>
    </div>
  );
}
