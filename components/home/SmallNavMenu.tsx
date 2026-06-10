"use client";
import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { HOME_LINKS } from "@/utils/links";
import { inter } from "@/lib/fonts";
import { usePathname } from "next/navigation";

const SmallNavMenu = () => {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger className="flex flex-col gap-1.5 items-center justify-center">
        {[0, 1].map((index) => (
          <div key={index} className="w-10 h-1 bg-gray-600"></div>
        ))}
      </SheetTrigger>
      <SheetContent className="min-w-[80%] flex flex-col h-full overflow-x-hidden overflow-y-auto gap-4">
        <SheetHeader>
          <SheetTitle className={`${inter.className} font-bold text-xl`}>
            SERVI <span className="text-primary">ADS.</span>
          </SheetTitle>
          <SheetDescription>Votre plateforme preferee</SheetDescription>
        </SheetHeader>

        <div className="py-4 border-y flex flex-col w-full px-4">
          {HOME_LINKS.map((link) => {
            const isPathname = link.href === pathname;
            return (
              <SheetClose key={link.name} asChild>
                <Link
                  href={link.href}
                  className={`hover:bg-primary/80 text-sm font-medium px-4 py-3
                    rounded-md transition-all ease-in-out duration-300
                     ${isPathname ? "bg-primary " : ""}
                    `}
                >
                  {link.name}
                </Link>
              </SheetClose>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SmallNavMenu;
