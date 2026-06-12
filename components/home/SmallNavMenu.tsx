"use client";
import React, { useState } from "react";
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
import { usePathname, useRouter } from "next/navigation";
import { useGetUser } from "@/hooks/user";
import UserAvatar from "../UserAvatar";
import AuthComponent from "../auth/AuthComponent";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

const SmallNavMenu = () => {
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
    <Sheet>
      <SheetTrigger className="flex flex-col gap-1.5 items-center justify-center">
        {[0, 1].map((index) => (
          <div key={index} className="w-10 h-1 bg-gray-600"></div>
        ))}
      </SheetTrigger>
      <SheetContent
        className="min-w-[80%] flex flex-col h-full overflow-x-hidden overflow-y-auto gap-4
      border-muted
      "
      >
        <SheetHeader>
          <SheetTitle className={`${inter.className} font-bold text-xl`}>
            SERVI <span className="text-primary">ADS.</span>
          </SheetTitle>
          <SheetDescription>Votre plateforme preferée</SheetDescription>
        </SheetHeader>

        <div className="py-8 border-y flex flex-col w-full px-4 flex-3/5 border-muted gap-2">
          {HOME_LINKS.map((link) => {
            const isPathname = link.href === pathname;
            return (
              <SheetClose key={link.name} asChild>
                <Link
                  href={link.href}
                  className={`hover:bg-primary/80 text-sm font-medium px-4 py-3
                    rounded-md transition-all ease-in-out duration-300
                     ${isPathname ? "bg-primary " : ""}
                     flex items-center gap-2 justify-start
                    `}
                >
                  <link.icon /> {link.name}
                </Link>
              </SheetClose>
            );
          })}
        </div>

        {/* ACTIONS */}
        <div className="w-full p-4 flex items-center justify-center">
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
                disabled={loading}
                onClick={handleLogOut}
              >
                Deconnexion
              </Button>
            </div>
          ) : (
            <AuthComponent />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SmallNavMenu;
