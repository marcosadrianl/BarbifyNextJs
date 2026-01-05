"use client";

import { DollarSign, TrendingUp, BanknoteArrowUp } from "lucide-react";
// Importamos ReferenceLine y Label de recharts
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  ReferenceLine,
  Label,
} from "recharts";
import { useMemo } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import { useServicesStore } from "@/lib/store/services.store";

const chartConfig = {
  incomePerHour: {
    label: "Ingresos por hora",
    color: "var(--chart-1)",
    icon: DollarSign,
  },
} satisfies ChartConfig;

function buildHourlyIncomeChartData(services: any[]) {
  const buckets: Record<string, { totalIncome: number; totalMinutes: number }> =
    {};

  services.forEach((service) => {
    const date = new Date(service.clientServices?.serviceDate);
    if (isNaN(date.getTime())) return;

    // Formato HH:00 (ej: "09:00")
    const hour = `${date.getHours().toString().padStart(2, "0")}:00`;

    if (!buckets[hour]) {
      buckets[hour] = { totalIncome: 0, totalMinutes: 0 };
    }

    buckets[hour].totalIncome +=
      (service.clientServices?.servicePrice || 0) / 100;
    buckets[hour].totalMinutes += service.clientServices?.serviceDuration || 0;
  });

  return Object.entries(buckets)
    .map(([hour, data]) => ({
      hour,
      incomePerHour:
        data.totalMinutes > 0
          ? Math.round((data.totalIncome / data.totalMinutes) * 60)
          : 0,
    }))
    .sort((a, b) => a.hour.localeCompare(b.hour));
}

export function IncomePerHourByHourChart() {
  const services = useServicesStore((s) => s.services);

  const chartData = useMemo(() => {
    if (!services || services.length === 0) return [];

    const validDates = services
      .map((s: any) => new Date(s.clientServices?.serviceDate).getTime())
      .filter((t) => !isNaN(t));

    if (validDates.length === 0) return [];

    const latestDate = new Date(Math.max(...validDates));
    const filterStartDate = new Date(
      latestDate.getFullYear(),
      latestDate.getMonth() - 3,
      1
    );

    const filteredServices = services.filter((s: any) => {
      const sDate = new Date(s.clientServices?.serviceDate);
      return sDate >= filterStartDate;
    });

    return buildHourlyIncomeChartData(filteredServices);
  }, [services]);

  const avg = useMemo(() => {
    if (chartData.length === 0) return 0;
    return Math.round(
      chartData.reduce((acc, h) => acc + h.incomePerHour, 0) / chartData.length
    );
  }, [chartData]);

  if (!chartData.length) {
    return (
      <Card>
        <CardContent className="p-4 text-sm text-muted-foreground">
          No hay datos suficientes para los últimos tres meses.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-1/4 bg-accent">
      <CardHeader>
        <CardTitle title="Ingresos por hora">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <BanknoteArrowUp className="h-4 w-4 text-muted-foreground" />
            Ingresos por hora
          </h3>
        </CardTitle>
        <CardDescription title="Rentabilidad horaria (Promedio últimos 3 meses)">
          Rentabilidad horaria
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart data={chartData} margin={{ left: 12, right: 12, top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    `$${Number(value).toLocaleString("es-AR")}`
                  }
                />
              }
            />

            {/* LÍNEA DE REFERENCIA: Muestra el promedio general */}
            <ReferenceLine
              y={avg}
              stroke="red"
              strokeDasharray="3 3"
              strokeWidth={2}
            >
              <Label
                value={`Promedio: $${avg}`}
                position="top"
                fill="#ef4444"
                fontSize={12}
                fontWeight="bold"
              />
            </ReferenceLine>

            <Area
              type="step"
              dataKey="incomePerHour"
              fill="var(--color-incomePerHour)"
              fillOpacity={0.4}
              stroke="var(--color-incomePerHour)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="text-xs text-muted-foreground border-t pt-2 w-full flex items-center justify-between">
          Facturación media: ${avg.toLocaleString("es-AR")} / h
          <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
