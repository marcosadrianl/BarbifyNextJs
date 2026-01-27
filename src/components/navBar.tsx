"use client";
import { Alice } from "next/font/google";
import {
  UserRound,
  CalendarDays,
  Receipt,
  CircleUserRound,
  LayoutDashboard,
} from "lucide-react";
import { NavLink } from "@/components/NavLink"; // importa tu nuevo componente
import Link from "next/link";
import { useSession } from "next-auth/react";

const Titles = Alice({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-titles",
});

export default function NavBar() {
  const { data: session } = useSession();

  function isActiveAndIsLeveled(): boolean {
    return session?.user?.userActive && session?.user?.userLevel! == 1
      ? true
      : false;
  }

  return (
    <div className="flex flex-col w-fit justify-between pr-4 bg-[#ffe7c7] text-[#2f3e2f] border-r border-[#cebaa1]">
      <Link href="/">
        <span className={`${Titles.className} text-4xl px-2 select-none`}>
          Barbify
        </span>
      </Link>

      <div className="flex flex-col flex-1 gap-4 mt-8">
        <NavLink href="/clients" icon={UserRound}>
          Clientes
        </NavLink>

        <NavLink href="/dashboard" icon={LayoutDashboard}>
          Dashboard
        </NavLink>

        <NavLink href="/diary" icon={CalendarDays}>
          Agenda
        </NavLink>
        <NavLink href="/insights" icon={Receipt}>
          Insights
        </NavLink>
        <NavLink href="/account" icon={CircleUserRound}>
          Cuenta
        </NavLink>
      </div>
    </div>
  );
}
