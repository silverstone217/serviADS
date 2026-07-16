import { redirect } from "next/navigation";
import { Calendar, Clock3, DollarSign, FileAudio, Users } from "lucide-react";

import { getAudioCampaignById } from "@/actions/campaign";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { getCampaignStatus } from "@/utils/campaign";
import SubscribersList from "@/components/admins/campaigns/SubscribersList";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const statusVariant = {
  en_cours: "default",
  enregistrement: "secondary",
  terminee: "destructive",
} as const;

const statusLabel = {
  en_cours: "En cours",
  enregistrement: "Enregistrement",
  terminee: "Terminée",
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    redirect("/admins");
  }

  const campaign = await getAudioCampaignById(id);

  if (!campaign) {
    redirect("/admins");
  }

  const status = getCampaignStatus(campaign);

  const endDate = new Date(campaign.startDate);
  endDate.setDate(endDate.getDate() + campaign.duration);

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* HEADER */}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>

          <p className="text-muted-foreground mt-1">
            Détails de la campagne audio
          </p>
        </div>

        <Badge
          variant={statusVariant[status]}
          className="w-fit px-4 py-1 text-sm"
        >
          {statusLabel[status]}
        </Badge>
      </div>

      {/* INFOS */}

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <div className="flex items-center gap-3">
              <Calendar className="size-5 text-primary" />

              <div>
                <p className="text-sm text-muted-foreground">Début</p>

                <p className="font-medium">
                  {campaign.startDate.toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="size-5 text-primary" />

              <div>
                <p className="text-sm text-muted-foreground">Fin</p>

                <p className="font-medium">
                  {endDate.toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock3 className="size-5 text-primary" />

              <div>
                <p className="text-sm text-muted-foreground">Durée</p>

                <p className="font-medium">{campaign.duration} jours</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DollarSign className="size-5 text-primary" />

              <div>
                <p className="text-sm text-muted-foreground">Prix / audio</p>

                <p className="font-medium">{campaign.costPerAudio} $</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FileAudio className="size-5 text-primary" />

              <div>
                <p className="text-sm text-muted-foreground">Durée maximale</p>

                <p className="font-medium">{campaign.audioMaxDuration} sec</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="size-5 text-primary" />

              <div>
                <p className="text-sm text-muted-foreground">Souscriptions</p>

                <p className="font-medium">
                  {campaign.audioSubscribers.length}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* STATS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="flex flex-col gap-1 p-6">
            <span className="text-muted-foreground text-sm">
              Total souscriptions
            </span>

            <span className="text-3xl font-bold">
              {campaign.audioSubscribers.length}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-1 p-6">
            <span className="text-muted-foreground text-sm">
              Revenus estimés
            </span>

            <span className="text-3xl font-bold">
              $
              {(
                campaign.audioSubscribers.length * campaign.costPerAudio
              ).toFixed(2)}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-1 p-6">
            <span className="text-muted-foreground text-sm">Audios reçus</span>

            <span className="text-3xl font-bold">
              {campaign.audioSubscribers.filter((s) => !!s.audioFile).length}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-1 p-6">
            <span className="text-muted-foreground text-sm">
              Audios manquants
            </span>

            <span className="text-3xl font-bold">
              {campaign.audioSubscribers.filter((s) => !s.audioFile).length}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* LIST */}

      <SubscribersList subscribers={campaign.audioSubscribers} />
    </div>
  );
}
