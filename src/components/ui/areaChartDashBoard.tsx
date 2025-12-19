"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useAllServices } from "@/components/getAllClientServicesForShowing";
import type { IService } from "@/models/Clients";
import type { IClient } from "@/models/Clients";

type ServiceWithClientSex = IService & Pick<IClient, "clientSex">;

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
  male: {
    label: "male",
    color: "var(--chart-1)",
  },
  female: {
    label: "female",
    color: "var(--chart-2)",
  },
  other: {
    label: "other",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

function getStartDate(range: string) {
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
  const { services, loading } = useAllServices(5, false);

  const chartData = React.useMemo(() => {
    const startDate = getStartDate(timeRange);

    return Object.values(
      services
        .filter((client: ServiceWithClientSex) => {
          const serviceDate = new Date(client.clientServices.serviceDate);
          return serviceDate >= startDate;
        })
        .reduce((acc, client: ServiceWithClientSex) => {
          const date = new Date(client.clientServices.serviceDate)
            .toISOString()
            .split("T")[0];

          if (!acc[date]) {
            acc[date] = { date, male: 0, female: 0, other: 0 };
          }

          if (client.clientSex === "M") acc[date].male++;
          if (client.clientSex === "F") acc[date].female++;
          if (client.clientSex === "O") acc[date].other++;

          return acc;
        }, {} as Record<string, { date: string; male: number; female: number; other: number }>)
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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
    <Card className="pt-0">
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
              ? "30 dias"
              : "7 dias"}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-40 rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart
            data={chartData}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillmale" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-male)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-male)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillfemale" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-female)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-female)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillother" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-other)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-other)"
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
                const date = new Date(value);
                return date.toLocaleDateString("es-AR", {
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
                    return new Date(value).toLocaleDateString("es-AR", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="female"
              type="natural"
              fill="url(#fillfemale)"
              stroke="var(--color-female)"
              stackId="a"
            />
            <Area
              dataKey="male"
              type="natural"
              fill="url(#fillmale)"
              stroke="var(--color-male)"
              stackId="a"
            />
            <Area
              dataKey="other"
              type="natural"
              fill="url(#fillother)"
              stroke="var(--color-other)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
