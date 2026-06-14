"use client";

import { useMemo, useState } from "react";
import { AudioCampaign, AudioSubscriber } from "@/lib/generated/prisma/client";
import {
  Search,
  SlidersHorizontal,
  Phone,
  MapPin,
  Car,
  Calendar,
  DollarSign,
  Clock,
  User,
  Music4,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type AudioSubscriberWithCamp = AudioSubscriber & {
  audioCampaign: AudioCampaign;
};

interface Props {
  audioSubscribers: AudioSubscriberWithCamp[];
}

const getCampaignStatus = (startDate: Date, durationWeeks: number) => {
  const now = new Date();

  const start = new Date(startDate);

  const end = new Date(start);
  end.setDate(start.getDate() + durationWeeks * 7);

  if (now < start) {
    return "UPCOMING";
  }

  if (now >= start && now <= end) {
    return "ONGOING";
  }

  return "FINISHED";
};

export default function MainAudioSubscribers({ audioSubscribers }: Props) {
  const [search, setSearch] = useState("");
  const [zone, setZone] = useState<string>("all");

  // Extraction unique des zones
  const zones = useMemo(() => {
    return Array.from(new Set(audioSubscribers.map((a) => a.zone)));
  }, [audioSubscribers]);

  // Filtrage intelligent
  const filtered = useMemo(() => {
    return audioSubscribers
      .filter((a) =>
        `${a.clientPhone} ${a.companyName ?? ""}`
          .toLowerCase()
          .includes(search.toLowerCase().trim()),
      )
      .filter((a) => (zone !== "all" ? a.zone === zone : true));
  }, [audioSubscribers, search, zone]);

  // Formateurs
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const formatDuration = (sec: number) => {
    const min = Math.floor(sec / 60);
    const resteSec = Math.round(sec % 60);
    return resteSec > 0 ? `${min}m ${resteSec}s` : `${min} min`;
  };

  // Style dynamique discret pour les zones (ex: Kinshasa, Gombe etc.)
  const getZoneBadgeClass = (zoneName: string) => {
    const lower = zoneName.toLowerCase();
    if (lower.includes("kinshasa"))
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900";
    if (lower.includes("gombe"))
      return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900";
    return "bg-zinc-50 text-zinc-700 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800";
  };

  return (
    <div className="space-y-6">
      {/* BARRE DE FILTRES STYLE MINIMALISTE */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center bg-card/50 backdrop-blur-sm p-3 rounded-xl border border-border shadow-sm">
        <div className="flex flex-col sm:flex-row flex-1 gap-2.5 items-stretch sm:items-center">
          {/* RECHERCHE */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un client, téléphone..."
              className="pl-9 h-9 bg-background/60 focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-700"
            />
          </div>

          {/* FILTRE PAR ZONE */}
          <div className="w-full sm:max-w-xs">
            <Select value={zone} onValueChange={setZone}>
              <SelectTrigger className="h-9 bg-background/60">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground/70" />
                  <SelectValue placeholder="Filtrer par zone" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les zones</SelectItem>
                {zones.map((z) => (
                  <SelectItem key={z} value={z} className="capitalize">
                    {z}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* COMPTEUR DE RÉSULTATS */}
        <div className="text-xs font-medium text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-md self-start sm:self-auto text-center">
          {filtered.length}{" "}
          {filtered.length > 1 ? "souscriptions" : "souscription"}
        </div>
      </div>

      {/* EMPTY STATE */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card/30 flex flex-col items-center justify-center gap-3">
          <div className="p-3 bg-muted rounded-full text-muted-foreground/60">
            <Music4 className="h-6 w-4 animate-pulse" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              Aucun résultat trouvé
            </p>
            <p className="text-xs text-muted-foreground">
              Modifiez vos critères de recherche ou filtres.
            </p>
          </div>
        </div>
      ) : (
        /* GRILLE DE CARTES */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((sub) => (
            <Card
              key={sub.id}
              className="group border border-border bg-card hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col rounded-xl overflow-hidden"
            >
              {/* CARD HEADER */}
              <CardHeader className="p-5 pb-3 space-y-0 flex flex-row justify-between items-start gap-3">
                <div className="space-y-1 min-w-0">
                  <CardTitle className="text-sm font-semibold tracking-tight text-foreground capitalize truncate group-hover:text-primary transition-colors">
                    {sub.companyName ?? "Client Anonyme"}
                  </CardTitle>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3 shrink-0" />
                    <span className="tabular-nums">{sub.clientPhone}</span>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-md tracking-wide shadow-none border capitalize ${getZoneBadgeClass(sub.zone)}`}
                >
                  {sub.zone}
                </Badge>
              </CardHeader>

              {/* CARD CONTENT (Structure Dashboard Intelligente) */}
              <CardContent className="p-5 pt-3 pb-4 flex-1 space-y-4">
                {/* BLOC METRIQUES : Disposition en grille épurée */}
                <div className="grid grid-cols-2 gap-3 bg-muted/40 p-3 rounded-lg border border-border/50 text-xs">
                  {/* TAXI */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70 flex items-center gap-1">
                      <Car className="h-3 w-3" /> Nbr de Taxis
                    </span>
                    <p className="font-semibold text-foreground">
                      {sub.taxiNumber.toString().padStart(2, "0")}
                    </p>
                  </div>

                  {/* DURATION */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Durée Audio
                    </span>
                    <p className="font-semibold text-foreground tabular-nums">
                      {formatDuration(sub.audioDuration)}
                    </p>
                  </div>

                  {/* LOCALISATION */}
                  <div className="space-y-1 border-t border-border/40 pt-2 col-span-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Secteur
                    </span>
                    <p className="font-semibold text-foreground capitalize truncate">
                      {sub.zone}
                    </p>
                  </div>

                  {/* PRICE */}
                  <div className="space-y-1 border-t border-border/40 pt-2 col-span-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70 flex items-center gap-1">
                      <DollarSign className="h-3 w-3" /> Budget (Prix)
                    </span>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {formatCurrency(sub.price)}
                    </p>
                  </div>
                </div>

                {/* DATE EN BAS DE CONTENU */}
                <div className="flex items-center gap-1.5 text-[11px] pl-0.5">
                  <Calendar className="h-3.5 w-3.5" />

                  {(() => {
                    const startDate = new Date(sub.audioCampaign.startDate);
                    const status = getCampaignStatus(
                      startDate,
                      sub.audioCampaign.duration,
                    );

                    const formattedDate = startDate.toLocaleDateString(
                      "fr-FR",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      },
                    );

                    if (status === "UPCOMING") {
                      return (
                        <span className="text-blue-500">
                          Commence le {formattedDate}
                        </span>
                      );
                    }

                    if (status === "ONGOING") {
                      return (
                        <span className="text-green-500 font-medium">
                          A débuté / en cours depuis le {formattedDate}
                        </span>
                      );
                    }

                    return (
                      <span className="text-muted-foreground/80">
                        A débuté le {formattedDate}
                      </span>
                    );
                  })()}
                </div>
              </CardContent>

              {/* CARD FOOTER BUTTONS */}
              <CardFooter className="p-4 bg-muted/20 border-t border-border/60 flex justify-end items-center">
                <Button size="sm" variant="outline" asChild>
                  <Link
                    href={`/audio/mes-campagnes/${sub.id}`}
                    className="h-8 text-xs font-medium px-3 gap-1.5 shadow-none border-border hover:bg-background hover:text-foreground transition-all"
                  >
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
