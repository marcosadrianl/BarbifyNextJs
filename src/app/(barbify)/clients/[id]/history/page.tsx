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
import ClientServiceList from "@/components/clientServiceList";
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
    <div className="flex flex-row w-full gap-4 px-4 pt-4 overflow-auto">
      <div className="w-2/4">
        <TotalServices services={serviceArrayLeaned} defautlState={true} />
      </div>
      <div className="w-2/4 overflow-auto no-scrollbar">
        <ClientServiceList services={serviceArrayLeaned} clientId={id} />
      </div>
    </div>
  );
}
