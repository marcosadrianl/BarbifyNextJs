"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import useTheme from "@/hooks/useTheme";

export function AccountSidebar() {
  const pathname = usePathname();
  const { theme } = useTheme();

  const linkClass = (path: string) =>
    pathname === path
      ? "font-semibold py-4 bg-[var(--theme-accent-bg)]"
      : "py-4 transition-colors hover:bg-[var(--theme-accent-bg)]";

  const themeStyles = {
    "--theme-text-primary": theme.textPrimary,
    "--theme-text-secondary": theme.textSecondary,
    "--theme-accent-bg": theme.accentBg,
    "--theme-border": theme.border,
  } as React.CSSProperties;

  return (
    <nav className="flex flex-col" style={themeStyles}>
      <h1 className="p-2 text-2xl text-[var(--theme-text-primary)]">
        Configuraci&oacute;n
      </h1>

      <Link href="/account" className={linkClass("/account")}>
        <span className="flex flex-row w-full justify-between px-2">
          <p className="text-[var(--theme-text-primary)]">Tu Cuenta</p>
          <ChevronRight className="w-6 h-6" />
        </span>
      </Link>

      <Link href="/account/security" className={linkClass("/account/security")}>
        <span className="flex flex-row w-full justify-between px-2">
          <p className="text-[var(--theme-text-primary)]">Seguridad</p>
          <ChevronRight className="w-6 h-6" />
        </span>
      </Link>

      <Link
        href="/account/subscription"
        className={linkClass("/account/subscription")}
      >
        <span className="flex flex-row w-full justify-between px-2">
          <p className="text-[var(--theme-text-primary)]">Suscripción</p>
          <ChevronRight className="w-6 h-6" />
        </span>
      </Link>

      <Link href="/account/barbers" className={linkClass("/account/barbers")}>
        <span className="flex flex-row w-full justify-between px-2">
          <p className="text-[var(--theme-text-primary)]">Barbers</p>
          <ChevronRight className="w-6 h-6" />
        </span>
      </Link>

      {/* <Link
        href="/account/dashboard"
        className={linkClass("/account/dashboard")}
      >
        <span className="flex flex-row w-full justify-between px-2">
          <p>Dashboard</p>
          <ChevronRight className="w-6 h-6" />
        </span>
      </Link> */}

      <Link href="/account/logout" className={linkClass("/account/logout")}>
        <span className="flex flex-row w-full justify-between px-2">
          <p className="text-[var(--theme-text-primary)]">Cerrar Sesi&oacute;n</p>
          <ChevronRight className="w-6 h-6" />
        </span>
      </Link>

      <Separator className="mt-4 mb-4 w-3/5 mx-auto bg-[var(--theme-border)]" />

      <Link
        href="/terminos-y-condiciones"
        className="py-4 transition-colors hover:bg-[var(--theme-accent-bg)]"
        target="_blank"
      >
        <span className="flex flex-row w-full justify-between px-2">
          <p className="text-[var(--theme-text-primary)]">Términos y Condiciones</p>
          <ArrowUpRight className="w-6 h-6" />
        </span>
      </Link>

      <Link href="/FAQ" className="py-4 transition-colors hover:bg-[var(--theme-accent-bg)]" target="_blank">
        <span className="flex flex-row w-full justify-between px-2">
          <p className="text-[var(--theme-text-primary)]">Preguntas Frecuentes</p>
          <ArrowUpRight className="w-6 h-6" />
        </span>
      </Link>

      <Link href="#" className="py-4 transition-colors hover:bg-[var(--theme-accent-bg)]" target="_blank">
        <span className="flex flex-row w-full justify-between px-2">
          <p className="text-[var(--theme-text-primary)]">Noticias</p>
          <ArrowUpRight className="w-6 h-6" />
        </span>
      </Link>
    </nav>
  );
}
