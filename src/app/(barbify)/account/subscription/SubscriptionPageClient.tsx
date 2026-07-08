"use client";

import { Calendar, CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import useTheme from "@/hooks/useTheme";
import type { CSSProperties } from "react";

type Props = {
  subscription: Record<string, any>;
  planDetails: Record<string, any> | undefined;
  nextPaymentDate: string;
  lastPaymentDate: string;
  status: string;
};

export default function SubscriptionPageClient({
  subscription,
  planDetails,
  nextPaymentDate,
  lastPaymentDate,
  status,
}: Props) {
  const { theme } = useTheme();

  const statusConfig = {
    active: {
      label: "Activa",
      color: theme.primary,
      icon: CheckCircle,
    },
    trial: {
      label: "Prueba Gratuita",
      color: theme.appName,
      icon: CheckCircle,
    },
    cancelled: {
      label: "Cancelada",
      color: theme.danger,
      icon: AlertCircle,
    },
    expired: {
      label: "Expirada",
      color: theme.textMuted,
      icon: AlertCircle,
    },
    paused: {
      label: "Pausada",
      color: theme.textSecondary,
      icon: AlertCircle,
    },
    pending: {
      label: "Pendiente",
      color: theme.primaryHover,
      icon: AlertCircle,
    },
  };

  const currentStatus =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.trial;
  const StatusIcon = currentStatus.icon;

  const titleStyle: CSSProperties = {
    color: theme.textPrimary,
  };

  const subtitleStyle: CSSProperties = {
    color: theme.textSecondary,
  };

  const mutedStyle: CSSProperties = {
    color: theme.textMuted,
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4 p-4" style={titleStyle}>
        Suscripción
      </h1>
      <p className="mb-6 px-4" style={subtitleStyle}>
        Revisa los detalles de tu suscripción y la información de facturación.
      </p>

      <div className="mx-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold" style={titleStyle}>
              {planDetails?.name || "All Access"}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <StatusIcon
                className={`w-4 h-4 ${currentStatus.color}`}
                style={{ color: currentStatus.color }}
              />
              <span
                className={`text-sm ${currentStatus.color} font-medium`}
                style={{ color: currentStatus.color }}
              >
                {currentStatus.label}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold" style={titleStyle}>
              ${planDetails ? (planDetails.price / 100).toFixed(0) : "0"}
            </p>
            <p className="text-sm" style={mutedStyle}>
              ARS/mes
            </p>
          </div>
        </div>
        <div className="border-t pt-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2" style={subtitleStyle}>
              <Calendar className="w-4 h-4" />
              Próximo pago
            </span>
            <span className="font-medium" style={titleStyle}>
              {nextPaymentDate}
            </span>
          </div>
          {lastPaymentDate !== "-" && (
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2" style={subtitleStyle}>
                <CreditCard className="w-4 h-4" />
                Último pago
              </span>
              <span className="font-medium" style={titleStyle}>
                {lastPaymentDate}
              </span>
            </div>
          )}
        </div>
      </div>

      <div
        className="p-4 border-t mt-4"
        style={{ borderColor: theme.border, color: theme.textSecondary }}
      >
        <p className="text-xs" style={subtitleStyle}>
          Los pagos se procesan cada mes. Contactanos para cancelar tu
          suscripción o para cualquier consulta sobre facturación. Si estás en
          período de prueba, no se te cobrará hasta que finalice el mismo.
        </p>
      </div>
    </div>
  );
}
