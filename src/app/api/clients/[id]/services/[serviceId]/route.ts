import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongoose";
import Clients, { IClient } from "@/models/Clients";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import Services, { IService } from "@/models/Service";

/**
 * DELETE /api/clients/[id]/services/[serviceId]
 * Elimina un servicio específico de un cliente
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; serviceId: string } }
) {
  try {
    await connectDB();

    const { id, serviceId } = await params;

    const deletedService = await (
      Services as mongoose.Model<IService>
    ).findOneAndDelete({
      _id: serviceId,
      toClientId: id,
    });

    if (!deletedService) {
      return NextResponse.json(
        { message: "Service not found for this client" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Service deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; serviceId: string } }
) {
  try {
    await connectDB();

    const { id, serviceId } = await params;

    const data: Partial<IService> = await request.json();

    const updatedService = await (
      Services as mongoose.Model<IService>
    ).findOneAndUpdate({ _id: serviceId, toClientId: id }, data, { new: true });

    if (!updatedService) {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}
