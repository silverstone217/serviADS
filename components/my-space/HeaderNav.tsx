"use client";
import { DASHBOARD_LINKS } from "@/utils/links";
import Link from "next/link";
import { usePathname } from "next/navigation";

import React from "react";

const HeaderNav = () => {
  const pathname = usePathname();

  return (
    <div className="w-full p-4 md:px-6 xl:px-8 gap-4 max-w-sm lg:max-w-md mx-auto">
      <div className="border p-4 grid grid-cols-2 rounded-lg gap-4">
        {DASHBOARD_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`p-2 rounded-lg ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"}
                flex items-center gap-2 text-sm font-medium transition-colors duration-300 justify-center
                `}
            >
              <Icon />{" "}
              <span className="capitalize md:block hidden">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default HeaderNav;
