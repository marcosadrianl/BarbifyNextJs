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
import { Calendar1 } from "lucide-react";

const chartConfig = {
  total: {
    label: "Servicios",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function YearlyServicesChart() {
  const { services, loading } = useServicesStore(); //

  // 1. Estado para el año seleccionado (por defecto el actual)
  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState<string>(currentYear);

  // 2. Obtener lista de años disponibles de los datos para el Selector
  const availableYears = useMemo(() => {
    const years = services
      .map((s) => {
        const date = new Date(s.clientServices?.serviceDate); //
        return isNaN(date.getTime()) ? null : date.getFullYear().toString();
      })
      .filter(Boolean) as string[];

    // Eliminar duplicados y ordenar de mayor a menor
    return Array.from(new Set([currentYear, ...years])).sort((a, b) =>
      b.localeCompare(a)
    );
  }, [services, currentYear]);

  // 3. Procesar datos filtrados por el año seleccionado
  const chartData = useMemo(() => {
    // Inicializamos todos los meses para que el gráfico no se vea vacío
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
      const dateStr = service.clientServices?.serviceDate; //
      if (!dateStr) return;

      const date = new Date(dateStr);
      if (date.getFullYear().toString() === selectedYear) {
        const monthIndex = date.getMonth(); // 0-11
        dataModel[monthIndex].total += 1;
      }
    });

    return dataModel;
  }, [services, selectedYear]);

  if (loading)
    return <div className="p-4 text-center">Cargando estadísticas...</div>;

  return (
    <Card className="w-1/2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <Calendar1 />
            Servicios por Año
          </CardTitle>
          <CardDescription>
            Visualización mensual del año {selectedYear}
          </CardDescription>
        </div>

        {/* Selector de Año */}
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-30">
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
                opacity={0.4}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="total"
                fill="var(--color-total)"
                radius={[4, 4, 0, 0]}
                barSize={35}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
