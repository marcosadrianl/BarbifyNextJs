import { NextRequest, NextResponse } from "next/server";
import { mp } from "@/app/config/mercadopago";
import { connectDB } from "@/utils/mongoose";
import User from "@/models/Users.model";
import mongoose from "mongoose";
import { IUser } from "@/models/Users.type";

// Webhook para recibir notificaciones de Mercado Pago
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("Webhook recibido:", body);

    // Validar que la notificación viene de Mercado Pago
    const topic = body.topic || body.type;
    const id = body.id || body.data?.id;

    if (!topic || !id) {
      return NextResponse.json(
        { error: "Notificación inválida" },
        { status: 400 },
      );
    }

    // Procesar según el tipo de notificación
    switch (topic) {
      case "payment":
        await handlePaymentNotification(id);
        break;

      case "merchant_order":
        await handleMerchantOrderNotification(id);
        break;

      case "preapproval":
        // Para suscripciones recurrentes
        await handlePreapprovalNotification(id);
        break;

      default:
        console.log("Tipo de notificación no manejada:", topic);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error procesando webhook:", err);
    return NextResponse.json(
      { error: "Error procesando webhook" },
      { status: 500 },
    );
  }
}

async function handlePaymentNotification(paymentId: string) {
  try {
    const { Payment } = await import("mercadopago");
    const paymentClient = new Payment(mp);

    const payment = await paymentClient.get({ id: paymentId });

    console.log("Pago recibido:", payment);

    if (payment.status === "approved") {
      // Extraer información del external_reference
      const externalRef = payment.external_reference || "";
      const [email, plan] = externalRef.split("-");

      if (email && plan) {
        await connectDB();

        // Actualizar usuario con la suscripción y activar cuenta
        await (User as mongoose.Model<IUser>).findOneAndUpdate(
          { userEmail: email },
          {
            $set: {
              userActive: true, // Activar cuenta al confirmar pago
              paymentStatus: true,
              "subscription.plan": plan,
              "subscription.status": "active",
              "subscription.startDate": new Date(),
              "subscription.lastPaymentDate": new Date(),
              "subscription.nextPaymentDate": new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 días
              ),
              "subscription.mercadoPagoSubscriptionId": payment.id,
            },
          },
          { new: true },
        );

        console.log(`Suscripción activada para ${email} con plan ${plan}`);
      }
    }
  } catch (error) {
    console.error("Error manejando notificación de pago:", error);
  }
}

async function handleMerchantOrderNotification(orderId: string) {
  try {
    // Implementar lógica para merchant orders si es necesario
    console.log("Merchant order recibida:", orderId);
  } catch (error) {
    console.error("Error manejando merchant order:", error);
  }
}

async function handlePreapprovalNotification(preapprovalId: string) {
  try {
    // Implementar lógica para preapprovals (suscripciones recurrentes)
    console.log("Preapproval recibido:", preapprovalId);
  } catch (error) {
    console.error("Error manejando preapproval:", error);
  }
}

// GET para verificación (opcional)
export async function GET(req: NextRequest) {
  return NextResponse.json({ status: "Webhook activo" });
}
