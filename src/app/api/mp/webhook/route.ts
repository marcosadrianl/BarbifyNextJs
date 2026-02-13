import { NextRequest, NextResponse } from "next/server";
import { mp } from "@/app/config/mercadopago";
import { connectDB } from "@/utils/mongoose";
import User from "@/models/Users.model";
import mongoose from "mongoose";
import { IUser } from "@/models/Users.type";
import MpSubscription from "@/models/MpSubscription.model";
import { IMpSubscription } from "@/models/MpSubscription.types";
import crypto from "crypto";

/**
 * Valida la firma x-signature enviada por Mercado Pago en cada webhook.
 * Docs: https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks#verificar
 *
 * Formato de x-signature: "ts=<timestamp>,v1=<hmac_hash>"
 * Manifest: "id:<data.id>;request-id:<x-request-id>;ts:<ts>;"
 */
function validateWebhookSignature(req: NextRequest, dataId: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) {
    console.warn(
      "⚠️ MP_WEBHOOK_SECRET no configurado — omitiendo validación de firma",
    );
    return true; // Si no hay secret configurado, no podemos validar
  }

  const xSignature = req.headers.get("x-signature");
  const xRequestId = req.headers.get("x-request-id");

  if (!xSignature || !xRequestId) {
    console.error("❌ Webhook sin headers x-signature o x-request-id");
    return false;
  }

  // Extraer ts y v1 del header x-signature
  const parts = xSignature.split(",");
  let ts: string | undefined;
  let hash: string | undefined;

  for (const part of parts) {
    const [key, value] = part.split("=", 2);
    if (key?.trim() === "ts") ts = value?.trim();
    if (key?.trim() === "v1") hash = value?.trim();
  }

  if (!ts || !hash) {
    console.error("❌ x-signature con formato inválido:", xSignature);
    return false;
  }

  // Construir el manifest según la documentación de MP
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

  // Generar HMAC-SHA256 con el secret
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(manifest)
    .digest("hex");

  if (hmac !== hash) {
    console.error("❌ Firma de webhook inválida", {
      expected: hmac,
      received: hash,
      manifest,
    });
    return false;
  }

  console.log("✅ Firma de webhook válida");
  return true;
}

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

    // Validar firma criptográfica (x-signature) contra MP_WEBHOOK_SECRET
    if (!validateWebhookSignature(req, String(id))) {
      return NextResponse.json(
        { error: "Firma inválida — solicitud rechazada" },
        { status: 401 },
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

        if (user?._id) {
          // Para pagos individuales no hay next_payment_date, estimamos +1 mes
          const nextPaymentDate = new Date();
          nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

          const mpSubscriptionId = payment.id;
          await (
            MpSubscription as mongoose.Model<IMpSubscription>
          ).findOneAndUpdate(
            { mpSubscriptionId },
            {
              $set: {
                userId: user._id,
                mpSubscriptionId: payment.id,
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

        // Para pagos individuales estimamos +1 mes como próximo cobro
        const nextPaymentDateUser = new Date();
        nextPaymentDateUser.setMonth(nextPaymentDateUser.getMonth() + 1);

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
              "subscription.nextPaymentDate": nextPaymentDateUser,
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

        // Usar next_payment_date de MP (con fallback a +1 mes)
        const nextPaymentDate = preapproval.next_payment_date
          ? new Date(preapproval.next_payment_date)
          : (() => {
              const d = new Date();
              d.setMonth(d.getMonth() + 1);
              return d;
            })();

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
          // Reusar nextPaymentDate de preapproval.next_payment_date (ya calculado arriba)
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
