import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongoose";
import mongoose, { Types, Model } from "mongoose";
import Clients, { IClient, IService } from "@/models/Clients";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { Session } from "next-auth";

// Extiende el tipo Session (solo tipado)
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      active?: boolean;
    };
  }
}

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
      "_id clientName clientLastName clientPhone clientServices clientSex"
    );
}

/**
 * GET client's services
 */
export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    /*     console.log("SESSION:", session); */

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
          },
        } as diaryServices;
      });
    });

    return NextResponse.json({
      totalServices: allServices.length,
      data: allServices,
    });
  } catch (error: any) {
    console.error("API /api/diary ERROR:", error);
    return NextResponse.json(
      { error: "Error fetching diary data: " + error.message },
      { status: 500 }
    );
  }
}
