"use client";

import React, { useState, useRef, useEffect } from "react";
import { inter } from "@/lib/fonts";
import { useRouter } from "next/navigation";
import {
  Play,
  Pause,
  Calendar,
  Car,
  DollarSign,
  Phone,
  Building2,
  MapPin,
  Clock,
  Trash2,
  Loader2,
  ChevronLeft,
  CheckCircle2,
  Radio,
  Clock3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "sonner";
import { AudioCampaign, AudioSubscriber } from "@/lib/generated/prisma/client";

type SubscriptionWithCampaign = AudioSubscriber & {
  audioCampaign: AudioCampaign;
};

type Props = {
  subscription: SubscriptionWithCampaign;
};

export default function SubscriptionDetailsClient({ subscription }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Audio Player States
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialisation de l'élément Audio
  useEffect(() => {
    if (subscription.audioFile) {
      audioRef.current = new Audio(subscription.audioFile);

      const handleEnded = () => setIsPlaying(false);
      audioRef.current.addEventListener("ended", handleEnded);

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeEventListener("ended", handleEnded);
        }
      };
    }
  }, [subscription.audioFile]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        toast.error("Impossible de lire le fichier audio.");
      });
    }
    setIsPlaying(!isPlaying);
  };

  const startDate = new Date(subscription.audioCampaign.startDate);

  const endDate = new Date(startDate);

  endDate.setDate(endDate.getDate() + subscription.audioCampaign.duration * 7);

  const now = new Date();

  const isUpcoming = now < startDate;

  const isOngoing = now >= startDate && now < endDate;

  const isFinished = now >= endDate;

  const canCancel = isUpcoming || isOngoing;

  const handleCancel = async () => {
    try {
      setLoading(true);

      // Simulez ou appelez votre Server Action de suppression/annulation
      // const result = await cancelSubscription(subscription.id);

      // Simulation d'attente réseau :
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("La souscription a été annulée avec succès.");
      router.push("/audio/mes-campagnes"); // Redirection vers la liste des souscriptions
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'annulation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Bouton Retour */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Retour
      </Button>

      {/* En-tête principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div>
          <h1
            className={`text-3xl font-extrabold tracking-tight ${inter.className}`}
          >
            Détails de la Souscription
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            ID Référence :{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">
              {subscription.id}
            </code>
          </p>
        </div>
        <div>
          {isUpcoming && (
            <Badge variant="secondary" className="gap-1">
              <Clock3 className="h-3 w-3" />
              Commence bientôt
            </Badge>
          )}

          {isOngoing && (
            <Badge className="bg-green-600 gap-1">
              <Radio className="h-3 w-3" />
              En cours
            </Badge>
          )}

          {isFinished && (
            <Badge variant="outline" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Terminée
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Infos de l'entreprise & Client */}
        <Card className="md:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Informations Générales
            </CardTitle>
            <CardDescription>
              Données d&apos;identification fournies lors de l&apos;inscription.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Entreprise
              </span>
              <p className="text-base font-semibold text-foreground capitalize">
                {subscription.companyName || "Non spécifié"}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Téléphone client
              </span>
              <p className="text-base font-semibold text-foreground flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {subscription.clientPhone}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Zone de diffusion
              </span>
              <p className="text-base font-semibold text-foreground flex items-center gap-1.5 capitalize">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {subscription.zone}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Campagne parente
              </span>
              <p className="text-base font-semibold text-blue-600 capitalize">
                {subscription.audioCampaign.name}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Lecteur Audio Intégré */}
        <Card className="shadow-sm flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Spot Publicitaire
            </CardTitle>
            <CardDescription>
              Durée : {subscription.audioDuration} secondes
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pb-6 flex-1">
            {subscription.audioFile ? (
              <Button
                type="button"
                onClick={togglePlayPause}
                size="lg"
                className={`h-16 w-16 rounded-full shadow-md transition-all ${
                  isPlaying
                    ? "bg-amber-500 hover:bg-amber-600 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6 fill-current" />
                ) : (
                  <Play className="h-6 w-6 fill-current ml-0.5" />
                )}
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground italic text-center">
                Aucun fichier audio associé
              </p>
            )}
            <p className="mt-3 text-xs font-medium text-muted-foreground">
              {isPlaying ? "Lecture en cours..." : "Cliquez pour écouter"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Résumé Financier et Métriques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Car className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Véhicules Cibles
              </p>
              <p className="text-xl font-bold">
                {subscription.taxiNumber} taxi(s)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Durée totale
              </p>
              <p className="text-xl font-bold">
                {subscription.audioCampaign.duration} semaine(s)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-muted/30 border-dashed">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-blue-900 text-white rounded-xl">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Total Facturé
              </p>
              <p className="text-xl font-black text-blue-900">
                ${subscription.price.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section Planification des Dates & Zone d'Action critique */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-muted/40 border">
        <div className="text-sm text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">Début :</span>
            <span>
              {startDate.toLocaleDateString("fr-FR", { dateStyle: "long" })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">Fin estimée :</span>
            <span>
              {endDate.toLocaleDateString("fr-FR", { dateStyle: "long" })}
            </span>
          </div>
        </div>

        {/* Alerte et bouton d'annulation */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="w-full sm:w-auto gap-2 rounded-xl"
              disabled={!canCancel || loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Annuler la souscription
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Cela annulera définitivement la
                diffusion de votre spot audio sur les{" "}
                <strong>{subscription.taxiNumber} taxis</strong> sélectionnés
                pour cette campagne.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">
                Retour
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancel}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl"
              >
                Confirmer l&apos;annulation
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Note d'information si l'annulation est bloquée */}
      {!canCancel && (
        <p className="text-center text-xs text-muted-foreground italic">
          * L&apos;annulation est uniquement disponible lorsque la campagne la
          campagne est en cours ou n&apos;a pas debutee.
        </p>
      )}
    </div>
  );
}
