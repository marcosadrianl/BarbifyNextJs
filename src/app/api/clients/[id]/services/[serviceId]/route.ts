import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongoose";
import Clients, { IClient, IService } from "@/models/Clients";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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

    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ CORRECCIÓN: Obtener parámetros correctamente
    const { id, serviceId } = await params;

    console.log("🗑️ Eliminando servicio:", { clientId: id, serviceId });

    // Buscar el cliente
    const client = await (Clients as mongoose.Model<IClient>).findById(id);

    if (!client) {
      console.log("❌ Cliente no encontrado:", id);
      return NextResponse.json(
        { message: "Client not found" },
        { status: 404 }
      );
    }

    console.log("✅ Cliente encontrado:", {
      clientId: client._id,
      totalServicios: client.clientServices.length,
    });

    // Verificar que el servicio existe
    const serviceExists = client.clientServices.some(
      (service: IService) => service._id.toString() === serviceId
    );

    if (!serviceExists) {
      console.log("❌ Servicio no encontrado:", serviceId);
      console.log(
        "Servicios disponibles:",
        client.clientServices.map((s: IService) => s._id.toString())
      );
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 }
      );
    }

    // Filtrar el servicio a eliminar
    const originalLength = client.clientServices.length;
    client.clientServices = client.clientServices.filter(
      (service: IService) => service._id.toString() !== serviceId
    );

    console.log("📊 Cambios:", {
      antes: originalLength,
      después: client.clientServices.length,
      eliminados: originalLength - client.clientServices.length,
    });

    // Guardar cambios
    await client.save();

    console.log("✅ Servicio eliminado exitosamente");

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully",
      clientId: id,
      serviceId,
      remainingServices: client.clientServices.length,
    });
  } catch (error) {
    console.error("❌ Error deleting service:", error);

    // Log detallado del error
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return NextResponse.json(
      {
        error: "Failed to delete service",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
