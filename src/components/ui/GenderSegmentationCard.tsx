"use client";

import { useMemo } from "react";
import { Users, Venus, Mars, ArrowRight, Zap, Circle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useServicesStore } from "@/lib/store/services.store";

export function GenderSegmentationCard() {
  const services = useServicesStore((s) => s.services);

  const stats = useMemo(() => {
    if (!services.length) return null;

    // 1. Definir rango de 2 meses (igual que el gráfico de horas)
    const validDates = services
      .map((s: any) => new Date(s.clientServices?.serviceDate).getTime())
      .filter((t) => !isNaN(t));
    const latestDate = new Date(Math.max(...validDates));
    const filterStartDate = new Date(
      latestDate.getFullYear(),
      latestDate.getMonth() - 3,
      1
    );

    const groups: Record<
      string,
      {
        revenue: number;
        count: number;
        services: Record<string, number>;
      }
    > = {
      Femenino: { revenue: 0, count: 0, services: {} },
      Masculino: { revenue: 0, count: 0, services: {} },
      Otro: { revenue: 0, count: 0, services: {} },
    };

    services.forEach((s: any) => {
      const sDate = new Date(s.clientServices?.serviceDate);
      if (sDate < filterStartDate) return;

      // Asumimos que el género viene en s.clientGender
      let gender: "Femenino" | "Masculino" | "Otro" = "Otro";

      if (s.clientSex === "F") gender = "Femenino";
      else if (s.clientSex === "M") gender = "Masculino";
      const price = (s.clientServices?.servicePrice || 0) / 100;
      const serviceName = s.clientServices?.serviceName || "General";

      groups[gender].revenue += price;
      groups[gender].count += 1;
      groups[gender].services[serviceName] =
        (groups[gender].services[serviceName] || 0) + 1;
    });

    // Calcular promedios y top servicios
    const finalData = Object.entries(groups).map(([name, data]) => {
      const avgTicket = data.count > 0 ? data.revenue / data.count : 0;
      const topService =
        Object.entries(data.services).sort((a, b) => b[1] - a[1])[0]?.[0] ||
        "N/A";

      return { name, avgTicket, topService, count: data.count };
    });

    // Calcular Insight
    const female = finalData.find((d) => d.name === "Femenino");
    const male = finalData.find((d) => d.name === "Masculino");

    let insight = "";
    if (female && male && female.avgTicket > male.avgTicket) {
      const diff = ((female.avgTicket / male.avgTicket - 1) * 100).toFixed(0);
      insight = `Clientes femeninos gastan un ${diff}% más por visita.`;
    } else if (female && male) {
      const diff = ((male.avgTicket / female.avgTicket - 1) * 100).toFixed(0);
      insight = `Clientes masculinos gastan un ${diff}% más por visita.`;
    }

    return { groups: finalData, insight };
  }, [services]);

  if (!stats) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-md flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Segmentación por Sexo
        </CardTitle>
        <CardDescription>Análisis de consumo y ticket promedio</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <div className="grid grid-cols-3 gap-4">
          {stats.groups.map((group) => (
            <div
              key={group.name}
              className="p-3 rounded-lg bg-accent/50 border"
            >
              <div className="flex flex-row items-center gap-2 mb-2">
                {group.name === "Femenino" && (
                  <Venus className="w-4 h-4 text-pink-500" />
                )}

                {group.name === "Masculino" && (
                  <Mars className="w-4 h-4 text-blue-500" />
                )}

                {group.name === "Otro" && (
                  <Circle className="w-4 h-4 text-green-500" />
                )}

                <span className="font-semibold text-sm">{group.name}</span>
              </div>
              <p className="text-2xl font-bold">
                $
                {group.avgTicket.toLocaleString("es-AR", {
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                Ticket Promedio
              </p>

              <div className="mt-3 pt-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-1">
                  Servicio Top:
                </p>
                <p className="text-xs font-medium truncate">
                  {group.topService}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Sección de Insight y Acción */}
        <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-primary mb-1">
                Insight Clave
              </p>
              <p className="text-sm text-muted-foreground mb-3 italic">
                "{stats.insight}"
              </p>

              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase text-muted-foreground tracking-widest">
                  Acciones Sugeridas
                </p>
                <div className="flex items-center gap-2 text-xs text-foreground/80">
                  <ArrowRight className="w-3 h-3 text-primary" />
                  Promos cruzadas en {stats.groups[0].topService}
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground/80">
                  <ArrowRight className="w-3 h-3 text-primary" />
                  Ajuste de precios en servicios premium
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
