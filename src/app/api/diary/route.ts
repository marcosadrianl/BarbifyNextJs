import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongoose";
import mongoose from "mongoose";
import Clients, { IClient, IService } from "@/models/Clients";

/**
 * GET client's services
 */

export async function GET() {
  try {
    await connectDB();

    // Obtenemos todos los clientes con los campos necesarios
    const clients: IClient[] = await Clients.find(
      {},
      {
        clientName: 1,
        clientLastName: 1,
        phone: 1,
        clientServices: 1,
      }
    ).lean<IClient[]>();

    interface serviceInfo {
      _id: string;
      serviceName: string;
      servicePrice: number;
      serviceDate: string;
      serviceDuration: number;
      serviceNotes?: string;
    }

    interface diaryServices {
      clientName: string;
      clientLastName: string;
      clientPhone: string;
      clientId: string;
      serviceObject: serviceInfo;
    }

    // Recorremos y combinamos los servicios con la info del cliente
    const allServices: diaryServices[] = clients.flatMap((c) => {
      const { clientName, clientLastName, clientPhone } = c;

      return (c.clientServices || []).map((service: IService) => ({
        ...(service instanceof mongoose.Document
          ? service.toObject()
          : service),
        clientName,
        clientLastName,
        clientPhone,
        clientId: c._id,
      }));
    });
    return NextResponse.json({
      totalServices: allServices.length,
      data: allServices,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching diary data: " + error },
      { status: 500 }
    );
  }
}
