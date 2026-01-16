"use client";

import { signOut } from "next-auth/react";
import { ArrowUpRight, ChevronRight } from "lucide-react";

export default function LogOutPage() {
  function handleLogout() {
    signOut({
      callbackUrl: "/",
      redirect: true,
    });

    // Limpia el historial (best effort)
    window.history.replaceState(null, "", "/");
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4 p-4">Cerrar Sesi&oacute;n</h1>
      <p className="text-gray-400 mb-6 px-4">
        Haz clic en el botón a continuación para cerrar sesión de tu cuenta.
      </p>
      <div
        onClick={handleLogout}
        className="hover:bg-gray-100 p-4 cursor-pointer"
      >
        <span className="flex flex-row w-full justify-between items-center">
          <span>
            <h2>Cerrar Sesión Ahora</h2>
            <p className="text-xs">Haz clic para cerrar sesión de tu cuenta.</p>
          </span>
          <ArrowUpRight className="w-6 h-6" />
        </span>
      </div>
    </div>
  );
}
