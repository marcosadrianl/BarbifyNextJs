/**
 * esta pagina trae solo los servicios del; cliente desde clients/[id]/history
 * luego los muestra con toda la informacion aplicando un map a la info traida del servidor
 * usa IClient como client schema
 */
import { IClient } from "@/models/Clients";
import Clients from "@/models/Clients";
import { IService } from "@/models/Clients";
import { connectDB } from "@/utils/mongoose";
import { notFound } from "next/navigation";
import React from "react";
import DeleteService from "@/components/deleteService";
import TotalServices from "@/components/fullServiceData";

/**
 * Esta p  gina trae solo los servicios del cliente desde clients/[id]/history
 * Luego los muestra con toda la informaci  n aplicando un map a la info traida del servidor
 * Usa IClient como client schema
 */

function ClientServicesList({ services }: { services: IService[] }) {
  const daysOfWeek = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  return (
    <div className="flex flex-col gap-4">
      {services.map((service) => {
        const localDate = new Date(service.serviceDate);
        const formatted = localDate.toLocaleString("es-AR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        return (
          <div
            key={service._id.toString()}
            className="flex flex-col gap-2 bg-[#ffd49d] p-2 rounded-2xl shadow-md w-full"
          >
            <div className="flex flex-row justify-between w-full">
              <h2 className="text-2xl font-bold">{service.serviceName}</h2>
              <DeleteService id={service._id.toString()} />
            </div>
            <p className="text-base font-normal">
              • Precio: ${(service.servicePrice / 100).toFixed(2)}
            </p>
            <p className="text-base font-normal">
              • {daysOfWeek[localDate.getDay()]}, {formatted}
            </p>
            <p className="text-base font-normal">
              • Duración: ~{service.serviceDuration} min.
            </p>
            <p className="text-base font-normal italic">
              • {service.serviceNotes ? service.serviceNotes : "Sin notas"}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default async function ClientHistory({
  params,
}: {
  params: { id: string };
}) {
  await connectDB();
  const { id } = await params;
  const clientServicesArray: IClient | null = await Clients.findOne({
    _id: id,
  })
    .select("clientServices")
    .exec();

  const serviceArrayLeaned: IService[] =
    clientServicesArray?.clientServices?.map((service) => {
      return {
        _id: service._id.toString(),
        serviceName: service.serviceName,
        servicePrice: service.servicePrice,
        serviceDate: service.serviceDate,
        serviceDuration: service.serviceDuration,
        serviceNotes: service.serviceNotes,
      };
    });

  if (!clientServicesArray) {
    return notFound();
  }

  if (!clientServicesArray.clientServices?.length) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold">No hay servicios registrados</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-row w-full gap-4 p-4 overflow-auto">
      <div className="w-2/4">
        <ClientServicesList services={serviceArrayLeaned} />
      </div>

      <div className="w-2/4">
        <TotalServices services={serviceArrayLeaned} />
      </div>
    </div>
  );
}
