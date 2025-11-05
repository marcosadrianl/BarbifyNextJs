"use client";

import { useSession, signOut } from "@/utils/auth-clients";
import { useRouter } from "next/navigation";

export default function UserButton() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  if (isPending) {
    return (
      <div className="px-4 py-2 bg-gray-200 rounded-md animate-pulse">
        Cargando...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => router.push("/login")}
          className="px-4 py-2 text-black hover:bg-gray-100 rounded-md transition"
        >
          Iniciar Sesión
        </button>
        <button
          onClick={() => router.push("/signup")}
          className="px-4 py-2 bg-[#ffd49d] text-black font-semibold rounded-md hover:bg-[#ffc570] transition"
        >
          Registrarse
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-sm">
        <p className="font-semibold">{session.user.name}</p>
        <p className="text-gray-600 text-xs">{session.user.email}</p>
      </div>
      <button
        onClick={handleSignOut}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}
