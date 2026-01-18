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
import { Calendar1 } from "lucide-react";

const chartConfig = {
  total: {
    label: "Servicios",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function YearlyServicesChart() {
  const { services, loading } = useServicesStore();

  // Solución para "window is not defined" y responsividad
  const [isMobile, setIsMobile] = useState(false);
  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState<string>(currentYear);

  useEffect(() => {
    // Detectar el ancho solo en el cliente
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize(); // Ejecución inicial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const availableYears = useMemo(() => {
    const years = services
      .map((s) => {
        const date = new Date(s?.serviceDate);
        return isNaN(date.getTime()) ? null : date.getFullYear().toString();
      })
      .filter(Boolean) as string[];

    return Array.from(new Set([currentYear, ...years])).sort((a, b) =>
      b.localeCompare(a)
    );
  }, [services, currentYear]);

  const chartData = useMemo(() => {
    const monthNames = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    const dataModel = monthNames.map((name) => ({ month: name, total: 0 }));

    services.forEach((service) => {
      const dateStr = service?.serviceDate;
      if (!dateStr) return;

      const date = new Date(dateStr);
      if (date.getFullYear().toString() === selectedYear) {
        const monthIndex = date.getMonth();
        dataModel[monthIndex].total += 1;
      }
    });

    return dataModel;
  }, [services, selectedYear]);

  if (loading)
    return <div className="p-4 text-center">Cargando estadísticas...</div>;

  return (
    // min-w-0 es la clave para que el gráfico no desborde en flex/grid
    <Card className="w-full min-w-0 overflow-hidden border-none shadow-none sm:border sm:shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <CardTitle className="text-xl flex flex-row items-center gap-2">
          <Calendar1 className="h-6 w-6" />
          Servicios por Año
        </CardTitle>
        <CardDescription>
          Visualización mensual del año {selectedYear}
        </CardDescription>

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
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer>
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
                dataKey="month"
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
                barSize={isMobile ? 18 : 32}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
