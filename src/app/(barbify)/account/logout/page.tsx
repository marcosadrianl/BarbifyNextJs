"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import useTheme from "@/hooks/useTheme";

export default function LogOutPage() {
  const router = useRouter();
  const { theme } = useTheme();

  async function handleLogout() {
    const data = await signOut({
      redirect: false,
      callbackUrl: "/",
    });

    // Redirect without page reload for smoother UX
    if (data?.url) {
      router.push(data.url);
    }
  }

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.textPrimary }}>
      <h1 className="text-xl font-bold mb-4 p-4">Cerrar Sesi&oacute;n</h1>
      <p className="mb-6 px-4" style={{ color: theme.textSecondary }}>
        Haz clic en el botón a continuación para cerrar la sesión de tu cuenta.
      </p>
      <div
        onClick={handleLogout}
        className="p-4 cursor-pointer"
        style={{ backgroundColor: theme.bg }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.backgroundColor =
            theme.accentBg;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.backgroundColor = theme.bg;
        }}
      >
        <span className="flex flex-row w-full justify-between items-center">
          <span>
            <h2 style={{ color: theme.textPrimary }}>Cerrar Sesión Ahora</h2>
            <p className="text-xs" style={{ color: theme.textSecondary }}>
              Haz clic para cerrar sesión de tu cuenta.
            </p>
          </span>
          <ArrowUpRight className="w-6 h-6" />
        </span>
      </div>
    </div>
  );
}
