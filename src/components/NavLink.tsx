import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export function NavLink({ href, icon: Icon, children }) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={clsx(
        "flex flex-row items-center hover:bg-[#E1F7F7] rounded-r-2xl px-3 py-1 w-full gap-2",
        pathname.startsWith(href) ? "bg-slate-200" : "bg-[#E1F7F7]",
      )}
    >
      <Icon className="w-4.5 h-4.5" />
      {children}
    </Link>
  );
}
