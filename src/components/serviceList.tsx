import { format } from "date-fns";
import { es } from "date-fns/locale";
import { IService } from "@/models/Clients";
import { connectDB } from "@/utils/mongoose";
import Clients, { IClient } from "@/models/Clients";
import mongoose from "mongoose";
import { History, ChevronRight, NotebookPen } from "lucide-react";
import Link from "next/link";

async function getClient(id: string) {
  await connectDB();
  // lean() es excelente para performance en Server Components
  const client = await (Clients as mongoose.Model<IClient>).findById(id).lean();
  return client;
}

export default async function ServiceList({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  try {
    // Manejo correcto de params asíncronos en Next.js 15
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const clientData = await getClient(id);

    if (!clientData) {
      return (
        <div className="p-4 text-center text-gray-400">
          Cliente no encontrado
        </div>
      );
    }

    // Convertimos a objeto plano de forma segura
    const client = JSON.parse(JSON.stringify(clientData));
    const services = client.clientServices || [];

    return (
      <div className="bg-white border border-slate-200 shadow-sm h-fit p-5 rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="">
              <History className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              Últimos Servicios
            </h2>
          </div>

          <Link
            href={`/clients/${id}/history`}
            className="text-xs font-semibold hover:underline flex items-center gap-1"
          >
            Ver todos <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {services.length === 0 ? (
            <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <p className="text-sm text-slate-500">
                No hay servicios registrados aún
              </p>
            </div>
          ) : (
            services
              .slice(0, 5) // Limitamos a los últimos 5

              .map((service: IService) => (
                <div
                  key={service._id.toString()}
                  className="group p-3 bg-slate-50 hover:bg-orange-50 transition-colors rounded-2xl border border-slate-100"
                >
                  <div className="flex flex-row justify-between items-start mb-1">
                    <p className="text-sm font-bold text-slate-800 capitalize">
                      {service.serviceName}
                    </p>
                    <p className="text-[10px] font-medium bg-white px-2 py-1 rounded-full shadow-sm text-slate-500">
                      {format(new Date(service.serviceDate), "dd/MM/yyyy", {
                        locale: es,
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <NotebookPen className="h-3 w-3 opacity-50" />
                    <p className="text-xs italic truncate">
                      {service.serviceNotes || "Sin notas adicionales"}
                    </p>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error cargando ServiceList:", error);
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm">
        Error al cargar el historial de servicios.
      </div>
    );
  }
}
