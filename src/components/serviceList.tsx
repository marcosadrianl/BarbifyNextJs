import { format } from "date-fns";
import { es } from "date-fns/locale";
import { IService } from "@/models/Service.type";
import Services from "@/models/Service.model";
import { History, ChevronRight, NotebookPen } from "lucide-react";
import Link from "next/link";
import { connectDB } from "@/utils/mongoose";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation"; // ← Agregá esto
import { authOptions } from "@/utils/auth";

export default async function ServiceList({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  // ✅ Usá redirect en lugar de NextResponse
  if (!session || !session.user?.id) {
    redirect("/login"); // O la ruta que uses para login
  }

  function getDateClass(serviceDate: Date): string {
    const now = new Date();
    const date = new Date(serviceDate);

    return date > now
      ? "text-[10px] font-medium bg-green-100 px-2 py-1 rounded-full shadow-sm text-green-700"
      : "text-[10px] font-medium bg-white px-2 py-1 rounded-full shadow-sm text-slate-500";
  }

  try {
    const { id } = await params;
    await connectDB();

    const services = await (Services as mongoose.Model<IService>)
      .find({ toClientId: id })
      .lean();

    return (
      <div className="bg-white border border-slate-200 shadow-sm h-fit p-5 rounded-3xl">
        {/* ... resto del JSX igual ... */}
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
            className={`text-xs font-semibold hover:underline flex items-center gap-1 text-slate-600 ${services.length === 0 ? "pointer-events-none opacity-50" : ""}`}
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
              .reverse()
              .slice(0, 5)
              .map((service: IService, index) => (
                <div
                  key={index}
                  className="group p-3 bg-slate-50 hover:bg-orange-50 transition-colors rounded-2xl border border-slate-100"
                >
                  <div className="flex flex-row justify-between items-start mb-1">
                    <p className="text-sm font-bold text-slate-800 capitalize">
                      {service.serviceName}
                    </p>
                    <p
                      className={getDateClass(service.serviceDate)}
                      title={
                        new Date(service.serviceDate) > new Date()
                          ? "Próxima cita"
                          : ""
                      }
                    >
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
