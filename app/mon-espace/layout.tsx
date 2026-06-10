import { Button } from "@/components/ui/button";
import { inter } from "@/lib/fonts";
import { Undo2 } from "lucide-react";
import Link from "next/link";
import React from "react";

interface MonEspaceLayoutProps {
  children: React.ReactNode;
}

function MonEspaceLayout({ children }: MonEspaceLayoutProps) {
  return (
    <div>
      <header className="">
        <div className="flex items-center justify-between p-4 md:px-6 xl:px-8 border-b">
          <Link
            href={"/"}
            className="text-secondary hover:text-foreground ease-in-out duration-300 transition-all"
          >
            <Undo2 />
          </Link>
          <h2 className={`text-xl font-bold ${inter.className}`}>Mon Espace</h2>
          <Button variant={"ghost"} className="text-primary" size={"sm"}>
            <Link href={"/connexion"}>Connexion</Link>
          </Button>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}

export default MonEspaceLayout;
