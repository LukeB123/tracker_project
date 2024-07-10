"use client";

import { useRouter, usePathname } from "next/navigation";
import Button from "@/app/_components/buttons/button";

interface NavButtonParams {
  path: string;
  href: string;
  label: string;
}

export default function NavButton({ path, href, label }: NavButtonParams) {
  const router = useRouter();

  return (
    <button
      type="button"
      className="bg-blue-400 hover:bg-blue-500 text-grey-50 rounded-md min-w-20 min-h-10 p-2"
      onClick={() => router.push(path + href)}
    >
      {label}
    </button>
  );
}
