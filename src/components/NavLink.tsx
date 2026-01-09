import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export function NavLink({ href, icon: Icon, children }) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={clsx(
        "flex flex-row items-center hover:bg-[#f8d09b] rounded-r-2xl px-3 py-1 w-full gap-2",
        pathname.startsWith(href) ? "bg-[#ffd49d]" : "bg-[#cdaa7e]"
      )}
    >
      <Icon className="w-4.5 h-4.5" />
      {children}
    </Link>
  );
}
