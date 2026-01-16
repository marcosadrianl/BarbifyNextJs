import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongoose";
import { IService } from "@/models/Service";
import mongoose from "mongoose";

/**
 * PATCH /api/clients/[id]/services/[serviceId]
 * Update a service by ID for a client
 */
export async function PATCH(
  request: Request,
  { params }: { params: { serviceId: string } }
) {
  try {
    await connectDB();

    const { serviceId } = await params;

    const data: Partial<IService> = await request.json();

    const updatedService = await (
      mongoose.model<IService>("Services") as mongoose.Model<IService>
    ).findByIdAndUpdate(serviceId, data, { new: true });

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
