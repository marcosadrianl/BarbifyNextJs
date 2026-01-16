/**
 * Esta página trae solo los servicios del cliente desde clients/[id]/history
 * Luego los muestra con toda la información aplicando un map a la info traída del servidor
 * Usa IClient como client schema
 */
import { IClient } from "@/models/Clients";
import Clients from "@/models/Clients";
import mongoose from "mongoose";
import { connectDB } from "@/utils/mongoose";
import { notFound } from "next/navigation";
import ClientServiceList from "@/components/clientServiceList";
import TotalServices from "@/components/fullServiceData";
import Services, { IService, serializeService } from "@/models/Service";

// Página principal
export default async function ClientHistory({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params; // En Next.js 15, params es una Promise

  await connectDB();
  const services = await (Services as mongoose.Model<IService>)
    .find({ toClientId: id })
    .lean();

  const serviceList = JSON.parse(JSON.stringify(services));

  console.log("Servicios encontrados:", serviceList);
  // Si no hay servicios
  if (!services?.length) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold">No hay servicios registrados</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-row w-full gap-4 px-4 pt-4 overflow-auto">
      <div className="w-2/4">
        <TotalServices
          services={serviceList.map(serializeService)}
          defautlState={true}
        />
      </div>
      <div className="w-2/4 overflow-auto no-scrollbar">
        <ClientServiceList
          services={serviceList.map(serializeService)}
          clientId={id}
        />
      </div>
    </div>
  );
}
