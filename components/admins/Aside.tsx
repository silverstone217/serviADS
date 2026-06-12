"use client";
import { inter } from "@/lib/fonts";
import { ADMINS_LINKS } from "@/utils/links";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Aside = () => {
  const pathname = usePathname();
  return (
    <aside
      className="hidden lg:flex w-48 h-full bg-muted border-r border-muted
    pb-4 flex-col
    "
    >
      {/* HEADER */}
      <div className="px-4 py-8">
        <Link href={"/"} className={`${inter.className} font-bold text-xl`}>
          SERVI <span className="text-primary">ADS.</span>
        </Link>
      </div>

      {/* CONTENTS */}
      <div className="py-8 border-y  flex flex-col gap-2 flex-1 px-2">
        {ADMINS_LINKS.map((link) => {
          const isActive = link.href === pathname;

          return (
            <Link
              href={link.href}
              key={link.href}
              className={`flex items-center gap-2 p-2 text-sm font-medium
                ${isActive ? "bg-primary" : ""} hover:bg-primary/70
                rounded
                `}
            >
              <link.icon size={20} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>

      {/* FOOTER */}
      <div></div>
    </aside>
  );
};

export default Aside;
