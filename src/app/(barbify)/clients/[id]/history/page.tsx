/**
 * Esta página trae solo los servicios del cliente desde clients/[id]/history
 * Luego los muestra con toda la información aplicando un map a la info traída del servidor
 * Usa IClient como client schema
 */
import { IClient, IService } from "@/models/Clients";
import Clients from "@/models/Clients";
import mongoose from "mongoose";
import { connectDB } from "@/utils/mongoose";
import { notFound } from "next/navigation";
import DeleteService from "@/components/deleteService";
import TotalServices from "@/components/fullServiceData";

// Definir el tipo LeanService
type LeanService = {
  _id: string;
  serviceName: string;
  servicePrice: number;
  serviceDate: string;
  serviceDuration: number;
  serviceNotes: string;
};

// Función para convertir IService a LeanService
function leanService(service: IService): LeanService {
  return {
    _id: service._id.toString(),
    serviceName: service.serviceName,
    servicePrice: service.servicePrice,
    serviceDate:
      service.serviceDate instanceof Date
        ? service.serviceDate.toISOString()
        : service.serviceDate,
    serviceDuration: service.serviceDuration,
    serviceNotes: service.serviceNotes || "",
  };
}

// Props del componente
type ClientServicesListProps = {
  services: LeanService[];
  clientId: string;
};

// Componente para mostrar la lista de servicios
function ClientServicesList({ services, clientId }: ClientServicesListProps) {
  const daysOfWeek = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
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
            key={service._id}
            className="flex flex-col gap-2 bg-[#ffd49d] p-2 rounded-2xl shadow-md w-full"
          >
            <div className="flex flex-row justify-between w-full">
              <h2 className="text-2xl font-bold">{service.serviceName}</h2>
              <DeleteService serviceId={service._id} clientId={clientId} />
            </div>
            <p className="text-base font-normal">
              • Precio: ${(service.servicePrice / 100).toFixed(2)}
            </p>
            <p className="text-base font-normal">
              • {daysOfWeek[localDate.getDay()]}, {formatted}
            </p>
            <p className="text-base font-normal">
              • Duración: ~{service.serviceDuration} min.
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

// Página principal
export default async function ClientHistory({
  params,
}: {
  params: { id: string };
}) {
  await connectDB();
  const { id } = await params;

  // Buscar el cliente y sus servicios
  const clientServicesArray = await (Clients as mongoose.Model<IClient>)
    .findOne({
      _id: id,
    })
    .select("clientServices")
    .lean();

  if (!clientServicesArray) {
    return notFound();
  }

  // Serializar servicios
  const serviceArrayLeaned: LeanService[] =
    clientServicesArray.clientServices?.map(leanService) ?? [];

  // Si no hay servicios
  if (!serviceArrayLeaned.length) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold">No hay servicios registrados</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-row w-full gap-4 p-4 overflow-auto">
      <div className="w-2/4">
        <ClientServicesList services={serviceArrayLeaned} clientId={id} />
      </div>

      <div className="w-2/4">
        <TotalServices services={serviceArrayLeaned} />
      </div>
    </div>
  );
}
