"use client";

import { useSession } from "next-auth/react";
import { IUser } from "@/models/Users.type";
import {
  checkPermissions,
  type PagePermission,
  type FeaturePermission,
} from "@/lib/permissions";

type sessionUser = Pick<
  IUser,
  | "_id"
  | "userEmail"
  | "userActive"
  | "paymentStatus"
  | "userLevel"
  | "userName"
  | "subscription"
>;

/**
 * Hook para verificar permisos del usuario en componentes cliente
 */
export function usePermissions() {
  const { data: session } = useSession();
  const user = session?.user as sessionUser | null;

  return checkPermissions(user as IUser);
}

/**
 * Hook simplificado para verificar una página específica
 */
export function usePageAccess(page: PagePermission) {
  const { canAccessPage } = usePermissions();
  return canAccessPage(page);
}

/**
 * Hook simplificado para verificar una funcionalidad específica
 */
export function useFeatureAccess(feature: FeaturePermission) {
  const { hasFeature } = usePermissions();
  return hasFeature(feature);
}
