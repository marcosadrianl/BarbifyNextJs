import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { mp } from "@/app/config/mercadopago";
import { connectDB } from "@/utils/mongoose";
import User from "@/models/Users.model";
import MpSubscription from "@/models/MpSubscription.model";
import mongoose from "mongoose";
import { IUser } from "@/models/Users.type";
import { IMpSubscription } from "@/models/MpSubscription.types";

/**
 * Endpoint para verificar y activar una suscripción inmediatamente después del pago
 * Se ejecuta cuando el usuario regresa de Mercado Pago
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.userEmail) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { preapproval_id, plan } = await req.json();

    await connectDB();

    // Si no tenemos preapproval_id, buscar la última suscripción del usuario
    let preapprovalId = preapproval_id;

    if (!preapprovalId) {
      // Buscar la última suscripción creada por este usuario
      const lastSubscription = await (
        MpSubscription as mongoose.Model<IMpSubscription>
      )
        .findOne({
          payerEmail: session.user.userEmail,
        })
        .sort({ createdAt: -1 })
        .limit(1);

      if (lastSubscription?.mpSubscriptionId) {
        preapprovalId = lastSubscription.mpSubscriptionId;
        console.log(
          `🔍 Preapproval ID no proporcionado, usando la última suscripción: ${preapprovalId}`,
        );
      }
    }

    if (!preapprovalId) {
      return NextResponse.json(
        {
          error:
            "No se encontró información de suscripción. Por favor intenta nuevamente.",
        },
        { status: 400 },
      );
    }

    // Consultar el estado actual del preapproval en Mercado Pago
    const { PreApproval } = await import("mercadopago");
    const preapprovalClient = new PreApproval(mp);

    const preapproval = await preapprovalClient.get({ id: preapprovalId });

    console.log("Verificando suscripción:", {
      preapproval_id: preapprovalId,
      status: preapproval.status,
      email: session.user.userEmail,
      plan,
    });

    // Si la suscripción está autorizada, activar usuario
    if (preapproval.status === "authorized") {
      const user = await (User as mongoose.Model<IUser>).findOne({
        userEmail: session.user.userEmail,
      });

      if (!user) {
        return NextResponse.json(
          { error: "Usuario no encontrado" },
          { status: 404 },
        );
      }

      // Obtener fecha de próximo pago desde MP (con fallback a +30 días)
      const nextPaymentDate = preapproval.next_payment_date
        ? new Date(preapproval.next_payment_date)
        : (() => {
            const d = new Date();
            d.setDate(d.getDate() + 30);
            return d;
          })();

      // Actualizar usuario con suscripción activa
      await (User as mongoose.Model<IUser>).findOneAndUpdate(
        { userEmail: session.user.userEmail },
        {
          $set: {
            userActive: true,
            paymentStatus: true,
            "subscription.plan": plan || "standard",
            "subscription.status": "active",
            "subscription.startDate": new Date(),
            "subscription.lastPaymentDate": new Date(),
            "subscription.nextPaymentDate": nextPaymentDate,
            "subscription.mercadoPagoPreapprovalId": preapprovalId,
            // Limpiar trial si existía
            "subscription.trialEndDate": undefined,
            "subscription.isInTrial": false,
          },
        },
        { new: true },
      );

      // Actualizar registro de MpSubscription
      await (
        MpSubscription as mongoose.Model<IMpSubscription>
      ).findOneAndUpdate(
        { mpSubscriptionId: preapprovalId },
        {
          $set: {
            userId: user._id,
            mpSubscriptionId: preapprovalId,
            externalReference: preapproval.external_reference,
            payerEmail: preapproval.payer_email,
            status: preapproval.status,
            planReason: preapproval.reason,
            amount: preapproval.auto_recurring?.transaction_amount,
            currency: preapproval.auto_recurring?.currency_id,
            frequency: preapproval.auto_recurring?.frequency,
            frequencyType: preapproval.auto_recurring?.frequency_type,
            nextPaymentDate: nextPaymentDate,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );

      console.log(
        `✅ Suscripción verificada y activada para ${session.user.userEmail} - Plan: ${plan}`,
      );

      return NextResponse.json({
        success: true,
        status: "active",
        plan: plan || "standard",
        message: "Suscripción activada correctamente",
      });
    } else if (preapproval.status === "pending") {
      // Aún está pendiente, puede ser que MP tarde en procesar
      return NextResponse.json({
        success: false,
        status: "pending",
        message:
          "La suscripción está siendo procesada. Por favor espera unos momentos.",
      });
    } else {
      // Otro estado (cancelled, paused, etc)
      return NextResponse.json({
        success: false,
        status: preapproval.status,
        message: `La suscripción tiene estado: ${preapproval.status}`,
      });
    }
  } catch (err: any) {
    console.error("Error verificando suscripción:", err);
    return NextResponse.json(
      {
        error: "Error verificando suscripción",
        details: err.message,
        mpError: err.response?.data || err.cause,
      },
      { status: 500 },
    );
  }
}
