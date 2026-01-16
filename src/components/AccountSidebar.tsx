"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function AccountSidebar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    pathname === path
      ? "font-semibold  bg-gray-100 py-4"
      : "freground hover:bg-gray-100 transition-all delay-200 py-4";

  return (
    <nav className="flex flex-col">
      <h1 className="text-2xl p-2">Configuraci&oacute;n</h1>

      <Link href="/account" className={linkClass("/account")}>
        <span className="flex flex-row w-full justify-between px-2">
          <p>Tu Cuenta</p>
          <ChevronRight className="w-6 h-6" />
        </span>
      </Link>

      <Link href="/account/security" className={linkClass("/account/security")}>
        <span className="flex flex-row w-full justify-between px-2">
          <p>Seguridad</p>
          <ChevronRight className="w-6 h-6" />
        </span>
      </Link>

      <Link
        href="/account/subscription"
        className={linkClass("/account/subscription")}
      >
        <span className="flex flex-row w-full justify-between px-2">
          <p>Suscripción</p>
          <ChevronRight className="w-6 h-6" />
        </span>
      </Link>

      <Link href="/account/barbers" className={linkClass("/account/barbers")}>
        <span className="flex flex-row w-full justify-between px-2">
          <p>Barbers</p>
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
          <p>Cerrar Sesi&oacute;n</p>
          <ChevronRight className="w-6 h-6" />
        </span>
      </Link>

      <Separator className="mt-4 mb-4 w-3/5 mx-auto bg-[#cebaa1]" />

      <Link
        href="#"
        className="hover:bg-gray-100 transition-all delay-200 py-4"
      >
        <span className="flex flex-row w-full justify-between px-2">
          <p>Términos y Condiciones</p>
          <ArrowUpRight className="w-6 h-6" />
        </span>
      </Link>

      <Link
        href="#"
        className="hover:bg-gray-100 transition-all delay-200 py-4"
      >
        <span className="flex flex-row w-full justify-between px-2">
          <p>Preguntas Frecuentes</p>
          <ArrowUpRight className="w-6 h-6" />
        </span>
      </Link>

      <Link
        href="#"
        className="hover:bg-gray-100 transition-all delay-200 py-4"
      >
        <span className="flex flex-row w-full justify-between px-2">
          <p>Noticias</p>
          <ArrowUpRight className="w-6 h-6" />
        </span>
      </Link>
    </nav>
  );
}
