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
  const currentPlan = user?.subscription?.plan || "free";
  const isActive = user?.userActive ?? false;

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {!isActive && (
          <div className="mb-8 p-6 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
            <h2 className="text-2xl font-bold text-yellow-900 mb-2">
              ¡Bienvenido a Barbify! 🎉
            </h2>
            <p className="text-yellow-800 text-lg">
              Para comenzar a usar la plataforma, por favor selecciona un plan.
              Puedes empezar con el plan <strong>Gratuito</strong> o elegir un
              plan premium con más funcionalidades.
            </p>
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Elige el plan perfecto para tu barbería
          </h1>
          <p className="text-xl text-muted-foreground">
            Comienza gratis y actualiza cuando estés listo para crecer
          </p>
        </div>

        <SubscriptionPlans currentPlan={currentPlan} />

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Todos los planes incluyen acceso a la plataforma básica.</p>
          <p className="mt-2">
            Los pagos se procesan de forma segura a través de Mercado Pago.
          </p>
        </div>
      </div>
    </div>
  );
}
