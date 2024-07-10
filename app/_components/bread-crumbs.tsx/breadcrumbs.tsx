"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NextBreadcrumb() {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path !== "");

  return (
    <>
      <div className="bg-purple-800 text-grey-200 fixed z-30 w-full">
        <ul className="flex gap-4 px-4 py-1 items-center">
          {pathNames.map((link, index) => {
            let href = `/${pathNames.slice(0, index + 1).join("/")}`;

            return (
              <div key={index} className="flex gap-4 uppercase text-sm">
                <li>
                  <Link href={href} className="hover:text-grey-50">
                    {link.replaceAll("-", " ")}
                  </Link>
                </li>
                {pathNames.length !== index + 1 && <li>{">"}</li>}
              </div>
            );
          })}
        </ul>
      </div>
      <div className="h-6" />
    </>
  );
}
