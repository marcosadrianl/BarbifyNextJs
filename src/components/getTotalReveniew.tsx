"use client";

import { useAllServices } from "./getAllClientServicesForShowing";
import { useEffect, useState } from "react";

interface ServiceWithClientSex {
  clientSex: string;
  clientActive: boolean;
  createdAt: string;
}

interface ClientWithServices extends ServiceWithClientSex {
  clientServices: {
    servicePrice: number;
  };
}

export function TotalRevenue() {
  const { services, loading, error } = useAllServices(0, true);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    if (!services?.length) return;

    const total = services.reduce(
      (acc, service) =>
        acc +
        (service as unknown as ClientWithServices).clientServices.servicePrice /
          100,
      0
    );

    const formato = new Intl.NumberFormat("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const totalFormateado: string = formato.format(total);

    setTotalRevenue(totalFormateado as unknown as number);
  }, [services]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error cargando servicios</p>;

  return (
    <div className="rounded-md border text-black bg-accent p-4 w-1/3 flex flex-col ">
      <h2 className="text-sm  tracking-tight flex flex-row items-center gap-2 justify-left">
        Total Revenue
      </h2>
      <p className="text-2xl font-bold">${totalRevenue}</p>
      <p></p>
    </div>
  );
}
