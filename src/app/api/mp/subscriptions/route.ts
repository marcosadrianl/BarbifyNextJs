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

    /* if (!session?.user?.userEmail) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    } */

    const { plan } = (await req.json()) as { plan: SubscriptionPlan };

    if (!plan || !SUBSCRIPTION_PLANS[plan]) {
      return NextResponse.json({ error: "Plan inválido" }, { status: 400 });
    }

    const planDetails = SUBSCRIPTION_PLANS[plan];

    // Crear preferencia de pago recurrente
    const preference = {
      body: {
        reason: `Suscripción ${planDetails.name} - Barbify`,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months" as const,
          transaction_amount: planDetails.price / 100, // Convertir de centavos a pesos
          currency_id: "ARS",
        },
        back_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success`,
        payer_userEmail: session.user.userEmail,
        external_reference: `${session.user.userEmail}-${plan}-${Date.now()}`,
        status: "pending" as const,
      },
    };

    // Nota: Mercado Pago tiene diferentes formas de manejar suscripciones
    // Puede que necesites usar la API de Preapproval (suscripciones)
    // Documentación: https://www.mercadopago.com.ar/developers/es/docs/subscriptions/introduction

    // Por ahora, crearemos una preferencia de pago único que luego
    // puedes convertir en suscripción
    const { Preference } = await import("mercadopago");
    const preferenceClient = new Preference(mp);

    const result = await preferenceClient.create({
      body: {
        items: [
          {
            id: `subscription-${plan}`,
            title: `Suscripción ${planDetails.name}`,
            description: planDetails.description,
            quantity: 1,
            unit_price: planDetails.price / 100,
            currency_id: "ARS",
          },
        ],
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success?plan=${plan}`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/pending`,
        },
        auto_return: "approved",
        external_reference: `${session.user.userEmail}-${plan}-${Date.now()}`,
        payer: {
          email: session.user.userEmail,
        },
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/mp/webhook`,
      },
    });

    return NextResponse.json({
      init_point: result.init_point,
      preference_id: result.id,
    });
  } catch (err) {
    console.error("Error creando suscripción:", err);
    return NextResponse.json(
      { error: "Error creando suscripción" },
      { status: 500 },
    );
  }
}
