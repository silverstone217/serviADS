"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

interface AuthDialogProps {
  openAuthDialog: boolean;
  setOpenAuthDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const providers = [
  {
    name: "Google",
    icon: <FcGoogle size={20} />,
    disabled: false,
  },
  {
    name: "Facebook",
    icon: <FaFacebook size={20} color="#1877F2" />,
    disabled: true, // Désactiver le bouton Facebook
  },
];

const AuthDialog = ({ openAuthDialog, setOpenAuthDialog }: AuthDialogProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (providerName: "google" | "facebook") => {
    try {
      setLoading(true);
      await signIn(providerName);
      toast.success("Connexion réussie !");
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      toast.error(
        "Une erreur est survenue lors de la connexion. Veuillez réessayer.",
      );
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  return (
    <Dialog onOpenChange={setOpenAuthDialog} open={openAuthDialog}>
      {/* <DialogTrigger>Open</DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle> Connectez-vous</DialogTitle>
          <DialogDescription>
            Continuez pour accéder à votre compte et profiter de toutes les
            fonctionnalités de notre application.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          {providers.map((provider) => (
            <DialogClose asChild key={provider.name}>
              <Button
                //   key={provider.name}
                variant="outline"
                className={`text-primary hover:text-primary/70 hover:bg-transparent
              transition-all ease-in-out duration-300
                ${provider.disabled ? "cursor-not-allowed opacity-50" : ""}
                ${!loading ? "animate-pulse" : ""}
              `}
                disabled={provider.disabled}
                onClick={() =>
                  handleSignIn(
                    provider.name.toLowerCase() as "google" | "facebook",
                  )
                }
              >
                {provider.icon}
                <span className="ml-2">Continuer avec {provider.name}</span>
              </Button>
            </DialogClose>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
