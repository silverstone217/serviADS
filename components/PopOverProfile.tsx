"use client";

import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import Link from "next/link";
import { useGetUser } from "@/hooks/user";
import UserAvatar from "./UserAvatar";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { LogOut, User, Loader2 } from "lucide-react";

export default function PopOverProfile() {
  const { user } = useGetUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!user) return null;

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
    <Popover>
      <PopoverTrigger asChild>
        <button className="rounded-full transition-transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-hidden">
          <UserAvatar name={user.name} image={user.image} />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-64 p-2 rounded-xl"
        align="end"
        sideOffset={8}
      >
        {/* EN-TÊTE UTILISATEUR PRO */}
        <div className="flex flex-col px-3 py-2.5 text-sm">
          <p className="font-semibold text-foreground truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {user.email || "Mon compte"}
          </p>
        </div>

        <hr className="my-1 border-muted" />

        {/* LIENS ET ACTIONS */}
        <div className="flex flex-col gap-0.5">
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start gap-2 h-9 text-sm text-muted-foreground hover:text-foreground font-medium rounded-lg"
          >
            <Link href="/profil">
              <User className="h-4 w-4 shrink-0" />
              <span>Mon profil</span>
            </Link>
          </Button>

          <Button
            onClick={handleLogOut}
            disabled={loading}
            variant="ghost"
            className="w-full justify-start gap-2 h-9 text-sm font-medium rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            ) : (
              <LogOut className="h-4 w-4 shrink-0" />
            )}
            <span>{loading ? "Déconnexion..." : "Se déconnecter"}</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
