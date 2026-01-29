"use client";

import { usePermissions } from "@/hooks/usePermissions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { type PagePermission } from "@/lib/permissions";

interface PageGuardProps {
  page: PagePermission;
  children: React.ReactNode;
  fallbackUrl?: string;
}

/**
 * Componente para proteger páginas completas según el plan
 * Redirige si el usuario no tiene acceso
 *
 * @example
 * <PageGuard page="analytics">
 *   <AnalyticsContent />
 * </PageGuard>
 */
export function PageGuard({
  page,
  children,
  fallbackUrl = "/subscription",
}: PageGuardProps) {
  const { canAccessPage, hasAppAccess } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!hasAppAccess) {
      router.push("/subscription");
      return;
    }

    if (!canAccessPage(page)) {
      router.push(fallbackUrl);
    }
  }, [canAccessPage, page, fallbackUrl, hasAppAccess, router]);

  if (!hasAppAccess || !canAccessPage(page)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
