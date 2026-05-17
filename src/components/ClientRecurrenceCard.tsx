"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Equal } from "lucide-react";
import { useServicesStore } from "@/lib/store/services.store";
import { IServiceCombined } from "@/models/models";
import useTheme from "@/hooks/useTheme";

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
  services: IServiceCombined[],
  startDate?: Date,
  endDate?: Date,
): RecurrenceResult {
  const clients: Record<string, ClientGroup> = {};

  services.forEach((item) => {
    // ✅ CORRECCIÓN: Acceso correcto a los datos
    const serviceDate = item?.serviceDate;
    const clientId = item?._id.toString();
    const priceRaw = item?.servicePrice;

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
  const { theme } = useTheme();

  const services = useServicesStore((s) => s.services);
  useEffect(() => {
    if (services.length === 0) {
      setLoading(false);
      return;
    }

    // 1. DETECCIÓN DINÁMICA DE LA FECHA MÁS RECIENTE
    // En lugar de hardcodear 2025 u Octubre, buscamos el servicio más nuevo
    const validDates = services
      .map((s: any) => new Date(s?.serviceDate))
      .filter((d: Date) => !isNaN(d.getTime()));

    if (validDates.length === 0) {
      setLoading(false);
      return;
    }

    const latestDate = new Date(
      Math.max(...validDates.map((d: Date) => d.getTime())),
    );

    // 2. DEFINIR MES ACTUAL (basado en el dato más reciente)
    const currentYear = latestDate.getFullYear();
    const currentMonth = latestDate.getMonth();

    const currentMonthStart = new Date(currentYear, currentMonth, 1);
    const currentMonthEnd = new Date(
      currentYear,
      currentMonth + 1,
      0,
      23,
      59,
      59,
    );

    // 3. DEFINIR MES ANTERIOR (Manejo automático de cambio de año)
    // El constructor de Date en JS es inteligente:
    // Si currentMonth es 0 (Enero) y restas 1, automáticamente va a Diciembre del año anterior.
    const prevMonthStart = new Date(currentYear, currentMonth - 1, 1);
    const prevMonthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    // 4. ANÁLISIS
    const currentResult = analyzeClientRecurrence(
      services,
      currentMonthStart,
      currentMonthEnd,
    );
    const previousResult = analyzeClientRecurrence(
      services,
      prevMonthStart,
      prevMonthEnd,
    );

    // Calcular variación (puntos porcentuales)
    const diff =
      currentResult.recurrentPercentage - previousResult.recurrentPercentage;

    // Umbral de 0.5 para evitar oscilaciones insignificantes
    const trendDirection = diff > 0.5 ? "up" : diff < -0.5 ? "down" : "equal";

    setCurrentPercentage(currentResult.recurrentPercentage);
    setPreviousPercentage(previousResult.recurrentPercentage);
    setVariation(diff);
    setTrend(trendDirection);

    setLoading(false);
  }, [services]);

  if (loading) {
    return (
      <div
        className="rounded-md border p-4 flex items-center justify-center w-1/3 min-h-35"
        style={{
          backgroundColor: theme.bgCard,
          borderColor: theme.border,
          color: theme.textPrimary,
        }}
      >
        <p className="text-sm" style={{ color: theme.textSecondary }}>
          Cargando...
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-md border p-4 w-1/3 flex flex-col gap-4"
      style={{
        backgroundColor: theme.bgCard,
        borderColor: theme.border,
        color: theme.textPrimary,
      }}
    >
      <div className="flex justify-between items-center">
        <h2
          className="text-sm font-medium"
          style={{ color: theme.textPrimary }}
        >
          Clientes recurrentes
        </h2>
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
          style={{ backgroundColor: theme.accentBg, color: theme.textPrimary }}
        >
          {trend === "up" && (
            <TrendingUp className="w-4" style={{ color: theme.primary }} />
          )}
          {trend === "down" && (
            <TrendingDown className="w-4" style={{ color: theme.primary }} />
          )}
          {trend === "equal" && (
            <Equal className="w-4" style={{ color: theme.textSecondary }} />
          )}
          {variation !== 0 ? (
            `${variation > 0 ? "+" : ""}${variation.toFixed(1)}%`
          ) : (
            <span style={{ color: theme.textSecondary }}>--</span>
          )}
        </div>
      </div>

      <p className="text-3xl font-bold" style={{ color: theme.textPrimary }}>
        {currentPercentage.toFixed(0)}%
      </p>

      <div className="flex flex-col gap-1">
        <p className="text-sm" style={{ color: theme.textSecondary }}>
          {trend === "up" && "📈 Más recurrencia que el mes anterior"}
          {trend === "down" && "📉 Menos recurrencia que el mes anterior"}
          {trend === "equal" && "➡️ Sin cambios significativos"}
        </p>
        {previousPercentage > 0 && (
          <p
            className="text-xs"
            style={{
              color: theme.textSecondary,
              borderTop: `1px solid ${theme.border}`,
              paddingTop: 8,
              marginTop: 12,
            }}
          >
            Mes anterior: {previousPercentage.toFixed(0)}%
          </p>
        )}
      </div>
    </div>
  );
}
