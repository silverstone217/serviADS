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
import { LogOut, Loader2 } from "lucide-react"; // Ajout d'icônes pour le bouton déconnexion

const Aside = () => {
  const pathname = usePathname();
  const { user } = useGetUser();

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogOut = async () => {
    try {
      setLoading(true);
      await signOut({ redirect: false });
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
    <aside className="hidden lg:flex w-60 h-screen bg-background border-r border-border pb-6 flex-col sticky top-0">
      {/* HEADER / LOGO */}
      <div className="px-6 h-16 flex items-center border-b border-border">
        <Link
          href={"/"}
          className={`${inter.className} font-bold text-xl tracking-tight hover:opacity-90 transition-opacity flex items-center gap-1`}
        >
          SERVI<span className="text-primary">ADS.</span>
        </Link>
      </div>

      {/* NAVIGATION LINKS */}
      <div className="flex-1 py-6 flex flex-col gap-1 px-3 overflow-y-auto">
        <span className="px-3 mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Menu Principal
        </span>

        {ADMINS_LINKS.map((link) => {
          const isActive = link.href === pathname;

          return (
            <Link
              href={link.href}
              key={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group
                ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              <link.icon
                size={18}
                className={`transition-colors duration-200 
                  ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}
              />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>

      {/* FOOTER / USER PROFILE */}
      <div className="px-4 pt-4 border-t border-border flex flex-col gap-4">
        {user ? (
          <div className="flex flex-col gap-4 w-full">
            {/* Profil Link */}
            <Link
              href={"/profil"}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/60 transition-colors min-w-0 group"
            >
              <UserAvatar image={user.image} name={user.name} />
              <div className="flex flex-col min-w-0">
                <h3 className="capitalize font-semibold text-sm text-foreground truncate">
                  {user.name}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </Link>

            {/* Logout Button */}
            <Button
              variant="destructive"
              className="w-full justify-start gap-2 h-10
              rounded-xl transition-all font-medium text-sm"
              onClick={handleLogOut}
              disabled={loading}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <LogOut size={16} />
              )}
              <span>{loading ? "Déconnexion..." : "Déconnexion"}</span>
            </Button>
          </div>
        ) : (
          <div className="px-2">
            <AuthComponent />
          </div>
        )}
      </div>
    </aside>
  );
};

export default Aside;
