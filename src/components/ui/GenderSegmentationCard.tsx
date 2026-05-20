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
import useTheme from "@/hooks/useTheme";

export function GenderSegmentationCard() {
  const services = useServicesStore((s) => s.services);
  const theme = useTheme();

  const stats = useMemo(() => {
    if (!services.length) return null;

    // 1. Definir rango de 2 meses (igual que el gráfico de horas)
    const validDates = services
      .map((s: any) => new Date(s?.serviceDate).getTime())
      .filter((t) => !isNaN(t));
    const latestDate = new Date(Math.max(...validDates));
    const filterStartDate = new Date(
      latestDate.getFullYear(),
      latestDate.getMonth() - 3,
      1,
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
      const sDate = new Date(s?.serviceDate);
      if (sDate < filterStartDate) return;

      // Asumimos que el género viene en s.clientGender
      let gender: "Femenino" | "Masculino" | "Otro" = "Otro";

      if (s.clientSex === "F") gender = "Femenino";
      else if (s.clientSex === "M") gender = "Masculino";
      const price = (s?.servicePrice || 0) / 100;
      const serviceName = s?.serviceName || "General";

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
      console.log(topService);
      return { name, avgTicket, topService, count: data.count };
    });

    // Calcular Insight
    const female = finalData.find((d) => d.name === "Femenino");
    const male = finalData.find((d) => d.name === "Masculino");

    let insight = "";

    // 1. Verificamos que existan ambos objetos y que tengan tickets válidos (mayores a 0)
    if (female && male && female.avgTicket > 0 && male.avgTicket > 0) {
      if (female.avgTicket > male.avgTicket) {
        const diff = ((female.avgTicket / male.avgTicket - 1) * 100).toFixed(0);
        insight = `Clientes femeninos gastan un ${diff}% más por visita.`;
      } else if (male.avgTicket > female.avgTicket) {
        const diff = ((male.avgTicket / female.avgTicket - 1) * 100).toFixed(0);
        insight = `Clientes masculinos gastan un ${diff}% más por visita.`;
      } else {
        insight = "El gasto promedio es igual para ambos géneros.";
      }
    } else {
      // 2. Manejo de caso: cuando uno de los dos no tiene datos aún
      insight = "Datos insuficientes para comparar gasto por género.";
    }

    return { groups: finalData, insight };
  }, [services]);

  if (!stats) return null;

  return (
    <Card
      className="w-full flex flex-col gap-6 rounded-xl py-4 shadow-sm"
      style={{ background: theme.theme.bgCard }}
    >
      <CardHeader>
        <CardTitle
          className="text-md flex items-center gap-2"
          style={{ color: theme.theme.textPrimary }}
        >
          Segmentación por Sexo
        </CardTitle>
        <CardDescription style={{ color: theme.theme.textSecondary }}>
          Análisis de consumo y ticket promedio
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <div className="grid grid-cols-3 gap-4">
          {stats.groups.map((group) => (
            <div
              key={group.name}
              className="p-3 rounded-lg  border"
              style={{
                border: `1px solid ${theme.theme.bg}}`,
                backgroundColor: theme.theme.bg,
              }}
            >
              <div
                className="flex flex-row items-center gap-2 mb-2"
                style={{ color: theme.theme.textPrimary }}
              >
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
              <p
                className="text-2xl font-bold"
                style={{ color: theme.theme.textSecondary }}
              >
                $
                {group.avgTicket.toLocaleString("es-AR", {
                  maximumFractionDigits: 0,
                })}
              </p>
              <p
                className="text-xs uppercase tracking-wider font-medium"
                style={{ color: theme.theme.textSecondary }}
              >
                Ticket Promedio
              </p>

              <div className="mt-3 pt-3 border-t border-border/50">
                <p
                  className="text-xs mb-1"
                  style={{ color: theme.theme.textSecondary }}
                >
                  Servicio Top:
                </p>
                <p
                  className="text-xs font-medium truncate capitalize"
                  style={{ color: theme.theme.textPrimary }}
                >
                  {group.topService}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Sección de Insight y Acción */}
        <div>
          <div className="flex items-start gap-3">
            <Zap
              className="w-4 h-4"
              style={{ color: theme.theme.textPrimary }}
            />

            <div>
              <p
                className="text-sm font-bold mb-1"
                style={{ color: theme.theme.textPrimary }}
              >
                Insight Clave
              </p>
              <p
                className="text-sm mb-3 italic"
                style={{ color: theme.theme.textSecondary }}
              >
                {stats.insight}
              </p>

              <div className="space-y-2">
                <p
                  className="text-[11px] font-bold uppercase tracking-widest"
                  style={{ color: theme.theme.textPrimary }}
                >
                  Acciones Sugeridas
                </p>
                {stats.groups[0].topService != "N/A" && (
                  <div
                    className="flex items-center gap-2 text-xs"
                    style={{ color: theme.theme.textSecondary }}
                  >
                    <ArrowRight className="w-3 h-3" />
                    Promos cruzadas en {stats.groups[0].topService}: combina{" "}
                    {stats.groups[0].topService} con otros servicios populares.
                  </div>
                )}
                <div
                  className="flex items-center gap-2 text-xs"
                  style={{ color: theme.theme.textSecondary }}
                >
                  <ArrowRight className="w-3 h-3" />
                  Ajuste de precios en servicios premium: considera un
                  incremento leve en servicios con alta demanda.
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
