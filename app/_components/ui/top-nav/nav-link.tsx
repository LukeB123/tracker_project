"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({
  href,
  label,
}: Readonly<{
  href: string;
  label: string;
}>) {
  const path = usePathname();

  let className = "hover:text-blue-300";

  if (path === href) {
    className = "text-blue-400 hover:text-blue-300";
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}
