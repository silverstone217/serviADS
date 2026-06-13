"use client";

import React, { useMemo, useState } from "react";
import NewCampaingForm from "./NewCampaingForm";
import { AudioCampaign } from "@/lib/generated/prisma/client";
import {
  Search,
  SlidersHorizontal,
  Trash2,
  Calendar,
  DollarSign,
  Clock,
} from "lucide-react";

// Importations des composants Shadcn UI
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ModifyCampaign from "./ModifyCampaign";
import { deleteAudioCampaignById } from "@/actions/campaign";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CampaignStatus } from "@/types/campaign";
import { getCampaignStatus } from "@/utils/campaign";

interface AudioMainComponentProps {
  audioCampaigns: AudioCampaign[];
}

const MainComponent = ({ audioCampaigns }: AudioMainComponentProps) => {
  const [status, setStatus] = useState<string>("all");
  const [searchText, setSearchText] = useState<string>("");

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Filtrage optimisé et insensible à la casse
  const filteredCampaigns = useMemo(() => {
    return audioCampaigns
      .filter((camp) =>
        camp.name.toLowerCase().includes(searchText.toLowerCase().trim()),
      )
      .filter((camp) =>
        status !== "all" ? getCampaignStatus(camp) === status : true,
      );
  }, [audioCampaigns, searchText, status]);

  // Configuration des styles de badges selon le statut
  const BADGE_CONFIG: Record<
    CampaignStatus,
    { label: string; className: string }
  > = {
    enregistrement: {
      label: "Pré-enregistrement",
      className:
        "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-800",
    },

    en_cours: {
      label: "En diffusion",
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
    },

    terminee: {
      label: "Terminée",
      className:
        "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
    },
  };

  const getStatusBadge = (campaign: AudioCampaign) => {
    const status = getCampaignStatus(campaign);

    const config = BADGE_CONFIG[status];

    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  // Formateur pour les devises
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("us-EN", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // const handleEdit = (id: string) => {
  //   console.log("Modifier la campagne :", id);
  // };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);

      const result = await deleteAudioCampaignById(id);
      if (result.error) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    } catch (error) {
      console.error("ERROR ON deleting CAMP", error);
      toast.error("Impossible continuer sur cette action!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* SECTION FILTRES & DASHBOARD CONTROLS */}
      <div
        className="flex flex-col md:flex-row gap-4 justify-between items-stretch 
      md:items-center bg-card p-4 rounded-xl border shadow-sm"
      >
        <div className="flex flex-wrap flex-1 gap-3 items-center">
          {/* RECHERCHE */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher une campagne..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* FILTRE STATUT */}
          <div className="w-full sm:max-w-xs">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full pl-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Tous les statuts" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>

                <SelectItem value="enregistrement">
                  Pré-enregistrement
                </SelectItem>

                <SelectItem value="en_cours">En diffusion</SelectItem>

                <SelectItem value="terminee">Terminée</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* BOUTON NOUVELLE CAMPAGNE */}
        <div className="w-full md:w-auto flex justify-end">
          <NewCampaingForm />
        </div>
      </div>

      {/* LISTE DES CAMPAGNES */}
      {filteredCampaigns.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-2xl bg-muted/20">
          <p className="text-muted-foreground text-sm">
            Aucune campagne audio trouvée.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((camp) => (
            <Card
              key={camp.id}
              className="group flex flex-col overflow-hidden hover:shadow-md transition-all duration-200"
            >
              {/* Header Card : Titre & Badge */}
              <CardHeader className="p-6 pb-4 space-y-0 flex flex-row items-start justify-between gap-4">
                <CardTitle
                  className="text-lg tracking-tight group-hover:text-primary transition-colors line-clamp-2
                capitalize
                "
                >
                  {camp.name}
                </CardTitle>
                <div className="shrink-0">{getStatusBadge(camp)}</div>
              </CardHeader>

              <hr className="mx-6 border-border" />

              {/* Contenu : Métriques / Caractéristiques */}
              <CardContent className="p-6 pt-4 flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 text-muted-foreground/70" />
                    <span>{camp.duration} min</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4 text-muted-foreground/70" />
                    <span>{formatCurrency(camp.costPerAudio)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {/* Date de création */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground/80 pt-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      Créé le{" "}
                      {new Date(camp.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      Début :{" "}
                      {new Date(camp.startDate).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              </CardContent>

              {/* Footer Card : Actions */}
              <CardFooter className="bg-muted/30 px-6 py-3 border-t flex justify-end items-center gap-2">
                <ModifyCampaign audioCampaign={camp} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(camp.id)}
                  className="h-8 text-xs gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  disabled={loading}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Supprimer
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MainComponent;
