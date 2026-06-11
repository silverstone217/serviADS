import { getUser } from "@/actions/user";
import AuthComponent from "@/components/auth/AuthComponent";
import HeaderNav from "@/components/my-space/HeaderNav";
import UserAvatar from "@/components/UserAvatar";
import { inter } from "@/lib/fonts";
import { Undo2 } from "lucide-react";
import Link from "next/link";
import React from "react";

interface MonEspaceLayoutProps {
  children: React.ReactNode;
}

async function MonEspaceLayout({ children }: MonEspaceLayoutProps) {
  const user = await getUser();

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
          {user ? (
            <UserAvatar image={user.image} name={user.name} />
          ) : (
            <AuthComponent />
          )}
        </div>
      </header>

      {/* SECOND HEADER */}
      <div className="py-4">
        <HeaderNav />
      </div>

      <main>{children}</main>
    </div>
  );
}

export default MonEspaceLayout;
