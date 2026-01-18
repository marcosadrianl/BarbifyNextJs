import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongoose";
import { IService } from "@/models/Service.type";
import Services from "@/models/Service.model";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";

/**
 * Create a new service for a client
 * route: /api/services/route.ts
 */

/**
 * GET all client's services for a specific user
 */
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const services: IService[] = await (Services as mongoose.Model<IService>)
      .find({
        forUserId: session.user.id,
      })
      .lean();

    if (!services || services.length === 0) {
      return NextResponse.json(
        { message: "Services not found" },
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
