"use client";

import { inter } from "@/lib/fonts";
import React, { useState, useRef, useEffect } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRouter } from "next/navigation";
import { UploadCloud, HelpCircle, FileAudio, X, Rocket } from "lucide-react";

export default function MainComponent() {
  const [companyName, setCompanyName] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [campaignName, setCampaignName] = useState("juillet-2026");

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Étape 3 States (Synchronisés sur les valeurs de l'image)
  const [taxiNumber, setTaxiNumber] = useState<number>(2);
  const [zone, setZone] = useState("kinshasa");
  const [campaignDuration, setCampaignDuration] = useState("2"); // 2 semaines

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Logique de calcul du résumé (Dynamique)
  const daysInMonth = Number(campaignDuration) * 7; // Ajustable selon vos besoins business
  const estimatedDiffusionsPerTaxiPerDay = 12;

  const [audioDuration, setAudioDuration] = useState(30); // Durée en secondes (Peut être calculée à partir du fichier audio)
  const costPerAudio = 2;

  const max_taxis = 5;

  const totalDiffusions =
    taxiNumber *
    estimatedDiffusionsPerTaxiPerDay *
    daysInMonth *
    Number(campaignDuration);

  // Drag & Drop Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "audio/mpeg" || file.type === "audio/wav") {
        setAudioFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  // AUDIO DURATION CALCULATION (Optional, can be enhanced with a library like 'music-metadata-browser') in secondes

  useEffect(() => {
    if (audioFile) {
      const audio = new Audio(URL.createObjectURL(audioFile));
      audio.addEventListener("loadedmetadata", () => {
        const duration = Math.round(audio.duration);
        setAudioDuration(duration);
      });
    }
  }, [audioFile]);

  // Calculate totalprice by duration and nbr of taxis
  const totalprice =
    Number(audioDuration / 30) * costPerAudio + taxiNumber * costPerAudio;

  return (
    <div className="mx-auto max-w-6xl py-10 px-4">
      {/* GRILLE PRINCIPALE DEUX COLONNES */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-start">
        {/* COLONNE GAUCHE : FORMULAIRES (Prend 2 colonnes sur 3) */}
        <div className="flex flex-col gap-8 lg:col-span-2">
          {/* 1. COMPANY INFORMATION */}
          <div className="flex w-full gap-4 rounded-xl bg-muted/50 p-4 shadow-sm md:p-6 group">
            <div className="shrink-0">
              <span
                className="md:flex hidden h-8 w-8 items-center  bg-muted
               border border-muted-foreground/30
              justify-center rounded-full group-focus:bg-primary font-bold text-primary-foreground"
              >
                1
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-6">
                <div>
                  <h2
                    className={`text-xl font-bold md:text-2xl ${inter.className}`}
                  >
                    Informations de l&apos;entreprise
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Détails de base pour la facturation et l&apos;identification
                    de la campagne.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="flex min-w-0 flex-col gap-2">
                    <Label htmlFor="companyName">
                      Nom de l&apos;entreprise
                    </Label>
                    <Input
                      id="companyName"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Ex : ServiAds"
                      disabled={loading}
                    />
                  </div>
                  <div className="flex min-w-0 flex-col gap-2">
                    <Label htmlFor="companyPhone">
                      Téléphone de l&apos;entreprise
                    </Label>
                    <Input
                      id="companyPhone"
                      type="tel"
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                      placeholder="0822550150"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="flex min-w-0 flex-col gap-2">
                  <Label htmlFor="campaignName">Nom de la campagne</Label>
                  <Input
                    id="campaignName"
                    type="text"
                    value={campaignName}
                    disabled
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. AUDIO FILE SECTION */}
          <div className="flex w-full gap-4 rounded-xl bg-muted/50 p-4 shadow-sm md:p-6">
            <div className="shrink-0">
              <span
                className="md:flex hidden h-8 w-8 items-center justify-center rounded-full bg-muted 
              border border-muted-foreground/30 font-bold text-primary-foreground"
              >
                2
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2
                      className={`text-xl font-bold md:text-2xl ${inter.className}`}
                    >
                      Fichier Audio
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Importez votre spot publicitaire au format MP3 ou WAV.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full border border-emerald-200/60 
                    bg-emerald-50/50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
                  >
                    <HelpCircle className="h-4 w-4 text-emerald-600" />
                    <span>Besoin d&apos;aide ?</span>
                  </button>
                </div>

                <div
                  className={`relative flex flex-col items-center justify-center rounded-xl border-2 
                    border-dashed p-8 text-center transition-all ${
                      dragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/20 bg-background hover:bg-muted/30"
                    }`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="audio-upload"
                    className="hidden"
                    accept=".mp3, .wav, audio/mpeg, audio/wav"
                    onChange={handleFileChange}
                    disabled={loading}
                  />

                  {!audioFile ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center cursor-pointer focus:outline-none"
                    >
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <UploadCloud className="h-7 w-7" />
                      </div>
                      <p className="text-base font-semibold text-foreground">
                        Cliquez pour importer ou glissez-déposez
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        MP3 ou WAV (Max. 10MB, Idéalement 30 secondes)
                      </p>
                    </button>
                  ) : (
                    <div className="flex w-full max-w-md items-center justify-between rounded-lg border bg-muted/40 p-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <FileAudio className="h-5 w-5" />
                        </div>
                        <div className="text-left min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {audioFile.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive"
                        onClick={() => setAudioFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 3. PARAMÈTRES DE DIFFUSION */}
          <div className="flex w-full gap-4 rounded-xl bg-muted/50 p-4 shadow-sm md:p-6">
            <div className="shrink-0">
              <span
                className="md:flex hidden h-8 w-8 items-center justify-center rounded-full bg-muted
               border border-muted-foreground/30 font-bold text-primary-foreground"
              >
                3
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-6">
                <div>
                  <h2
                    className={`text-xl font-bold md:text-2xl ${inter.className}`}
                  >
                    Paramètres de diffusion
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Définissez où, quand et comment votre publicité sera
                    diffusée.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <Label className="text-xs font-mono tracking-wider uppercase text-muted-foreground">
                    Nombre de Taxis cibles
                  </Label>
                  <div className="flex items-center gap-6">
                    <Slider
                      defaultValue={[50]}
                      value={[taxiNumber]}
                      onValueChange={(value) => setTaxiNumber(value[0])}
                      max={max_taxis}
                      min={1}
                      step={1}
                      className="flex-1"
                      disabled={loading}
                    />
                    <span className="text-2xl font-bold text-blue-600 min-w-12 text-right">
                      {taxiNumber}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-mono tracking-wider uppercase text-muted-foreground">
                      Zone Géographique
                    </Label>
                    <Select value={zone} onValueChange={setZone} disabled>
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Sélectionnez une zone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kinshasa">
                          Kinshasa - Centre Ville
                        </SelectItem>
                        <SelectItem value="goma">Goma</SelectItem>
                        <SelectItem value="lubumbashi">Lubumbashi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-mono tracking-wider uppercase text-muted-foreground">
                      Durée de la campagne
                    </Label>
                    <Select
                      value={campaignDuration}
                      onValueChange={setCampaignDuration}
                      disabled
                    >
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Sélectionnez la durée" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 semaine</SelectItem>
                        <SelectItem value="2">2 semaines</SelectItem>
                        <SelectItem value="3">3 semaines</SelectItem>
                        <SelectItem value="6">6 semaines</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : RÉSUMÉ DE LA CAMPAGNE (Fidèle à l'image) */}
        <div className="lg:sticky lg:top-10 w-full rounded-2xl border bg-background p-6 shadow-xs">
          <h3
            className={`text-xl font-bold tracking-tight text-foreground ${inter.className}`}
          >
            Résumé de la campagne
          </h3>

          <hr className="my-5 border-muted" />

          {/* LISTE DES INFOS */}
          <div className="flex flex-col gap-4 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Taxis cibles</span>
              <span className="font-semibold text-foreground">
                {taxiNumber} véhicules
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                Durée de la campagne
              </span>
              <span className="font-semibold text-foreground">
                {campaignDuration} semaine{campaignDuration > "1" && "s"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Durée d&apos;audio</span>
              <span className="font-semibold text-foreground">
                {audioDuration} secondes
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Coût par taxi/jour</span>
              <span className="font-semibold text-foreground">
                ${costPerAudio.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Diffusions estimées</span>
              <span className="font-semibold text-blue-600">
                ~{totalDiffusions.toLocaleString()}
              </span>
            </div>
          </div>

          {/* TOTAL ESTIMÉ BLOC */}
          <div className="mt-6 rounded-xl bg-muted/40 p-5 border border-muted/50 text-center">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">
              Total estimé
            </p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-extrabold tracking-tight text-blue-900">
                ${totalprice.toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                / campagne
              </span>
            </div>
          </div>

          {/* ACTION BUTTON */}
          <Button
            type="submit"
            size="lg"
            className="w-full mt-6 bg-blue-900 hover:bg-blue-950 text-white font-medium rounded-xl h-12 text-base shadow-sm transition-all flex items-center justify-center gap-2"
            disabled={loading || !audioFile || !companyName || !companyPhone}
          >
            <span>Lancer ma campagne</span>
            <Rocket className="h-4 w-4" />
          </Button>

          {/* CONDITIONS */}
          <p className="mt-4 text-[10px] font-mono leading-normal text-center text-muted-foreground uppercase tracking-tight">
            En cliquant, vous acceptez nos conditions générales de vente.
          </p>
        </div>
      </div>
    </div>
  );
}
