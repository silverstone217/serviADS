"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import {
  Ban,
  Building2,
  Download,
  FileAudio,
  MapPin,
  Phone,
  Search,
  Car,
  UserCheck,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AudioSubscriber, PaymentMethod } from "@/lib/generated/prisma/client";
import { toggleBanSubscriber } from "@/actions/audioSubscrib";

interface SubscribersListProps {
  subscribers: AudioSubscriber[];
}

const paymentColors: Record<PaymentMethod, string> = {
  flexpaie: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  cinetpay:
    "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  mpesa: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  cash: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  bank: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
};

export default function SubscribersList({ subscribers }: SubscribersListProps) {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  // Gestion de la modal de bannissement
  const [selectedSubscriber, setSelectedSubscriber] =
    useState<AudioSubscriber | null>(null);
  const [banReason, setBanReason] = useState("");
  const [banExpiresAt, setBanExpiresAt] = useState("");

  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  const filteredSubscribers = useMemo(() => {
    const value = search.toLowerCase();

    return subscribers.filter(
      (subscriber) =>
        subscriber.clientPhone.toLowerCase().includes(value) ||
        subscriber.zone.toLowerCase().includes(value) ||
        (subscriber.companyName ?? "").toLowerCase().includes(value),
    );
  }, [search, subscribers]);

  const openBanModal = (subscriber: AudioSubscriber) => {
    setSelectedSubscriber(subscriber);
    setBanReason(subscriber.banReason || "");
    setBanExpiresAt(
      subscriber.banExpiresAt
        ? new Date(subscriber.banExpiresAt).toISOString().split("T")[0]
        : "",
    );
  };

  const handleToggleBan = () => {
    if (!selectedSubscriber) return;

    startTransition(async () => {
      const res = await toggleBanSubscriber({
        id: selectedSubscriber.id,
        campaignId: selectedSubscriber.audioCampaignId,
        isBanned: !selectedSubscriber.isBanned,
        banReason: !selectedSubscriber.isBanned ? banReason : undefined,
        banExpiresAt:
          !selectedSubscriber.isBanned && banExpiresAt
            ? new Date(banExpiresAt)
            : null,
      });

      if (res.success) {
        setSelectedSubscriber(null);
      }
    });
  };

  const handleDelete = (subscriberId: string) => {
    // Action de suppression à connecter plus tard
    console.log("Suppression demandée pour la souscription :", subscriberId);
  };

  return (
    <>
      <Card className="rounded-2xl">
        <div className="border-b p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Souscriptions</h2>
              <p className="text-sm text-muted-foreground">
                {filteredSubscribers.length} souscription(s)
              </p>
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                placeholder="Téléphone, entreprise, zone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 p-6">
          {filteredSubscribers.length === 0 && (
            <div className="rounded-xl border border-dashed p-12 text-center">
              <FileAudio className="mx-auto mb-4 size-10 text-muted-foreground" />
              <h3 className="font-semibold">Aucune souscription trouvée</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Essayez une autre recherche.
              </p>
            </div>
          )}

          {filteredSubscribers.map((subscriber) => (
            <Card
              key={subscriber.id}
              className={`rounded-xl border p-5 shadow-sm transition hover:shadow-md ${
                subscriber.isBanned
                  ? "border-destructive/40 bg-destructive/5"
                  : ""
              }`}
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                {/* INFOS */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={paymentColors[subscriber.paymentMethod]}>
                      {subscriber.paymentMethod.toUpperCase()}
                    </Badge>

                    <Badge variant="outline">${subscriber.price}</Badge>

                    {/* Statut de bannissement */}
                    {subscriber.isBanned ? (
                      <Badge
                        variant="destructive"
                        className="flex items-center gap-1"
                      >
                        <Ban className="size-3" /> Suspendu
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      >
                        <UserCheck className="mr-1 size-3" /> Actif
                      </Badge>
                    )}
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="size-4 text-muted-foreground" />
                      {subscriber.clientPhone}
                    </div>

                    <div className="flex items-center gap-2 text-sm capitalize">
                      <Building2 className="size-4 text-muted-foreground" />
                      {subscriber.companyName || "-"}
                    </div>

                    <div className="flex items-center gap-2 text-sm capitalize">
                      <MapPin className="size-4 text-muted-foreground" />
                      {subscriber.zone}
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Car className="size-4 text-muted-foreground" />
                      {subscriber.taxiNumber} taxi(s)
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Audio : {subscriber.audioDuration} sec
                  </div>

                  {/* Message si suspendu */}
                  {subscriber.isBanned && (
                    <div className="mt-2 rounded-lg bg-destructive/10 p-2 text-xs text-destructive flex items-center gap-2">
                      <AlertTriangle className="size-4 shrink-0" />
                      <span>
                        <strong>Motif :</strong>{" "}
                        {subscriber.banReason || "Non spécifié"}{" "}
                        {subscriber.banExpiresAt &&
                          ` (Expire le : ${new Date(subscriber.banExpiresAt).toLocaleDateString("fr-FR")})`}
                      </span>
                    </div>
                  )}
                </div>

                {/* AUDIO */}
                <div className="w-full xl:w-80">
                  {subscriber.audioFile ? (
                    <audio
                      ref={(el) => {
                        audioRefs.current[subscriber.id] = el;
                      }}
                      controls
                      preload="none"
                      className="w-full"
                      onPlay={() => {
                        Object.entries(audioRefs.current).forEach(
                          ([id, audio]) => {
                            if (id !== subscriber.id && audio) {
                              audio.pause();
                            }
                          },
                        );
                      }}
                    >
                      <source src={subscriber.audioFile} />
                    </audio>
                  ) : (
                    <div className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
                      Aucun audio envoyé
                    </div>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="flex flex-row flex-wrap items-center gap-2 xl:flex-col xl:items-stretch">
                  {subscriber.audioFile && (
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href={subscriber.audioFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Télécharger l'audio"
                      >
                        <Download className="size-4" />
                      </a>
                    </Button>
                  )}

                  {/* BOUTON BANNIR / DÉBANNIR */}
                  <Button
                    variant={subscriber.isBanned ? "default" : "destructive"}
                    size="sm"
                    onClick={() => openBanModal(subscriber)}
                  >
                    {subscriber.isBanned ? (
                      <>
                        <UserCheck className="mr-2 size-4" />
                        Réactiver
                      </>
                    ) : (
                      <>
                        <Ban className="mr-2 size-4" />
                        Suspendre
                      </>
                    )}
                  </Button>

                  {/* BOUTON SUPPRIMER (Sans action pour l'instant) */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDelete(subscriber.id)}
                    title="Supprimer la souscription"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* DIALOG DE CONFIRMATION BANNISSEMENT / DÉBANNISSEMENT */}
      <Dialog
        open={!!selectedSubscriber}
        onOpenChange={(open) => !open && setSelectedSubscriber(null)}
      >
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle
                className={
                  selectedSubscriber?.isBanned
                    ? "text-emerald-500"
                    : "text-destructive"
                }
                size={20}
              />
              <span>
                {selectedSubscriber?.isBanned
                  ? "Levée de suspension"
                  : "Suspendre la souscription"}
              </span>
            </DialogTitle>
            <DialogDescription>
              {selectedSubscriber?.isBanned
                ? "Êtes-vous sûr de vouloir réactiver cette souscription ?"
                : "Cette action empêchera la diffusion de cet audio dans les taxis."}
            </DialogDescription>
          </DialogHeader>

          {selectedSubscriber && !selectedSubscriber.isBanned && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="banReason">Motif de suspension</Label>
                <Input
                  id="banReason"
                  placeholder="Ex: Audio non conforme, contenu inapproprié..."
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="banExpiresAt">Expiration (Optionnel)</Label>
                <Input
                  id="banExpiresAt"
                  type="date"
                  value={banExpiresAt}
                  onChange={(e) => setBanExpiresAt(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setSelectedSubscriber(null)}
            >
              Annuler
            </Button>
            <Button
              variant={selectedSubscriber?.isBanned ? "default" : "destructive"}
              onClick={handleToggleBan}
              disabled={isPending}
            >
              {isPending
                ? "Traitement..."
                : selectedSubscriber?.isBanned
                  ? "Confirmer la réactivation"
                  : "Confirmer la suspension"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
