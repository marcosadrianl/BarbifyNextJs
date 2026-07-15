"use client";
import { Alice } from "next/font/google";
import {
  UserRound,
  CalendarDays,
  Receipt,
  CircleUserRound,
  LayoutDashboard,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import Link from "next/link";
import useTheme from "@/hooks/useTheme";

const Titles = Alice({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-titles",
});

export default function NavBar() {
  const { theme } = useTheme();

  return (
    <div
      className="flex flex-col w-fit justify-between pr-4"
      style={{
        color: theme.textPrimary,
        background: theme.bgSidebar,
        borderRight: `1px solid ${theme.border}`,
      }}
    >
      <Link href="/">
        <span
          className={`${Titles.className} text-4xl px-2 select-none`}
          style={{ color: theme.appName }}
        >
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
