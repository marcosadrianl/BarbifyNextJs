"use client";

import { useEffect, useState } from "react";
import { IService } from "@/models/Clients";

const TotalServices = ({
  services,
}: {
  services: IService[] | null | undefined;
}) => {
  const [totalServices, setTotalServices] = useState<number>(0);
  const [moda, setModa] = useState<string>("");
  const [promedio, setPromedio] = useState<string>("$0.00");
  const [totalGastado, setTotalGastado] = useState<string>("$0.00");

  useEffect(() => {
    if (!services || services.length === 0) {
      setTotalServices(0);
      setModa("");
      setPromedio("$0.00");
      setTotalGastado("$0.00");
      return;
    }

    try {
      // Total
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
    } catch (error) {
      console.error("Error al calcular estadísticas:", error);
    }
  }, [services]);

  return (
    <div className="flex flex-col gap-4 p-4 bg-[#ffd49d] rounded-2xl shadow-md w-full mb-12 h-fit">
      <div>
        <p className="text-3xl font-bold">Total de Servicios:</p>
        <p className="text-3xl font-semibold">{totalServices}</p>
      </div>
      <div>
        <p className="text-2xl font-bold">Lo más solicitado:</p>
        <p className="text-2xl font-semibold">
          {moda ? moda : "Sin preferencias"}
        </p>
      </div>
      <div>
        <p className="text-2xl font-bold">Promedio:</p>
        <p className="text-2xl font-semibold">{promedio}</p>
      </div>
      <div>
        <p className="text-2xl font-bold">Total Gastado:</p>
        <p className="text-2xl font-semibold">{totalGastado}</p>
      </div>
    </div>
  );
};

export default TotalServices;
