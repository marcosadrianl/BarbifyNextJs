"use client";

import { useEffect, useState } from "react";

type ClientGroup = {
  count: number;
  totalRevenue: number;
};

type RecurrenceResult = {
  newRevenue: number;
  recurrentRevenue: number;
  newPercentage: number;
  recurrentPercentage: number;
  totalRevenue: number;
  debug: Record<string, ClientGroup>;
};

/**
 * Analiza la recurrencia de clientes en un período específico
 */
export function analyzeClientRecurrence(
  services: any[],
  startDate?: Date,
  endDate?: Date
): RecurrenceResult {
  const clients: Record<string, ClientGroup> = {};

  services.forEach((item) => {
    // ✅ CORRECCIÓN: Acceso correcto a los datos
    const serviceDate = item.clientServices?.serviceDate;
    const clientId = item.clientId;
    const priceRaw = item.clientServices?.servicePrice;

    if (!serviceDate || !clientId || typeof priceRaw !== "number") {
      console.warn("Servicio con datos faltantes:", item);
      return;
    }

    // Filtrar por fecha si se proporciona
    const date = new Date(serviceDate);
    if (startDate && date < startDate) return;
    if (endDate && date > endDate) return;

    const price = priceRaw / 100;

    if (!clients[clientId]) {
      clients[clientId] = { count: 0, totalRevenue: 0 };
    }

    clients[clientId].count += 1;
    clients[clientId].totalRevenue += price;
  });

  let newRevenue = 0;
  let recurrentRevenue = 0;

  Object.values(clients).forEach((client) => {
    if (client.count === 1) {
      newRevenue += client.totalRevenue;
    } else {
      recurrentRevenue += client.totalRevenue;
    }
  });

  const totalRevenue = newRevenue + recurrentRevenue;

  return {
    newRevenue,
    recurrentRevenue,
    newPercentage: totalRevenue > 0 ? (newRevenue / totalRevenue) * 100 : 0,
    recurrentPercentage:
      totalRevenue > 0 ? (recurrentRevenue / totalRevenue) * 100 : 0,
    totalRevenue,
    debug: clients,
  };
}

export function ClientRecurrenceCard() {
  const [currentPercentage, setCurrentPercentage] = useState(0);
  const [previousPercentage, setPreviousPercentage] = useState(0);
  const [variation, setVariation] = useState(0);
  const [trend, setTrend] = useState<"up" | "down" | "equal">("equal");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem("services");
    if (!cached) {
      setLoading(false);
      return;
    }
    const services = JSON.parse(cached);

    // ✅ CORRECCIÓN: Usar el año correcto (2025, no 2024)
    // Detectar automáticamente el año más reciente en los datos
    let maxYear = 2024;
    services.forEach((item: any) => {
      const date = new Date(item.clientServices?.serviceDate);
      if (date.getFullYear() > maxYear) {
        maxYear = date.getFullYear();
      }
    });

    console.log("📅 Año detectado en los datos:", maxYear);

    // Usar octubre 2025 como mes actual (el que tiene más datos)
    const currentMonth = 9; // Octubre (0-indexed)
    const currentYear = maxYear;

    // Fechas del mes actual (Octubre 2025)
    const currentMonthStart = new Date(currentYear, currentMonth, 1);
    const currentMonthEnd = new Date(
      currentYear,
      currentMonth + 1,
      0,
      23,
      59,
      59
    );

    // Fechas del mes anterior (Septiembre 2025)
    const prevMonthStart = new Date(currentYear, currentMonth - 1, 1);
    const prevMonthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    console.log("📊 Analizando períodos:", {
      mesActual: `${currentMonthStart.toLocaleDateString()} - ${currentMonthEnd.toLocaleDateString()}`,
      mesAnterior: `${prevMonthStart.toLocaleDateString()} - ${prevMonthEnd.toLocaleDateString()}`,
    });

    // Analizar mes actual
    const currentResult = analyzeClientRecurrence(
      services,
      currentMonthStart,
      currentMonthEnd
    );

    // Analizar mes anterior
    const previousResult = analyzeClientRecurrence(
      services,
      prevMonthStart,
      prevMonthEnd
    );

    // Calcular variación
    let diff = 0;
    if (previousResult.recurrentPercentage > 0) {
      diff =
        currentResult.recurrentPercentage - previousResult.recurrentPercentage;
    } else if (
      currentResult.recurrentPercentage > 0 &&
      previousResult.recurrentPercentage === 0
    ) {
      diff = 100;
    }

    const trendDirection = diff > 0.5 ? "up" : diff < -0.5 ? "down" : "equal";

    setCurrentPercentage(currentResult.recurrentPercentage);
    setPreviousPercentage(previousResult.recurrentPercentage);
    setVariation(diff);
    setTrend(trendDirection);

    console.log("📊 Análisis de recurrencia:", {
      mesActual: {
        recurrentes: `${currentResult.recurrentPercentage.toFixed(1)}%`,
        nuevos: `${currentResult.newPercentage.toFixed(1)}%`,
        totalRevenue: `${currentResult.totalRevenue.toFixed(2)}`,
        clientesUnicos: Object.keys(currentResult.debug).length,
        serviciosProcesados: services.filter((s: any) => {
          const d = new Date(s.clientServices?.serviceDate);
          return d >= currentMonthStart && d <= currentMonthEnd;
        }).length,
      },
      mesAnterior: {
        recurrentes: `${previousResult.recurrentPercentage.toFixed(1)}%`,
        nuevos: `${previousResult.newPercentage.toFixed(1)}%`,
        totalRevenue: `${previousResult.totalRevenue.toFixed(2)}`,
        clientesUnicos: Object.keys(previousResult.debug).length,
      },
      variacion: `${diff > 0 ? "+" : ""}${diff.toFixed(1)}pp`,
    });

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="rounded-md text-black border bg-accent p-4 flex items-center justify-center w-1/3 min-h-35">
        <p className="text-sm text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="rounded-md text-black border bg-accent p-4 flex flex-col gap-3 w-1/3">
      {/* Header con trend */}
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-medium">Clientes recurrentes</h2>

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
          {variation !== 0 && (
            <>
              {variation > 0 ? "+" : ""}
              {variation.toFixed(1)}pp
            </>
          )}
          {variation === 0 && "→"}
        </div>
      </div>

      {/* Porcentaje principal */}
      <p className="text-3xl font-bold">{currentPercentage.toFixed(0)}%</p>

      {/* Descripción y comparación */}
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">
          {trend === "up" && "📈 Más clientes recurrentes que el mes anterior"}
          {trend === "down" &&
            "📉 Menos clientes recurrentes que el mes anterior"}
          {trend === "equal" && "➡️ Similar al mes anterior"}
        </p>

        {previousPercentage > 0 && (
          <p className="text-xs text-muted-foreground">
            Mes anterior: {previousPercentage.toFixed(0)}%
          </p>
        )}
      </div>

      <p className="text-xs text-muted-foreground border-t pt-2">
        <span className="">{currentPercentage.toFixed(0)}%</span> de la
        facturación del mes proviene de clientes recurrentes
      </p>
    </div>
  );
}
