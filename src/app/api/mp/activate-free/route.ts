import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { connectDB } from "@/utils/mongoose";
import User from "@/models/Users.model";
import mongoose from "mongoose";
import { IUser } from "@/models/Users.type";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.userEmail) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await connectDB();

    // Activar usuario con plan gratuito
    const updatedUser = await (User as mongoose.Model<IUser>).findOneAndUpdate(
      { userEmail: session.user.userEmail },
      {
        $set: {
          userActive: true,
          "subscription.plan": "free",
          "subscription.status": "active",
          "subscription.startDate": new Date(),
        },
      },
      { new: true },
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Plan gratuito activado",
    });
  } catch (err) {
    console.error("Error activando plan gratuito:", err);
    return NextResponse.json(
      { error: "Error activando plan gratuito" },
      { status: 500 },
    );
  }
}
