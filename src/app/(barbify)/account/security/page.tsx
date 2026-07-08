"use client";

import SecuritySettings from "@/components/securitySettings";
import { useState } from "react";
import { SquareArrowUpRight } from "lucide-react";
import useTheme from "@/hooks/useTheme";

export default function Page() {
  const [openSection, setOpenSection] = useState<"" | "password">("");
  const { theme } = useTheme();

  const themeStyles = {
    "--theme-bgCard": theme.bgCard,
    "--theme-text-primary": theme.textPrimary,
    "--theme-text-secondary": theme.textSecondary,
    "--theme-border": theme.border,
    "--theme-accent-bg": theme.accentBg,
  } as React.CSSProperties;
  return (
    <div style={themeStyles}>
      <h1 className="text-xl font-bold mb-4 p-4">Seguridad</h1>
      <p className="text-gray-400 mb-6 px-4">
        Ve las opciones de configuración para la seguridad de tu cuenta.
      </p>
      {openSection !== "password" ? (
        <div
          className="cursor-pointer p-4 transition-colors hover:bg-(--theme-accent-bg)"
          onClick={() => setOpenSection("password")}
        >
          <span className="flex flex-row align-items w-full justify-between items-center">
            <span>
              <h2 className="text-(--theme-text-primary)">
                Cambiar Contraseña
              </h2>
              <p className="text-xs text-(--theme-text-secondary)">
                Edita la información general de tu cuenta.
              </p>
            </span>
            <SquareArrowUpRight className="w-6 h-6" />
          </span>
        </div>
      ) : (
        <SecuritySettings onClose={() => setOpenSection("")} />
      )}
    </div>
  );
}
