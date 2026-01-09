"use client";

import React, { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
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
import { useServicesStore } from "@/lib/store/services.store"; //

const chartConfig = {
  total: {
    label: "Servicios",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function WeeklyDayChart() {
  const { services, loading } = useServicesStore();
  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState<string>(currentYear);

  // 1. Años disponibles para el selector
  const availableYears = useMemo(() => {
    const years = services.map((s) =>
      new Date(s.clientServices?.serviceDate).getFullYear().toString()
    );
    return Array.from(new Set([currentYear, ...years]))
      .filter((y) => y !== "NaN")
      .sort((a, b) => b.localeCompare(a));
  }, [services, currentYear]);

  // 2. Procesar datos: Agrupar por día de la semana
  const chartData = useMemo(() => {
    // Definimos el orden de los días (Domingo es 0 en JS, pero lo reordenamos para que empiece Lunes)
    const daysMap = [
      { day: "Lun", count: 0, index: 1 },
      { day: "Mar", count: 0, index: 2 },
      { day: "Mié", count: 0, index: 3 },
      { day: "Jue", count: 0, index: 4 },
      { day: "Vie", count: 0, index: 5 },
      { day: "Sáb", count: 0, index: 6 },
      { day: "Dom", count: 0, index: 0 },
    ];

    services.forEach((service) => {
      const date = new Date(service.clientServices?.serviceDate);
      if (date.getFullYear().toString() === selectedYear) {
        const dayIndex = date.getDay(); // 0 (Dom) a 6 (Sáb)
        const dayEntry = daysMap.find((d) => d.index === dayIndex);
        if (dayEntry) dayEntry.count += 1;
      }
    });

    // Retornamos en orden Lunes -> Domingo
    return [
      daysMap[0],
      daysMap[1],
      daysMap[2],
      daysMap[3],
      daysMap[4],
      daysMap[5],
      daysMap[6],
    ].map((d) => ({
      name: d.day,
      total: d.count,
    }));
  }, [services, selectedYear]);

  if (loading)
    return <div className="p-10 text-center">Cargando gráfico...</div>;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <div className="space-y-1">
          <CardTitle>Demanda por Día</CardTitle>
          <CardDescription>
            Total acumulado por día de la semana en {selectedYear}
          </CardDescription>
        </div>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder="Año" />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                opacity={0.3}
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="total"
                fill="var(--color-total)"
                radius={[4, 4, 0, 0]}
                barSize={45}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
