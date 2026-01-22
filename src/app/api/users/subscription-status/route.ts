import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { connectDB } from "@/utils/mongoose";
import User from "@/models/Users.model";
import mongoose from "mongoose";
import { IUser } from "@/models/Users.type";
import {
  checkSubscriptionStatus,
  hasApplicationAccess,
} from "@/utils/subscriptionCheck";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.userEmail) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await connectDB();

    const user = await (User as mongoose.Model<IUser>)
      .findOne({ userEmail: session.user.userEmail })
      .lean();

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    const subscriptionStatus = checkSubscriptionStatus(user);
    const hasAccess = hasApplicationAccess(user);

    // Si el trial expiró y el usuario aún está activo, desactivarlo
    if (subscriptionStatus.isTrialExpired && user.userActive) {
      await (User as mongoose.Model<IUser>).findOneAndUpdate(
        { userEmail: session.user.userEmail },
        {
          $set: {
            userActive: false,
            "subscription.status": "expired",
          },
        },
      );
    }

    return NextResponse.json({
      hasAccess,
      ...subscriptionStatus,
      plan: user.subscription?.plan || "standard",
      userActive: user.userActive,
    });
  } catch (err) {
    console.error("Error verificando suscripción:", err);
    return NextResponse.json(
      { error: "Error verificando suscripción" },
      { status: 500 },
    );
  }
}
