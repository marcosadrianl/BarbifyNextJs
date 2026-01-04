"use client";
import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useServicesStore } from "@/lib/store/services.store";

import type { IService } from "@/models/Clients";
import type { IClient } from "@/models/Clients";
type ClientWithServices = Pick<IClient, "clientSex"> & {
  clientServices: IService;
};
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const description = "An interactive area chart";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  Hombre: {
    label: "Hombre",
    color: "var(--chart-1)",
  },
  Mujer: {
    label: "Mujer",
    color: "var(--chart-2)",
  },
  Otro: {
    label: "Otro",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

// Función para obtener la fecha local en formato YYYY-MM-DD
function toLocalDateString(date) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split("T")[0];
}

function getStartDate(range) {
  const now = new Date();
  const start = new Date(now);
  switch (range) {
    case "7d":
      start.setDate(now.getDate() - 7);
      break;
    case "30d":
      start.setDate(now.getDate() - 30);
      break;
    case "90d":
    default:
      start.setDate(now.getDate() - 90);
      break;
  }
  start.setHours(0, 0, 0, 0);
  return start;
}

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d");

  const [loading, setLoading] = React.useState(true);

  const services = useServicesStore((s) => s.services);
  React.useEffect(() => {
    if (services && services.length > 0) {
      setLoading(false);
    }
  }, [services]);

  // Aquí se agrupan los datos usando la fecha local
  const chartData = React.useMemo(() => {
    if (!services.length) return [];
    const startDate = getStartDate(timeRange);
    return Object.values(
      services
        .filter((client) => {
          const serviceDate = new Date(client.clientServices.serviceDate);
          return serviceDate >= startDate;
        })
        .reduce<
          Record<
            string,
            { date: string; Hombre: number; Mujer: number; Otro: number }
          >
        >((acc, client) => {
          const date = toLocalDateString(client.clientServices.serviceDate);
          if (!acc[date]) {
            acc[date] = { date, Hombre: 0, Mujer: 0, Otro: 0 };
          }
          if (client.clientSex === "M") acc[date].Hombre++;
          if (client.clientSex === "F") acc[date].Mujer++;
          if (client.clientSex === "O") acc[date].Otro++;
          return acc;
        }, {})
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [services, timeRange]);

  function LoadingSpinner() {
    return (
      <svg
        className="animate-spin h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    );
  }

  return (
    <Card className="pt-0 rounded-md">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-2xl font-semibold tracking-tight flex flex-row items-center gap-2">
            Servicios realizados
            {loading && <LoadingSpinner />}
          </CardTitle>
          <CardDescription>
            Se muestran los servicios de los últimos{" "}
            {timeRange === "90d"
              ? "3 meses"
              : timeRange === "30d"
              ? "30 días"
              : "7 días"}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-40 rounded-lg sm:ml-auto sm:flex"
            aria-label="Selecciona un valor"
          >
            <SelectValue placeholder="Últimos 3 meses" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Últimos 3 meses
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Últimos 30 días
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Últimos 7 días
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-62.5 w-full"
        >
          <AreaChart
            data={chartData}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillHombre" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-Hombre)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-Hombre)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMujer" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-Mujer)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-Mujer)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillOtro" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-Otro)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-Otro)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const [year, month, day] = value.split("-");
                const date = new Date(
                  Number(year),
                  Number(month) - 1,
                  Number(day)
                );
                return date.toLocaleDateString("es-MX", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const [year, month, day] = value.split("-");
                    const date = new Date(
                      Number(year),
                      Number(month) - 1,
                      Number(day)
                    );
                    return date.toLocaleDateString("es-MX", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="Mujer"
              type="natural"
              fill="url(#fillMujer)"
              stroke="var(--color-Mujer)"
              stackId="a"
            />
            <Area
              dataKey="Hombre"
              type="natural"
              fill="url(#fillHombre)"
              stroke="var(--color-Hombre)"
              stackId="a"
            />
            <Area
              dataKey="Otro"
              type="natural"
              fill="url(#fillOtro)"
              stroke="var(--color-Otro)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
