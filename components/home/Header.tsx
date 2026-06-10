"use client";
import { inter } from "@/lib/fonts";
import { HOME_LINKS } from "@/utils/links";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import SmallNavMenu from "./SmallNavMenu";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="w-full px-4 md:px-6 xl:px-8 py-4">
      <div className="flex items-center justify-between">
        {/* LOGO */}
        <Link href={"/"} className={`${inter.className} font-bold text-lg`}>
          SERVI <span className="text-primary">ADS.</span>
        </Link>

        {/* LINKS */}
        <nav className="lg:flex items-center hidden gap-4">
          {HOME_LINKS.map((link) => {
            const isPathname = link.href === pathname;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`hover:text-primary/60 hover:underline text-sm font-medium underline-offset-2
                    transition-all ease-in-out duration-300
                ${isPathname ? " text-primary " : ""}
                `}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* ACTION BUTTONS */}
        <div className="lg:flex items-center hidden gap-4">
          <Button variant={"link"}>Connexion</Button>
          <Button>
            <Link href={"/nouvelle-campagne"}>Créer une campagne</Link>
          </Button>
        </div>

        {/* SMALL MENU */}
        <div className="lg:hidden">
          <SmallNavMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
