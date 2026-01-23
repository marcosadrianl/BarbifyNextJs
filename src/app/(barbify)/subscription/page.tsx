import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { SubscriptionPlans } from "@/components/SubscriptionPlans";
import { connectDB } from "@/utils/mongoose";
import User from "@/models/Users.model";
import mongoose from "mongoose";
import { IUser } from "@/models/Users.type";
import { authOptions } from "@/utils/auth";
import Link from "next/link";
import { CheckCircle, AlertCircle, ChevronLeft } from "lucide-react";

export default async function SubscriptionPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.userEmail) {
    redirect("/login");
  }

  // Obtener plan actual del usuario
  await connectDB();
  const user = await (User as mongoose.Model<IUser>)
    .findOne({ userEmail: session.user.userEmail })
    .lean();
  const currentPlan = user?.subscription?.plan || "standard";
  const trialEndDate = user?.subscription?.trialEndDate;
  const isTrialActive =
    user?.subscription?.status === "trial" &&
    trialEndDate &&
    new Date(trialEndDate) > new Date();

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Elige el plan perfecto para tu peluquería
          </h1>
          <p className="text-xl text-muted-foreground">
            {isTrialActive
              ? `Período de prueba gratuito hasta ${new Date(trialEndDate!).toLocaleDateString()}`
              : "Actualiza tu plan para seguir disfrutando de todas las funcionalidades"}
          </p>
        </div>

        <SubscriptionPlans currentPlan={currentPlan} />
        <Link
          href="/account"
          className="text-sm text-white hover:underline flex flex-row items-center pt-4"
        >
          <ChevronLeft className="h-4 w-4 text-gray-500" />
          Ir a tu cuenta
        </Link>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            {isTrialActive
              ? "Disfruta de 14 días gratuitos del plan Standard. No se requiere tarjeta de crédito."
              : "Todos los planes incluyen acceso completo a la plataforma."}
          </p>
          <p className="py-4">
            Los pagos se procesan de forma segura a través de Mercado Pago.
          </p>
        </div>
      </div>
    </div>
  );
}
