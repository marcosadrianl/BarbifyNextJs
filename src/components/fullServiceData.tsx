"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

type LeanService = {
  _id: string;
  serviceName: string;
  servicePrice: number;
  serviceDate: string;
  serviceDuration: number;
  serviceNotes: string;
};

const Stat = ({
  label,
  value,
  highlight,
  emphasize,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  emphasize?: boolean;
}) => (
  <div className="flex items-center justify-between">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p
      className={`font-semibold ${
        highlight ? "text-3xl" : emphasize ? "text-xl text-primary" : "text-lg"
      }`}
    >
      {value}
    </p>
  </div>
);

const TotalServices = ({ services }: { services: LeanService[] }) => {
  const [totalServices, setTotalServices] = useState(0);
  const [moda, setModa] = useState("");
  const [promedio, setPromedio] = useState("$0.00");
  const [totalGastado, setTotalGastado] = useState("$0.00");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!services || services.length === 0) {
      setTotalServices(0);
      setModa("");
      setPromedio("$0.00");
      setTotalGastado("$0.00");
      return;
    }

    const total = services.length;
    setTotalServices(total);

    // Moda
    const frecuencia: Record<string, number> = {};
    services.forEach(({ serviceName }) => {
      frecuencia[serviceName] = (frecuencia[serviceName] || 0) + 1;
    });

    const maxFrecuencia = Math.max(...Object.values(frecuencia));
    const candidatos = Object.keys(frecuencia).filter(
      (name) => frecuencia[name] === maxFrecuencia
    );

    setModa(candidatos.length === 1 ? candidatos[0] : "");

    // Promedio
    const suma = services.reduce(
      (acc, { servicePrice }) => acc + (servicePrice / 100 || 0),
      0
    );

    const promedioCalculado = suma / total;

    const formatoMoneda = new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    });

    setPromedio(formatoMoneda.format(promedioCalculado));
    setTotalGastado(formatoMoneda.format(promedioCalculado * total));
  }, [services]);

  return (
    <Card className="w-full mb-12 shadow-md border">
      <CardHeader>
        <div className="flex flex-row justify-between">
          <div>
            <CardTitle className="text-2xl">Resumen de servicios</CardTitle>
            <CardDescription>
              Estadísticas generales del cliente
            </CardDescription>
          </div>
          {/* Botón para desplegar */}
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-md hover:bg-accent transition"
          >
            {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </CardHeader>
      {open && (
        <CardContent className="space-y-4">
          <Stat
            label="Total de servicios"
            value={totalServices.toString()}
            highlight
          />
          <div className="border-t my-2" />
          <Stat label="Lo más solicitado" value={moda || "Sin preferencias"} />
          <Stat label="Promedio por servicio" value={promedio} />
          <Stat label="Total gastado" value={totalGastado} emphasize />
        </CardContent>
      )}
    </Card>
  );
};

export default TotalServices;
