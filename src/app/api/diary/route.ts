import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongoose";
import mongoose from "mongoose";
import Clients, { IClient, IService, serializeClient } from "@/models/Clients";

/**
 * GET client's services
 */

export async function GET() {
  try {
    await connectDB();

    // Obtenemos todos los clientes con los campos necesarios
    const clients = await Clients.find(
      {},
      {
        clientName: 1,
        clientLastName: 1,
        phone: 1,
        clientServices: 1,
      }
    );

    const client = clients.map((client) => serializeClient(client));

    interface serviceInfo {
      serviceName: string;
      serviceDate: Date;
      servicePrice: number;
      serviceDuration: number;
    }

    interface diaryServices {
      clientName: string;
      clientLastName: string;
      clientPhone: string;
      clientId: string;
      serviceObject: serviceInfo;
    }

    // Recorremos y combinamos los servicios con la info del cliente
    const allServices: diaryServices[] = client.flatMap((c) => {
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
