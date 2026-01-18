import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongoose";

import mongoose, { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

import Services from "@/models/Service.model";
import { IService } from "@/models/Service.type";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;

    await connectDB();

    const services = await (Services as mongoose.Model<IService>).find({
      toClientId: id,
    });

    if (!services || services.length === 0) {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const data: IService = await request.json();
    const { id } = await params;

    // Crear un nuevo servicio asociado al id (ej: clientId)
    const newService = new (Services as mongoose.Model<IService>)({
      ...data,
      toClientId: id,
    });

    const savedService = await newService.save();

    return NextResponse.json(savedService, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 },
    );
  }
}
