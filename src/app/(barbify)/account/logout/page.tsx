"use client";

import { signOut } from "next-auth/react";
import { ChevronRight } from "lucide-react";

export default function LogoutPage() {
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
      <div onClick={handleLogout} className="text-muted hover:bg-gray-100">
        <span className="flex flex-row w-full justify-between p-4">
          <p>Salir</p>
          <ChevronRight className="w-6 h-6" />
        </span>
      </div>
    </div>
  );
}
