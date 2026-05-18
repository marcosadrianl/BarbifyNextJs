import { format } from "date-fns";
import { es } from "date-fns/locale";
import { IService } from "@/models/Service.type";
import Services from "@/models/Service.model";
import ServiceListClient from "@/components/ServiceListClient";
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

    // Serialize fields that are not plain objects (ObjectId, Date) so they
    // can be passed to a Client Component.
    const serialized = (services || []).map((s: any) => ({
      ...s,
      _id: s._id ? String(s._id) : null,
      serviceDate: s.serviceDate ? new Date(s.serviceDate).toISOString() : null,
      createdAt: s.createdAt ? new Date(s.createdAt).toISOString() : null,
      updatedAt: s.updatedAt ? new Date(s.updatedAt).toISOString() : null,
    }));

    return <ServiceListClient services={serialized} clientId={id} />;
  } catch (error) {
    console.error("Error cargando ServiceList:", error);
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm">
        Error al cargar el historial de servicios.
      </div>
    );
  }
}
