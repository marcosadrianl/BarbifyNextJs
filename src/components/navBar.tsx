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
import { usePermissions } from "@/hooks/usePermissions";
import { useEffect, useState } from "react";
import { lightTheme, darkTheme } from "@/UI/theme";

const Titles = Alice({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-titles",
});

export default function NavBar() {
  const { data: session } = useSession();
  const { canAccessPage } = usePermissions();

  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handle = (e: MediaQueryListEvent | MediaQueryList) => {
      // older browsers call with MediaQueryList, newer with MediaQueryListEvent
      // both have a 'matches' property
      // @ts-ignore
      setIsDark(Boolean(e.matches));
    };

    // initial
    setIsDark(Boolean(mq.matches));

    // attach listener (cross-browser)
    if (typeof mq.addEventListener === "function") {
      // modern
      // @ts-ignore
      mq.addEventListener("change", handle);
    } else if (typeof mq.addListener === "function") {
      // legacy
      // @ts-ignore
      mq.addListener(handle);
    }

    return () => {
      if (typeof mq.removeEventListener === "function") {
        // @ts-ignore
        mq.removeEventListener("change", handle);
      } else if (typeof mq.removeListener === "function") {
        // @ts-ignore
        mq.removeListener(handle);
      }
    };
  }, []);

  const theme = isDark ? darkTheme : lightTheme;

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

        {canAccessPage("diary") && (
          <NavLink href="/diary" icon={CalendarDays}>
            Agenda
          </NavLink>
        )}

        {canAccessPage("insights") && (
          <NavLink href="/insights" icon={Receipt}>
            Insights
          </NavLink>
        )}

        <NavLink href="/account" icon={CircleUserRound}>
          Cuenta
        </NavLink>
      </div>
    </div>
  );
}
