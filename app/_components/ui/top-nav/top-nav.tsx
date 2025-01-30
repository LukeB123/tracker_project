"use client";

import NavLink from "@/app/_components/ui/top-nav/nav-link";
import Image from "next/image";
import Link from "next/link";

import { useAppSelector } from "@/app/lib/hooks";
import Notification from "@/app/_components/ui/top-nav/notification";

const links = [
  {
    id: 1,
    label: "PROJECTS",
    href: "/projects",
    hidden: false,
  },
  {
    id: 2,
    label: "RESOURCES",
    href: "/resources",
    hidden: false,
  },
  {
    id: 3,
    label: "ABSENCE",
    href: "/absence",
    hidden: false,
  },
  // {
  //   id: 4,
  //   label: "SKILLS",
  //   href: "/skills",
  //   hidden: false,
  // },
];

export default function TopNav() {
  const notification = useAppSelector((state) => state.ui.notification);
  return (
    <>
      {notification && <Notification notification={notification} />}
      <header className="px-10 w-full h-20 bg-gradient-to-b from-purple-600 to-purple-700 text-grey-50 flex justify-between items-center fixed z-30">
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/wolf.png"
            alt="wolf logo"
            width="60"
            height="60"
            className="fill-grey-50"
          />
          <h1 className="text-2xl font-bold">Prospero Data Input</h1>
        </Link>
        <ul className="flex gap-8">
          {links.map((link) => (
            <li key={link.id}>
              <NavLink href={link.href} label={link.label} />
            </li>
          ))}
        </ul>
      </header>
      <div className="h-20" />
    </>
  );
}
