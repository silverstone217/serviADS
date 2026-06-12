"use client";
import { inter } from "@/lib/fonts";
import Link from "next/link";
import React from "react";
import SmallNavMenu from "./SmallNavMenu";

const Header = () => {
  return (
    <header className="lg:hidden">
      <div className="py-4 px-4 md:px-6 lg:px-8 flex items-center justify-between border-b-2 border-muted bg-muted">
        <Link href={"/"} className={`${inter.className} font-bold text-xl`}>
          SERVI <span className="text-primary">ADS.</span>
        </Link>
        <SmallNavMenu />
      </div>
    </header>
  );
};

export default Header;
