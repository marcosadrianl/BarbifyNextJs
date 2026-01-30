"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useServicesStore } from "@/lib/store/services.store";
import {
  subDays,
  startOfDay,
  format,
  isAfter,
  parse,
  isEqual,
  compareAsc,
} from "date-fns";
import { es } from "date-fns/locale";

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
  servicios: {
    label: "Servicios",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

function getStartDate(range: string) {
  const now = new Date();
  let daysToSubtract = 90;

  switch (range) {
    case "7d":
      daysToSubtract = 7;
      break;
    case "30d":
      daysToSubtract = 30;
      break;
    case "90d":
    default:
      daysToSubtract = 90;
      break;
  }

  return startOfDay(subDays(now, daysToSubtract));
}

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d");
  const { services, loading } = useServicesStore();

  const chartData = React.useMemo(() => {
    const startDate = getStartDate(timeRange);

    // 1. Agrupar y filtrar en un solo paso (reduce)
    const grouped = services.reduce<
      Record<string, { date: string; servicios: number }>
    >((acc, s) => {
      const sDate = new Date(s.serviceDate as unknown as string);

      // Filtro: Solo procesar si es igual o posterior a startDate
      if (isAfter(sDate, startDate) || isEqual(sDate, startDate)) {
        const dateKey = format(sDate, "yyyy-MM-dd");

        if (!acc[dateKey]) {
          acc[dateKey] = { date: dateKey, servicios: 0 };
        }
        acc[dateKey].servicios++;
      }

      return acc;
    }, {});

    // 2. Convertir a array y ordenar
    return Object.values(grouped).sort((a, b) =>
      compareAsc(
        parse(a.date, "yyyy-MM-dd", new Date()),
        parse(b.date, "yyyy-MM-dd", new Date()),
      ),
    );
  }, [services, timeRange]);

  function Loading() {
    if (loading)
      return (
        <svg
          className="animate-spin h-5 w-5 "
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
            <Loading />
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
            aria-label="Select a value"
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
          className="aspect-auto h-50 w-full"
        >
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 12, bottom: 5 }}
          >
            <defs>
              <linearGradient id="fillServicios" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-servicios)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-servicios)"
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
                return format(parse(value, "yyyy-MM-dd", new Date()), "d MMM", {
                  locale: es,
                });
              }}
            />
            <YAxis
              hide
              domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.2)]}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return format(
                      parse(value, "yyyy-MM-dd", new Date()),
                      "d 'de' MMMM",
                      {
                        locale: es,
                      },
                    );
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="servicios"
              type="natural"
              fill="url(#fillServicios)"
              stroke="var(--color-servicios)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
