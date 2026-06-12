"use client";

import Link from "next/link";
import { ShieldX, LockKeyhole, Home } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";

interface AdminAccessDeniedProps {
  type: "unauthenticated" | "unauthorized";
}

export default function AdminAccessDenied({ type }: AdminAccessDeniedProps) {
  const isUnauthenticated = type === "unauthenticated";

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
    <div
      className="min-h-screen flex items-center justify-center 
    bg-linear-to-b from-background via-background to-muted/20 p-6"
    >
      <div
        className="
          w-full
          max-w-lg
          animate-in
          fade-in
          zoom-in-95
          duration-300
        "
      >
        <Card className="shadow-xl border">
          <CardContent className="p-10">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
                {isUnauthenticated ? (
                  <LockKeyhole className="h-10 w-10 text-destructive" />
                ) : (
                  <ShieldX className="h-10 w-10 text-destructive" />
                )}
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                  {isUnauthenticated ? "Connexion requise" : "Accès refusé"}
                </h1>

                <p className="text-muted-foreground leading-relaxed">
                  {isUnauthenticated
                    ? "Vous devez être connecté pour accéder à cette section d'administration."
                    : "Votre compte ne possède pas les autorisations nécessaires pour accéder à cette page."}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                {isUnauthenticated ? (
                  <Button
                    className="flex-1"
                    onClick={() => handleSignIn("google")}
                    disabled={loading}
                    variant={"outline"}
                  >
                    <FcGoogle size={20} />
                    <span className="ml-2">Continuer avec Google</span>
                  </Button>
                ) : (
                  <Button asChild className="flex-1">
                    <Link href="/">
                      <Home className="mr-2 h-4 w-4" />
                      Retour à l&apos;accueil
                    </Link>
                  </Button>
                )}

                <Button asChild variant="outline" className="flex-1">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Accueil
                  </Link>
                </Button>
              </div>

              <div className="w-full rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
                Si vous pensez qu&apos;il s&apos;agit d&apos;une erreur,
                contactez un administrateur de la plateforme.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
