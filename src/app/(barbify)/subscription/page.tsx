import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { SubscriptionPlans } from "@/components/SubscriptionPlans";
import { connectDB } from "@/utils/mongoose";
import User from "@/models/Users.model";
import mongoose from "mongoose";
import { IUser } from "@/models/Users.type";
import { authOptions } from "@/utils/auth";

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
  const isActive = user?.userActive ?? false;
  const trialEndDate = user?.subscription?.trialEndDate;
  const isTrialActive =
    user?.subscription?.status === "trial" &&
    trialEndDate &&
    new Date(trialEndDate) > new Date();

  return (
    <div className="container mx-auto py-10 px-4 bg-[#fff7ec] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-[#2f3e2f]">
            Elige el plan perfecto para tu peluquería
          </h1>
          <p className="text-xl text-muted-foreground">
            {isTrialActive
              ? `Período de prueba gratuito hasta ${new Date(trialEndDate!).toLocaleDateString()}`
              : "Actualiza tu plan para seguir disfrutando de todas las funcionalidades"}
          </p>
        </div>

        <SubscriptionPlans currentPlan={currentPlan} />

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
