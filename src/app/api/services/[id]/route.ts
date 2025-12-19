import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongoose";
import Clients, { IClient, IService } from "@/models/Clients";
import mongoose from "mongoose";

/**
 * Create a new service for a client
 * route: /api/services/[id]
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const data: IService = await request.json();
    const { id } = await params;

    const client: IClient | null = await (
      Clients as mongoose.Model<IClient>
    ).findById(id);
    if (!client) {
      return NextResponse.json(
        { message: "Client not found" },
        { status: 404 }
      );
    }
    //anadir al principio del array
    client.clientServices.unshift(data);

    const savedClient = await client.save();
    return NextResponse.json(savedClient);
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}

/**
 * GET client's services
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const client: IClient | null = await (
      Clients as mongoose.Model<IClient>
    ).findById(params.id);
    if (!client) {
      return NextResponse.json(
        { message: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(client.clientServices);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

/**
 * DELETE a service by ID for a client
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; serviceId: string } }
) {
  try {
    await connectDB();
    const client: IClient | null = await (
      Clients as mongoose.Model<IClient>
    ).findById(params.id);
    if (!client) {
      return NextResponse.json(
        { message: "Client not found" },
        { status: 404 }
      );
    }
    client.clientServices = client.clientServices.filter(
      (service: IService) => service._id.toString() !== params.serviceId
    );
    const savedClient = await client.save();
    return NextResponse.json(savedClient);
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/clients/[id]/services/[serviceId]
 * Update a service by ID for a client
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string; serviceId: string } }
) {
  try {
    await connectDB();
    const data: Partial<IService> = await request.json();
    const client: IClient | null = await (
      Clients as mongoose.Model<IClient>
    ).findById(params.id);
    if (!client) {
      return NextResponse.json(
        { message: "Client not found" },
        { status: 404 }
      );
    }
    const serviceIndex = client.clientServices.findIndex(
      (service: IService) => service._id.toString() === params.serviceId
    );
    if (serviceIndex === -1) {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 }
      );
    }
    client.clientServices[serviceIndex] = {
      ...client.clientServices[serviceIndex],
      ...data,
    };
    const savedClient = await client.save();
    return NextResponse.json(savedClient);
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}
