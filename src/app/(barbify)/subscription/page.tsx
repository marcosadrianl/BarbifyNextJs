import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { SubscriptionPlans } from "@/components/SubscriptionPlans";
import { connectDB } from "@/utils/mongoose";
import User from "@/models/Users.model";
import mongoose from "mongoose";
import { IUser } from "@/models/Users.type";

export default async function SubscriptionPage() {
  const session = await getServerSession();

  if (!session?.user?.userEmail) {
    redirect("/login");
  }

  // Obtener plan actual del usuario
  await connectDB();
  const user = await (User as mongoose.Model<IUser>)
    .findOne({ userEmail: session.user.userEmail })
    .lean();
  const currentPlan = user?.subscription?.plan || "free";

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto">
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
