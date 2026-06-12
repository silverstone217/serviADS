"use client";
import { useGetUser } from "@/hooks/user";
import { inter } from "@/lib/fonts";
import { ADMINS_LINKS } from "@/utils/links";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "../ui/button";
import UserAvatar from "../UserAvatar";
import AuthComponent from "../auth/AuthComponent";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

const Aside = () => {
  const pathname = usePathname();
  const { user } = useGetUser();

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogOut = async () => {
    try {
      setLoading(true);
      await signOut({ redirect: false }); // Évite les rechargements brutaux du navigateur
      toast.success("Vous avez été déconnecté avec succès !");
      router.refresh();
      location.reload();
    } catch (error) {
      console.error("ERREUR_DECONNEXION:", error);
      toast.error("Une erreur s'est produite, impossible de vous déconnecter.");
    } finally {
      setLoading(false);
    }
  };

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

      <div className="p-4 space-y-2">
        {user ? (
          <div className="flex flex-col gap-3 w-full">
            <Link href={"/profil"} className="flex items-center gap-2.5">
              <UserAvatar image={user.image} name={user.name} />
              <div className="">
                <h3 className="capitalize font-semibold">{user.name}</h3>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </Link>

            <Button
              variant={"destructive"}
              className="w-full"
              onClick={handleLogOut}
              disabled={loading}
            >
              Deconnexion
            </Button>
          </div>
        ) : (
          <AuthComponent />
        )}
      </div>
    </aside>
  );
};

export default Aside;
