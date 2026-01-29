"use client";

import { usePermissions } from "@/hooks/usePermissions";
import { type FeaturePermission } from "@/lib/permissions";
import { ReactNode } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";

interface FeatureGateProps {
  feature: FeaturePermission;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradePrompt?: boolean;
}

/**
 * Componente para ocultar/mostrar funcionalidades según el plan
 *
 * @example
 * <FeatureGate feature="exportPDF">
 *   <Button>Exportar PDF</Button>
 * </FeatureGate>
 */
export function FeatureGate({
  feature,
  children,
  fallback,
  showUpgradePrompt = true,
}: FeatureGateProps) {
  const { hasFeature, plan } = usePermissions();

  if (hasFeature(feature)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showUpgradePrompt) {
    return (
      <div className="relative group">
        <div className="opacity-50 pointer-events-none">{children}</div>
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href="/subscription"
            className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors"
          >
            <Lock className="h-4 w-4" />
            Upgrade a Premium
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
