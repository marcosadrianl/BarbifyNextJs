// lib/server-auth.ts
import { auth } from "@/utils/auth";
import { headers } from "next/headers";

/**
 * Obtiene la sesión del usuario en Server Components
 * Retorna null si no hay sesión activa
 */
export async function getServerSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}

/**
 * Verifica si hay una sesión activa
 * Útil para condicionales simples
 */
export async function isAuthenticated() {
  const session = await getServerSession();
  return !!session;
}

/**
 * Obtiene el usuario actual o lanza error si no está autenticado
 * Útil cuando necesitas garantizar que hay un usuario
 */
export async function requireAuth() {
  const session = await getServerSession();

  if (!session) {
    throw new Error("No autorizado");
  }

  return session;
}
