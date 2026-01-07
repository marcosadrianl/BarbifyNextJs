import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongoose";
import mongoose, { Types, Model } from "mongoose";
import Clients, { IClient, IService } from "@/models/Clients";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import type { Session } from "next-auth";

// Tipado estricto de la respuesta
/* interface errorResponse {
  error: string;
  status?: number;
}
 */
/**
 * Filtrar clientes por usuario autenticado
 */
export function filterByUser<T>(model: Model<T>, session: Session | null) {
  if (!session?.user?.id) {
    throw new Error("Missing userId in session");
  }

  // Convertir el string del session.user.id en ObjectId
  const userObjectId = new Types.ObjectId(session.user.id);

  return model
    .find({
      clientFromUserId: userObjectId,
    })
    .select(
      "_id clientName clientLastName clientPhone clientServices clientSex clientActive createdAt updatedAt"
    );
}

/**
 * GET client's services
 */
export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Usuario no autenticado" },
        { status: 401 }
      );
    }

    // Obtener clientes filtrados
    const clients = await filterByUser(Clients, session).lean();

    /** Tipado estricto de servicio */
    interface serviceInfo {
      _id: string;
      serviceName: string;
      servicePrice: number;
      serviceDate: string | Date;
      serviceDuration: number;
      serviceNotes?: string;
      fromBarberId?: string;
    }

    /** Tipado estricto de la respuesta */
    interface diaryServices {
      clientName: string;
      clientLastName: string;
      clientPhone?: string;
      clientId: string;
      clientSex?: "M" | "F" | "O";
      clientServices: serviceInfo;
    }

    /** Tipo resumido y seguro del cliente */
    type ClientLean = Pick<
      IClient,
      | "clientName"
      | "clientLastName"
      | "clientPhone"
      | "clientServices"
      | "clientSex"
      | "clientActive"
      | "createdAt"
      | "updatedAt"
    > & {
      _id: Types.ObjectId;
    };

    // Combinar servicios + datos del cliente
    const allServices: diaryServices[] = clients.flatMap((c) => {
      const {
        clientName,
        clientLastName,
        clientPhone,
        clientServices,
        _id,
        clientSex,
        clientActive,
        createdAt,
        updatedAt,
      } = c as unknown as ClientLean & { _id: Types.ObjectId };

      return (clientServices || []).map((service: IService) => {
        const srv: IService =
          service instanceof mongoose.Document
            ? (service.toObject() as IService)
            : service;

        return {
          clientName,
          clientLastName,
          clientPhone,
          clientId: _id.toString(),
          clientSex,
          clientServices: {
            _id: srv._id.toString(),
            serviceName: srv.serviceName,
            servicePrice: srv.servicePrice,
            serviceDate: srv.serviceDate,
            serviceDuration: srv.serviceDuration,
            serviceNotes: srv.serviceNotes,
            fromBarberId: srv.fromBarberId?.toString(),
          },
          clientActive,
          createdAt,
          updatedAt,
        } as diaryServices;
      });
    });

    return NextResponse.json({
      totalServices: allServices.length,
      data: allServices,
    });
  } catch (error) {
    console.error("API /api/diary ERROR:", error);
    return NextResponse.json(
      { error: "Error fetching diary data: " + error.message },
      { status: 500 }
    );
  }
}
