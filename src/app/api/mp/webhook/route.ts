import { NextRequest, NextResponse } from "next/server";
import { mp } from "@/app/config/mercadopago";
import { connectDB } from "@/utils/mongoose";
import User from "@/models/Users.model";
import mongoose from "mongoose";
import { IUser } from "@/models/Users.type";
import MpSubscription from "@/models/MpSubscription.model";

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
      case "subscription_preapproval":
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

        const user = await (User as mongoose.Model<IUser>).findOne({
          userEmail: email,
        });

        if (user?._id && payment.preapproval_id) {
          const nextPaymentDate = new Date();
          nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

          await MpSubscription.findOneAndUpdate(
            { mpSubscriptionId: payment.preapproval_id },
            {
              $set: {
                userId: user._id,
                mpSubscriptionId: payment.preapproval_id,
                externalReference: payment.external_reference,
                payerEmail: payment.payer?.email,
                status: payment.status,
                amount: payment.transaction_amount,
                currency: payment.currency_id,
                ...(nextPaymentDate ? { nextPaymentDate } : {}),
              },
            },
            { upsert: true, new: true, setDefaultsOnInsert: true },
          );
        }

        const nextPaymentDate = new Date();
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

        // Actualizar usuario con el pago recurrente
        await (User as mongoose.Model<IUser>).findOneAndUpdate(
          { userEmail: email },
          {
            $set: {
              userActive: true,
              paymentStatus: true,
              "subscription.plan": plan,
              "subscription.status": "active",
              "subscription.lastPaymentDate": new Date(),
              "subscription.nextPaymentDate": nextPaymentDate,
            },
          },
          { new: true },
        );

        console.log(
          `💳 Pago recurrente procesado para ${email} - Plan ${plan}`,
        );
      }
    } else if (
      payment.status === "rejected" ||
      payment.status === "cancelled"
    ) {
      // Pago rechazado - desactivar usuario
      const externalRef = payment.external_reference || "";
      const [email] = externalRef.split("-");

      if (email) {
        await connectDB();
        await (User as mongoose.Model<IUser>).findOneAndUpdate(
          { userEmail: email },
          {
            $set: {
              userActive: false,
              paymentStatus: false,
              "subscription.status": "cancelled",
            },
          },
        );

        console.log(`❌ Pago rechazado para ${email} - Cuenta desactivada`);
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
    const { PreApproval } = await import("mercadopago");
    const preapprovalClient = new PreApproval(mp);

    // Obtener detalles de la suscripción
    const preapproval = await preapprovalClient.get({ id: preapprovalId });

    console.log("Preapproval recibido:", preapproval);

    // Procesar según el estado de la suscripción
    if (preapproval.status === "authorized") {
      // Suscripción autorizada - activar usuario
      const externalRef = preapproval.external_reference || "";
      const [email, plan] = externalRef.split("-");

      if (email && plan) {
        await connectDB();

        const user = await (User as mongoose.Model<IUser>).findOne({
          userEmail: email,
        });

        const nextPaymentDate = new Date();
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

        await (User as mongoose.Model<IUser>).findOneAndUpdate(
          { userEmail: email },
          {
            $set: {
              userActive: true, // Activar cuenta
              paymentStatus: true,
              "subscription.plan": plan,
              "subscription.status": "active",
              "subscription.startDate": new Date(),
              "subscription.lastPaymentDate": new Date(),
              "subscription.nextPaymentDate": nextPaymentDate,
              "subscription.mercadoPagoPreapprovalId": preapprovalId,
            },
          },
          { new: true },
        );

        if (user?._id) {
          const nextPaymentDateFromMp = preapproval.auto_recurring
            ?.next_payment_date
            ? new Date(preapproval.auto_recurring.next_payment_date)
            : undefined;

          await MpSubscription.findOneAndUpdate(
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
                ...(nextPaymentDateFromMp
                  ? { nextPaymentDate: nextPaymentDateFromMp }
                  : {}),
              },
            },
            { upsert: true, new: true, setDefaultsOnInsert: true },
          );
        }

        console.log(`✅ Suscripción activada para ${email} con plan ${plan}`);
      }
    } else if (preapproval.status === "paused") {
      // Suscripción pausada
      const externalRef = preapproval.external_reference || "";
      const [email] = externalRef.split("-");

      if (email) {
        await connectDB();
        const user = await (User as mongoose.Model<IUser>).findOne({
          userEmail: email,
        });
        await (User as mongoose.Model<IUser>).findOneAndUpdate(
          { userEmail: email },
          {
            $set: {
              "subscription.status": "paused",
            },
          },
        );

        if (user?._id) {
          await MpSubscription.findOneAndUpdate(
            { mpSubscriptionId: preapprovalId },
            {
              $set: {
                userId: user._id,
                mpSubscriptionId: preapprovalId,
                externalReference: preapproval.external_reference,
                payerEmail: preapproval.payer_email,
                status: preapproval.status,
                planReason: preapproval.reason,
              },
            },
            { upsert: true, new: true, setDefaultsOnInsert: true },
          );
        }

        console.log(`⏸️ Suscripción pausada para ${email}`);
      }
    } else if (preapproval.status === "cancelled") {
      // Suscripción cancelada
      const externalRef = preapproval.external_reference || "";
      const [email] = externalRef.split("-");

      if (email) {
        await connectDB();
        const user = await (User as mongoose.Model<IUser>).findOne({
          userEmail: email,
        });
        await (User as mongoose.Model<IUser>).findOneAndUpdate(
          { userEmail: email },
          {
            $set: {
              userActive: false,
              paymentStatus: false,
              "subscription.status": "cancelled",
              "subscription.cancelledAt": new Date(),
              "subscription.endDate": new Date(),
            },
          },
        );

        if (user?._id) {
          await MpSubscription.findOneAndUpdate(
            { mpSubscriptionId: preapprovalId },
            {
              $set: {
                userId: user._id,
                mpSubscriptionId: preapprovalId,
                externalReference: preapproval.external_reference,
                payerEmail: preapproval.payer_email,
                status: preapproval.status,
                planReason: preapproval.reason,
                cancelledAt: new Date(),
              },
            },
            { upsert: true, new: true, setDefaultsOnInsert: true },
          );
        }

        console.log(`❌ Suscripción cancelada para ${email}`);
      }
    }
  } catch (error) {
    console.error("Error manejando preapproval:", error);
  }
}

// GET para verificación (opcional)
export async function GET(req: NextRequest) {
  return NextResponse.json({ status: "Webhook activo" });
}
