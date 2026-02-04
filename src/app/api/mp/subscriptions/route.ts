import { mp } from "@/app/config/mercadopago";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import {
  SUBSCRIPTION_PLANS,
  SubscriptionPlan,
} from "@/types/subscription.types";
import { connectDB } from "@/utils/mongoose";
import MpSubscription from "@/models/MpSubscription.model";
import { Types } from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.userEmail) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { plan } = (await req.json()) as { plan: SubscriptionPlan };

    if (!plan || !SUBSCRIPTION_PLANS[plan]) {
      return NextResponse.json({ error: "Plan inválido" }, { status: 400 });
    }

    const planDetails = SUBSCRIPTION_PLANS[plan];

    // Crear suscripción recurrente sin plan asociado usando Preapproval
    const { PreApproval } = await import("mercadopago");
    const preapprovalClient = new PreApproval(mp);

    console.log("Creando suscripción con:", {
      plan: planDetails.name,
      price: planDetails.price / 100,
      email: session.user.userEmail,
      back_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success?plan=${plan}`,
    });

    const externalReference = `${session.user.userEmail}-${plan}-${Date.now()}`;

    const result = await preapprovalClient.create({
      body: {
        reason: `Suscripción ${planDetails.name} - Barbify`,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: planDetails.price / 100, // Convertir de centavos a pesos
          currency_id: "ARS",
        },
        back_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success?plan=${plan}`,
        payer_email: session.user.userEmail,
        external_reference: externalReference,
        status: "pending",
      },
    });

    console.log("Suscripción creada exitosamente:", result);

    await connectDB();
    const userObjectId = new Types.ObjectId(session.user.id);
    const nextPaymentDate = result.auto_recurring?.next_payment_date
      ? new Date(result.auto_recurring.next_payment_date)
      : undefined;

    await MpSubscription.findOneAndUpdate(
      { mpSubscriptionId: result.id },
      {
        $set: {
          userId: userObjectId,
          mpSubscriptionId: result.id,
          externalReference,
          payerEmail: session.user.userEmail,
          status: result.status ?? "pending",
          planReason:
            result.reason ?? `Suscripción ${planDetails.name} - Barbify`,
          amount: planDetails.price / 100,
          currency: "ARS",
          frequency: 1,
          frequencyType: "months",
          ...(nextPaymentDate ? { nextPaymentDate } : {}),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return NextResponse.json({
      init_point: result.init_point,
      preapproval_id: result.id,
      subscription_id: result.id,
    });
  } catch (err: any) {
    console.error("Error creando suscripción:", err);
    console.error("Detalles del error:", {
      message: err.message,
      cause: err.cause,
      response: err.response?.data,
    });

    return NextResponse.json(
      {
        error: "Error creando suscripción",
        details: err.message,
        mpError: err.response?.data || err.cause,
      },
      { status: 500 },
    );
  }
}
