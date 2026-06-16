"use client";

import React, { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";

interface DeleteCampaignDialogProps {
  campaignName: string;
  onConfirm: () => Promise<void>;
}

export default function DeleteCampaignDialog({
  campaignName,
  onConfirm,
}: DeleteCampaignDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async (e: React.MouseEvent) => {
    // Empêche la fermeture immédiate du Dialog pour afficher le loader pendant l'action asynchrone
    e.preventDefault();
    try {
      setIsDeleting(true);
      await onConfirm();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      {/* Le bouton déclencheur hérite exactement du style initial */}
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
          disabled={isDeleting}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Supprimer
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Confirmer la suppression
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground pt-2">
            Êtes-vous sûr de vouloir supprimer la campagne{" "}
            <span className="font-semibold text-foreground capitalize">
              « {campaignName} »
            </span>{" "}
            ? Cette action est irréversible et effacera toutes les données
            associées.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 gap-4 sm:gap-0 flex flex-wrap items-center">
          <AlertDialogCancel className="rounded-xl h-10 font-medium">
            Annuler
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive rounded-xl h-10 font-medium flex items-center gap-2 md:ml-4"
            disabled={isDeleting}
            variant={"destructive"}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Suppression...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Supprimer définitivement
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
