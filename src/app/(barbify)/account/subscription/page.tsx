import {
  ArrowUpRight,
  Calendar,
  CreditCard,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { connectDB } from "@/utils/mongoose";
import User from "@/models/Users.model";
import { SUBSCRIPTION_PLANS } from "@/types/subscription.types";
import mongoose from "mongoose";
import { IUser } from "@/models/Users.type";
import { authOptions } from "@/utils/auth";

export default async function Page() {
  const session = await getServerSession(authOptions);
  console.log("🛡️ Sesión del usuario:", session);

  let userData = null;
  if (session?.user?.userEmail) {
    await connectDB();
    userData = await (User as mongoose.Model<IUser>)
      .findOne({ userEmail: session.user.userEmail })
      .select("-userPassword -_id")
      .lean();
  }

  const subscription = userData?.subscription || {};

  console.log("🛡️ Datos de suscripción del usuario:", userData);
  const plan = subscription.plan || "standard";
  const status = subscription.status || "trial";
  const planDetails =
    SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS];

  // Formatear fechas
  const nextPaymentDate = subscription.nextPaymentDate
    ? new Date(subscription.nextPaymentDate).toLocaleDateString("es-AR")
    : "-";
  const lastPaymentDate = subscription.lastPaymentDate
    ? new Date(subscription.lastPaymentDate).toLocaleDateString("es-AR")
    : "-";

  // Estado visual
  const statusConfig = {
    active: { label: "Activa", color: "text-green-600", icon: CheckCircle },
    trial: {
      label: "Prueba Gratuita",
      color: "text-blue-600",
      icon: CheckCircle,
    },
    cancelled: { label: "Cancelada", color: "text-red-600", icon: AlertCircle },
    expired: { label: "Expirada", color: "text-gray-600", icon: AlertCircle },
    paused: { label: "Pausada", color: "text-yellow-600", icon: AlertCircle },
    pending: {
      label: "Pendiente",
      color: "text-orange-600",
      icon: AlertCircle,
    },
  };

  const currentStatus =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.trial;
  const StatusIcon = currentStatus.icon;

  return (
    <div className="">
      <h1 className="text-xl font-bold mb-4 p-4">Suscripción</h1>
      <p className="text-gray-400 mb-6 px-4">
        Administra tu suscripción y métodos de pago.
      </p>

      {/* Plan Actual */}
      <div className="mx-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">
              {planDetails?.name || "Plan Standard"}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <StatusIcon className={`w-4 h-4 ${currentStatus.color}`} />
              <span className={`text-sm ${currentStatus.color} font-medium`}>
                {currentStatus.label}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">
              ${planDetails ? (planDetails.price / 100).toFixed(0) : "0"}
            </p>
            <p className="text-sm text-gray-500">ARS/mes</p>
          </div>
        </div>

        <div className="border-t pt-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              Próximo pago
            </span>
            <span className="font-medium">{nextPaymentDate}</span>
          </div>
          {lastPaymentDate !== "-" && (
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-gray-600">
                <CreditCard className="w-4 h-4" />
                Último pago
              </span>
              <span className="font-medium">{lastPaymentDate}</span>
            </div>
          )}
        </div>
      </div>

      {/* Cambiar Plan */}
      <Link href="/subscription" className="w-full">
        <div className="cursor-pointer hover:bg-gray-100 p-4">
          <span className="flex flex-row w-full justify-between items-center">
            <span>
              <h2 className="font-semibold">Cambiar Plan</h2>
              <p className="text-xs text-gray-600">
                Explora nuestros planes y actualiza tu suscripción
              </p>
            </span>
            <ArrowUpRight className="w-6 h-6" />
          </span>
        </div>
      </Link>

      {/* Gestionar en MercadoPago */}
      {subscription.mercadoPagoPreapprovalId && (
        <a
          href={`https://www.mercadopago.com.ar/subscriptions/${subscription.mercadoPagoPreapprovalId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <div className="cursor-pointer hover:bg-gray-100 p-4 border-b border-gray-200">
            <span className="flex flex-row w-full justify-between items-center">
              <span>
                <h2 className="font-semibold">Administrar en MercadoPago</h2>
                <p className="text-xs text-gray-600">
                  Gestiona tu método de pago y facturación
                </p>
              </span>
              <ArrowUpRight className="w-6 h-6" />
            </span>
          </div>
        </a>
      )}

      {/* Información */}
      <div className="p-4 border-t border-[#cebaa1] mt-4">
        <p className="text-xs text-gray-600">
          {status === "trial" ? (
            <>
              Estás en período de prueba gratuito. Al finalizar, se te cobrará
              automáticamente si no cancelas antes de la fecha límite.
            </>
          ) : (
            <>
              Los pagos se procesan automáticamente cada mes. Puedes cancelar tu
              suscripción en cualquier momento desde MercadoPago.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
