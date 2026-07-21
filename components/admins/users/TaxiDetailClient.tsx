"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  UserX,
  UserCheck,
  Clock,
  Gauge,
  Activity,
  AlertTriangle,
  Radio,
  Download,
  DollarSign,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toggleBanTaxi } from "@/actions/users";

// Types Prisma
export interface AudioLogType {
  id: string;
  campaignId: string;
  taxiUserId: string;
  avgSpeed: number;
  totalDuration: number;
  date: Date | string;
  createdAt: Date | string;
}

export interface TaxiCampaignConfigType {
  id: string;
  campaignId: string;
  taxiUserId: string;
  downloadedSounds: number;
  amount: number;
  isPaid: boolean;
  paidAt?: Date | string | null;
  createdAt: Date | string;
}

export interface TaxiDetailType {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  phone: string;
  isBanned: boolean;
  banReason: string | null;
  banExpiresAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  logs: AudioLogType[];
  taxiConfigs: TaxiCampaignConfigType[];
}

interface Props {
  taxi: TaxiDetailType;
}

function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) return `${hrs}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

export default function TaxiDetailClient({ taxi }: Props) {
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [banReason, setBanReason] = useState(taxi.banReason || "");
  const [banExpiresAt, setBanExpiresAt] = useState<string>(
    taxi.banExpiresAt
      ? new Date(taxi.banExpiresAt).toISOString().split("T")[0]
      : "",
  );

  const initials = taxi.name
    ? taxi.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "T";

  // Calculs des KPIs Globaux
  const totalLogs = taxi.logs?.length || 0;
  const totalSeconds = (taxi.logs || []).reduce(
    (acc, log) => acc + log.totalDuration,
    0,
  );
  const avgSpeedGlobal =
    totalLogs > 0
      ? Math.round(
          (taxi.logs || []).reduce((acc, log) => acc + log.avgSpeed, 0) /
            totalLogs,
        )
      : 0;

  // Calculs relatifs aux TaxiCampaignConfig
  const totalDownloadedSounds = (taxi.taxiConfigs || []).reduce(
    (acc, config) => acc + config.downloadedSounds,
    0,
  );

  const totalAmount = (taxi.taxiConfigs || []).reduce(
    (acc, config) => acc + config.amount,
    0,
  );

  // Gestion du bannissement
  const handleToggleBan = () => {
    startTransition(async () => {
      const res = await toggleBanTaxi({
        id: taxi.id,
        isBanned: !taxi.isBanned,
        banReason: !taxi.isBanned ? banReason : undefined,
        banExpiresAt:
          !taxi.isBanned && banExpiresAt ? new Date(banExpiresAt) : null,
      });

      if (res.success) {
        setDialogOpen(false);
      }
    });
  };

  return (
    <div className="flex flex-col gap-y-8 w-full max-w-7xl mx-auto p-4 md:p-6">
      {/* BOUTON RETOUR */}
      <div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <Link href="/admins/utilisateurs">
            <ArrowLeft size={16} />
            <span>Retour à la liste</span>
          </Link>
        </Button>
      </div>

      {/* HEADER DE DÉTAIL TAXI */}
      <Card
        className={`border ${taxi.isBanned ? "border-destructive/40 bg-destructive/5" : "bg-card"}`}
      >
        <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20 border-2 border-border shadow-sm">
              <AvatarImage
                src={taxi.image || undefined}
                alt={taxi.name || "Taxi"}
              />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground">
                  {taxi.name || "Conducteur Taxi"}
                </h1>
                {taxi.isBanned ? (
                  <Badge
                    variant="destructive"
                    className="flex items-center gap-1"
                  >
                    <UserX size={12} /> Banni
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                  >
                    <UserCheck size={12} className="mr-1" /> Actif
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                <div className="flex items-center gap-1.5">
                  <Mail size={14} className="text-primary" />
                  <span>{taxi.email || "Non renseigné"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone size={14} className="text-primary" />
                  <span>{taxi.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs opacity-80">
                  <Calendar size={14} />
                  <span>
                    Inscrit le{" "}
                    {new Date(taxi.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BANNISSEMENT */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant={taxi.isBanned ? "default" : "destructive"}
                className="gap-2 shrink-0 self-stretch md:self-auto"
              >
                {taxi.isBanned ? (
                  <>
                    <UserCheck size={16} />
                    <span>Débannir le taxi</span>
                  </>
                ) : (
                  <>
                    <UserX size={16} />
                    <span>Bannir le taxi</span>
                  </>
                )}
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-106.25">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle
                    className={
                      taxi.isBanned ? "text-emerald-500" : "text-destructive"
                    }
                    size={20}
                  />
                  <span>
                    {taxi.isBanned
                      ? "Confirmer le débannissement"
                      : "Bannir le compte Taxi"}
                  </span>
                </DialogTitle>
                <DialogDescription>
                  {taxi.isBanned
                    ? "Souhaitez-vous lever les restrictions pour ce conducteur ?"
                    : "Cette action empêchera le chauffeur d'interagir avec la plateforme."}
                </DialogDescription>
              </DialogHeader>

              {!taxi.isBanned && (
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="reason">Raison du bannissement</Label>
                    <Input
                      id="reason"
                      placeholder="Ex: Activité suspecte, fausses données..."
                      value={banReason}
                      onChange={(e) => setBanReason(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="expires">Expiration (Optionnel)</Label>
                    <Input
                      id="expires"
                      type="date"
                      value={banExpiresAt}
                      onChange={(e) => setBanExpiresAt(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Annuler
                </Button>
                <Button
                  variant={taxi.isBanned ? "default" : "destructive"}
                  onClick={handleToggleBan}
                  disabled={isPending}
                >
                  {isPending
                    ? "Traitement..."
                    : taxi.isBanned
                      ? "Débannir"
                      : "Confirmer"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>

        {taxi.isBanned && (taxi.banReason || taxi.banExpiresAt) && (
          <div className="px-6 pb-6 border-t border-destructive/20 pt-4 bg-destructive/10">
            <p className="text-sm font-medium text-destructive flex items-center gap-2">
              <AlertTriangle size={16} />
              <span>Motif : {taxi.banReason || "Aucun motif spécifié"}</span>
            </p>
            {taxi.banExpiresAt && (
              <p className="text-xs text-muted-foreground mt-1">
                Expire le :{" "}
                {new Date(taxi.banExpiresAt).toLocaleDateString("fr-FR")}
              </p>
            )}
          </div>
        )}
      </Card>

      {/* KPI METRICS (5 GRILLES) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Écoutes */}
        <Card className="bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Écoutes
              </p>
              <h3 className="text-xl font-bold text-foreground mt-1">
                {totalLogs}
              </h3>
            </div>
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
              <Radio size={18} />
            </div>
          </CardContent>
        </Card>

        {/* Durée */}
        <Card className="bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Durée totale
              </p>
              <h3 className="text-xl font-bold text-foreground mt-1">
                {formatDuration(totalSeconds)}
              </h3>
            </div>
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
              <Clock size={18} />
            </div>
          </CardContent>
        </Card>

        {/* Vitesse */}
        <Card className="bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Vitesse moy.
              </p>
              <h3 className="text-xl font-bold text-foreground mt-1">
                {avgSpeedGlobal} km/h
              </h3>
            </div>
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
              <Gauge size={18} />
            </div>
          </CardContent>
        </Card>

        {/* Sons Téléchargés */}
        <Card className="bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Sons téléchargés
              </p>
              <h3 className="text-xl font-bold text-foreground mt-1">
                {totalDownloadedSounds}
              </h3>
            </div>
            <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl">
              <Download size={18} />
            </div>
          </CardContent>
        </Card>

        {/* Gain total */}
        <Card className="bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Gains cumulés
              </p>
              <h3 className="text-xl font-bold text-emerald-500 mt-1">
                {totalAmount.toFixed(2)} $
              </h3>
            </div>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <DollarSign size={18} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* HISTORIQUE DES CAMPAGNES & CONFIGURATIONS */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity size={18} className="text-primary" />
            <span>Campagnes & Configurations</span>
          </CardTitle>
          <CardDescription>
            Détail des téléchargements, rémunérations et écoutes par campagne.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {taxi.taxiConfigs && taxi.taxiConfigs.length > 0 ? (
            <div className="border rounded-xl divide-y border-border overflow-hidden">
              {taxi.taxiConfigs.map((config) => {
                // Filtrer les logs associés à cette campagne spécifique
                const campaignLogs = (taxi.logs || []).filter(
                  (log) => log.campaignId === config.campaignId,
                );
                const campaignDuration = campaignLogs.reduce(
                  (acc, l) => acc + l.totalDuration,
                  0,
                );
                const campaignSpeed =
                  campaignLogs.length > 0
                    ? Math.round(
                        campaignLogs.reduce((acc, l) => acc + l.avgSpeed, 0) /
                          campaignLogs.length,
                      )
                    : 0;

                return (
                  <div
                    key={config.id}
                    className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                  >
                    {/* Infos ID & Date */}
                    <div className="flex flex-col gap-1 min-w-50">
                      <span className="font-semibold text-foreground">
                        Campagne #{config.campaignId.slice(-8)}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar size={13} />
                        Configuré le{" "}
                        {new Date(config.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>

                    {/* Métriques spécifiques à la campagne */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm flex-1">
                      {/* Sons Téléchargés */}
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Download size={13} className="text-blue-500" />{" "}
                          Téléchargements
                        </span>
                        <span className="font-medium text-foreground mt-0.5">
                          {config.downloadedSounds} son(s)
                        </span>
                      </div>

                      {/* Montant Gagné */}
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <DollarSign size={13} className="text-emerald-500" />{" "}
                          Montant
                        </span>
                        <span className="font-semibold text-emerald-500 mt-0.5">
                          {config.amount.toFixed(2)} $
                        </span>
                      </div>

                      {/* Durée totale sur cette campagne */}
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock size={13} className="text-primary" /> Durée{" "}
                          {`d'écoute`}
                        </span>
                        <span className="font-medium text-foreground mt-0.5">
                          {formatDuration(campaignDuration)}
                        </span>
                      </div>

                      {/* Vitesse moyenne sur cette campagne */}
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Gauge size={13} className="text-primary" /> Vitesse
                          moy.
                        </span>
                        <span className="font-medium text-foreground mt-0.5">
                          {campaignSpeed} km/h
                        </span>
                      </div>
                    </div>

                    {/* Statut de paiement */}
                    <div className="shrink-0 flex items-center">
                      {config.isPaid ? (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-500/10 text-emerald-500 gap-1"
                        >
                          <CheckCircle2 size={12} /> Payé
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-muted-foreground gap-1"
                        >
                          <XCircle size={12} /> Non payé
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed rounded-xl text-muted-foreground">
              Aucune campagne ni configuration enregistrée pour ce taxi.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
