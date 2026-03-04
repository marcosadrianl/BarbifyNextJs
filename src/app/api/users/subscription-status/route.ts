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
import { hasAppAccess } from "@/lib/permissions";

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

    // 🆕 Usar la nueva validación basada en subscriptionExpiresAt
    const hasAccess = hasAppAccess(user);

    // Mantener compatibilidad con sistema anterior
    const subscriptionStatus = checkSubscriptionStatus(user);

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

    const expiresAt = user.subscription?.subscriptionExpiresAt;
    const daysRemaining = expiresAt
      ? Math.ceil(
          (new Date(expiresAt).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : undefined;

    return NextResponse.json({
      hasAccess,
      ...subscriptionStatus,
      plan: user.subscription?.plan || "standard",
      userActive: user.userActive,
      // 🆕 Información del nuevo sistema
      subscriptionExpiresAt: expiresAt || null,
      daysRemaining: hasAccess ? daysRemaining : 0,
    });
  } catch (err) {
    console.error("Error verificando suscripción:", err);
    return NextResponse.json(
      { error: "Error verificando suscripción" },
      { status: 500 },
    );
  }
}
