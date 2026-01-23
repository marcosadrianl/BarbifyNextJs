import { mp } from "@/app/config/mercadopago";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {
  SUBSCRIPTION_PLANS,
  SubscriptionPlan,
} from "@/types/subscription.types";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

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
        external_reference: `${session.user.userEmail}-${plan}-${Date.now()}`,
        status: "pending",
      },
    });

    return NextResponse.json({
      init_point: result.init_point,
      preapproval_id: result.id,
      subscription_id: result.id,
    });
  } catch (err) {
    console.error("Error creando suscripción:", err);
    return NextResponse.json(
      { error: "Error creando suscripción" },
      { status: 500 },
    );
  }
}
