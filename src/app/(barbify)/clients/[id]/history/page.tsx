/**
 * Esta página trae solo los servicios del cliente desde clients/[id]/history
 * Luego los muestra con toda la información aplicando un map a la info traída del servidor
 * Usa IClient como client schema
 */

import mongoose from "mongoose";
import { connectDB } from "@/utils/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { redirect } from "next/navigation";
import User from "@/models/Users.model";
import { IUser } from "@/models/Users.type";
import { hasFeature } from "@/lib/permissions";

import ClientServiceList from "@/components/clientServiceList";
import TotalServices from "@/components/fullServiceData";
import { IService } from "@/models/Service.type";
import Services from "@/models/Service.model";

// Página principal
export default async function ClientHistory({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params; // En Next.js 15, params es una Promise

  // Verificar permisos en el servidor
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  await connectDB();
  const user = await (User as mongoose.Model<IUser>)
    .findOne({ userEmail: session.user.userEmail })
    .lean();

  if (!user?.userActive) {
    redirect("/subscription");
  }

  // Verificar si el usuario tiene acceso al historial de clientes (solo premium)
  if (!hasFeature(user, "clientHistory")) {
    redirect("/subscription?feature=clientHistory");
  }

  const services = await (Services as mongoose.Model<IService>)
    .find({ toClientId: id })
    .lean();

  const serviceList = JSON.parse(JSON.stringify(services));

  // Si no hay servicios
  if (!services?.length) {
    return (
      <div className="p-4 w-full">
        <h2 className="text-2xl font-semibold text-center">
          No hay servicios registrados
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-row w-full gap-4 px-4 pt-4 overflow-auto">
      <div className="w-2/4 overflow-auto no-scrollbar">
        <ClientServiceList services={serviceList} clientId={id} />
      </div>
      <div className="w-2/4">
        <TotalServices services={serviceList} defautlState={true} />
      </div>
    </div>
  );
}
