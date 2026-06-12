"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { Button } from "./ui/button";

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
    <div className="container mx-auto max-w-lg w-full p-6 flex flex-col gap-6">
      <div className="w-full flex flex-col items-center justify-center gap-2">
        <h1 className="text-center w-full text-2xl font-bold">
          Connectez-vous
        </h1>
        <p className="text-center w-full text-sm text-muted-foreground">
          Continuez pour accéder à votre compte et profiter de toutes les
          fonctionnalités de notre application.
        </p>
      </div>

      <div className="grid gap-3">
        {providers.map((provider) => (
          <Button
            key={provider.name}
            variant="outline"
            className={`text-primary hover:text-primary/70 hover:bg-transparent
              transition-all ease-in-out duration-300
                ${provider.disabled ? "cursor-not-allowed opacity-50" : ""}
                ${!loading ? "animate-pulse" : ""}
              `}
            disabled={provider.disabled}
            onClick={() =>
              handleSignIn(provider.name.toLowerCase() as "google" | "facebook")
            }
          >
            {provider.icon}
            <span className="ml-2">Continuer avec {provider.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AuthComponent;
