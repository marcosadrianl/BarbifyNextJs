"use client";

import React, { useMemo, useState, useEffect } from "react";
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
import { useServicesStore } from "@/lib/store/services.store";
import { CalendarArrowUp } from "lucide-react";

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

  // Estado para manejar responsividad de forma segura en Next.js
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const availableYears = useMemo(() => {
    const years = services
      .map((s) => {
        const year = new Date(s?.serviceDate).getFullYear();
        return isNaN(year) ? null : year;
      })
      .filter((y): y is number => y !== null);

    // Convertimos a Set para evitar duplicados y ordenamos numéricamente
    return Array.from(new Set(years))
      .sort((a, b) => b - a) // orden descendente
      .map((y) => y.toString());
  }, [services]);

  const chartData = useMemo(() => {
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
      const date = new Date(service?.serviceDate);
      if (date.getFullYear().toString() === selectedYear) {
        const dayIndex = date.getDay();
        const dayEntry = daysMap.find((d) => d.index === dayIndex);
        if (dayEntry) dayEntry.count += 1;
      }
    });

    return daysMap.map((d) => ({
      name: d.day,
      total: d.count,
    }));
  }, [services, selectedYear]);

  if (loading)
    return <div className="p-10 text-center">Cargando gráfico...</div>;

  return (
    <Card className="w-full min-w-0 overflow-hidden border-none shadow-none sm:border sm:shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 pb-7">
        <div className="space-y-1">
          <CardTitle className="text-xl flex flex-row items-center gap-2">
            <CalendarArrowUp />
            Servicios por día de la semana
          </CardTitle>
          <CardDescription>
            Total acumulado por día en {selectedYear}
          </CardDescription>
        </div>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-full sm:w-30">
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
      <CardContent className="px-2 sm:px-6">
        <div className="h-50 w-full min-w-0">
          <ChartContainer config={chartConfig} className="h-full w-full">
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
                  fontSize={12}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  fontSize={12}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="total"
                  fill="var(--color-total)"
                  radius={[4, 4, 0, 0]}
                  barSize={isMobile ? 25 : 45}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
