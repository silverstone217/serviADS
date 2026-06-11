"use client";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

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

const AuthComponent = () => {
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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary/70 hover:bg-transparent
          transition-all ease-in-out duration-300"
        >
          Connexion
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="w-full flex flex-col items-center justify-center gap-2">
          <AlertDialogTitle className="text-center w-full text-2xl font-bold">
            Connectez-vous
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center w-full text-sm text-muted-foreground">
            Continuez pour accéder à votre compte et profiter de toutes les
            fonctionnalités de notre application.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid gap-3">
          {providers.map((provider) => (
            <AlertDialogAction asChild key={provider.name}>
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
            </AlertDialogAction>
          ))}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          {/* <AlertDialogAction>Continue</AlertDialogAction> */}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AuthComponent;
