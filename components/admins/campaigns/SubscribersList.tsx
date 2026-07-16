"use client";

import { useMemo, useRef, useState } from "react";
import {
  Ban,
  Building2,
  Download,
  FileAudio,
  MapPin,
  Phone,
  Search,
  Car,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AudioSubscriber, PaymentMethod } from "@/lib/generated/prisma/client";

interface SubscribersListProps {
  subscribers: AudioSubscriber[];
}

const paymentColors: Record<PaymentMethod, string> = {
  flexpaie: "bg-blue-100 text-blue-700",
  cinetpay: "bg-orange-100 text-orange-700",
  mpesa: "bg-green-100 text-green-700",
  cash: "bg-gray-100 text-gray-700",
  bank: "bg-purple-100 text-purple-700",
};

export default function SubscribersList({ subscribers }: SubscribersListProps) {
  const [search, setSearch] = useState("");
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

  return (
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
            className="rounded-xl border p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              {/* INFOS */}

              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={paymentColors[subscriber.paymentMethod]}>
                    {subscriber.paymentMethod.toUpperCase()}
                  </Badge>

                  <Badge variant="outline">${subscriber.price}</Badge>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="size-4" />

                    {subscriber.clientPhone}
                  </div>

                  <div className="flex items-center gap-2 text-sm capitalize">
                    <Building2 className="size-4" />

                    {subscriber.companyName || "-"}
                  </div>

                  <div className="flex items-center gap-2 text-sm capitalize">
                    <MapPin className="size-4" />

                    {subscriber.zone}
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Car className="size-4" />
                    {subscriber.taxiNumber} taxi(s)
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  Audio : {subscriber.audioDuration} sec
                </div>
              </div>

              {/* AUDIO */}

              <div className="w-full xl:w-90">
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
                  <div className="rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground">
                    Aucun audio envoyé
                  </div>
                )}
              </div>

              {/* ACTIONS */}

              <div className="flex flex-row gap-2 xl:flex-col">
                {subscriber.audioFile && (
                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={subscriber.audioFile}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="size-4" />
                    </a>
                  </Button>
                )}

                <Button variant="destructive">
                  <Ban className="mr-2 size-4" />
                  Suspendre
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}
