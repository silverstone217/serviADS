"use client";

import { inter } from "@/lib/fonts";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { useRouter } from "next/navigation";
import { UploadCloud, FileAudio, X, Rocket, Loader } from "lucide-react";
import { useGetUser } from "@/hooks/user";
import { toast } from "sonner";
import AuthDialog from "./AuthDialog";
import { AudioCampaign } from "@/lib/generated/prisma/client";
import {
  audioSubcriber,
  AudioSubcribersType,
  updateAudioSubscriberUrl,
} from "@/actions/audioSubscrib";
import { storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaInfoCircle } from "react-icons/fa";

type Props = {
  audioCampaigns: AudioCampaign[];
};

export default function MainComponent({ audioCampaigns }: Props) {
  const [audioCampaignId, setAudioCampaignId] = useState(
    audioCampaigns?.[0]?.id ?? "",
  );

  const [companyName, setCompanyName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  // const [campaignName, setCampaignName] = useState("juillet-2026");

  const [openAuthDialog, setOpenAuthDialog] = useState(false);
  const { user } = useGetUser();

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Étape 3 States (Synchronisés sur les valeurs de l'image)
  const [taxiNumber, setTaxiNumber] = useState<number>(2);
  // const [zone, setZone] = useState("kinshasa");
  // const [campaignDuration, setCampaignDuration] = useState("2"); // 2 semaines

  // const campaignDuration = audioCampaign
  //   ? audioCampaign.duration.toString()
  //   : "2";
  // const campaignName = audioCampaign?.name

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [uploadProgress, setUploadProgress] = useState(0);

  // Logique de calcul du résumé (Dynamique)
  // const daysInMonth = Number(campaignDuration) * 7; // Ajustable selon vos besoins business
  // const estimatedDiffusionsPerTaxiPerDay = 12;

  const audioCampaign = useMemo(
    () => audioCampaigns.find((camp) => camp.id === audioCampaignId),
    [audioCampaignId, audioCampaigns],
  );

  const [audioDuration, setAudioDuration] = useState(30); // Durée en secondes (Peut être calculée à partir du fichier audio)
  const costPerAudio = audioCampaign
    ? audioCampaign.costPerAudio
    : audioCampaigns[0].costPerAudio;

  const max_taxis = 5;
  const audiomaxDuration = audioCampaign ? audioCampaign.audioMaxDuration : 30;

  // CHECK IF AUDIO DURATION IS HIGHER THAN MAX AUDIO DURATION
  const validateAudioDuration = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const audio = document.createElement("audio");

      audio.preload = "metadata";

      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(audio.src);

        const duration = audio.duration; // secondes

        if (duration <= audiomaxDuration) {
          resolve(true);
        } else {
          toast.error(
            `La durée de l'audio ne doit pas dépasser ${audiomaxDuration} secondes.`,
          );
          resolve(false);
        }
      };

      audio.onerror = () => {
        toast.error("Impossible de lire le fichier audio.");
        resolve(false);
      };

      audio.src = URL.createObjectURL(file);
    });
  };

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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];

    if (!file) return;

    if (file.type !== "audio/mpeg" && file.type !== "audio/wav") {
      toast.error("Seuls les fichiers MP3 et WAV sont autorisés.");
      return;
    }

    const isValid = await validateAudioDuration(file);

    if (isValid) {
      setAudioFile(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const isValid = await validateAudioDuration(file);

    if (isValid) {
      setAudioFile(file);
    } else {
      e.target.value = "";
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
  const totalprice = taxiNumber * costPerAudio;

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // NO USER IN
      if (!user) {
        toast.error("Connectez-vous pour valider cette offre!");
        setOpenAuthDialog(true);
        return;
      }

      // NO AUDIO
      if (!audioFile) {
        toast.error("Veuillez entrer votre publicite audio");
        return;
      }

      // NO INPUT
      if (!companyName || !clientPhone) {
        toast.error("Veuillez remplir tous les champs avant de valider");
        return;
      }

      // SEND TO DATABASE (CALL SERVER)
      const data: AudioSubcribersType = {
        audioCampaignId: audioCampaignId,
        audioDuration: audioDuration,
        companyName: companyName.trim().toLowerCase(),
        phoneClient: clientPhone.trim(),
        price: totalprice,
        taxiNumber,
      };

      toast.info(
        "Vous avez 30 secondes pour valider le paiement sur votre mobile.",
      );

      setTimeout(() => {
        toast.info("Valider le paiement sur votre telephone.");
      }, 1000);

      const result = await audioSubcriber(data);

      if (result.error) {
        toast.error(result.message);
        return;
      }

      const audioSubscribedId = result.audioSubscribedId;
      if (!audioSubscribedId) {
        toast.error("Un probleme est survenu!");
        return;
      }

      //
      toast.success(result.message);

      // SEND AUDIO FILE TO FIREBASE
      const extension = audioFile.name.split(".").pop()?.toLowerCase() || "mp3";
      const fileName = `${audioSubscribedId}.${extension}`;
      const storageRef = ref(
        storage,
        `audio-campaigns/${audioCampaignId}/${fileName}`,
      );

      const uploadTask = uploadBytesResumable(storageRef, audioFile);

      const audioUrl = await new Promise<string>((resolve, reject) => {
        uploadTask.on(
          "state_changed",

          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            setUploadProgress(Math.round(progress));
          },

          (error) => {
            reject(error);
          },

          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            resolve(downloadURL);
          },
        );
      });

      const resultAudio = await updateAudioSubscriberUrl(
        audioSubscribedId,
        audioUrl,
        audioDuration,
      );

      if (resultAudio.error) {
        toast.error(resultAudio.message);
        return;
      }

      toast.success("Votre souscription a ete enregistree!");
      router.refresh();
      setTimeout(() => location.reload(), 1000);
    } catch (error) {
      console.log("SUBMIT AUDIO OFFER", error);
      toast.error("Une erreur est survenue, veuillez reessayez plus tard!");
    } finally {
      setLoading(false);
    }
  };

  if (!audioCampaign || !audioCampaignId) {
    return <div className="p-6 text-center">Aucune campagne disponible.</div>;
  }

  return (
    <div className="mx-auto max-w-6xl pb-10 pt-4">
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
                  {/* <p className="mt-2 text-sm text-muted-foreground">
                    Détails de base pour la facturation et l&apos;identification
                    de la campagne.
                  </p> */}
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
                      maxLength={60}
                    />
                  </div>
                  <div className="flex min-w-0 flex-col gap-2">
                    <div className="flex w-full items-center gap-2">
                      <Label htmlFor="clientPhone">Téléphone du client</Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <FaInfoCircle className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Numero mobile money pour proceder au paiement</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="clientPhone"
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="0822550150"
                      disabled={loading}
                      minLength={10}
                      maxLength={10}
                    />
                  </div>
                </div>

                <div className="flex min-w-0 flex-col gap-2">
                  <Label htmlFor="campaignName">Nom de la campagne</Label>
                  <Select
                    value={audioCampaignId}
                    onValueChange={(val) => setAudioCampaignId(val)}
                  >
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue placeholder="Sélectionnez une campagne" />
                    </SelectTrigger>
                    <SelectContent>
                      {audioCampaigns.map((camp) => {
                        return (
                          <SelectItem
                            value={camp.id}
                            key={camp.id}
                            className="capitalize"
                          >
                            {camp.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
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
                  {/* <button
                    type="button"
                    className="flex items-center gap-2 rounded-full border border-emerald-200/60 
                    bg-emerald-50/50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
                  >
                    <HelpCircle className="h-4 w-4 text-emerald-600" />
                    <span>Besoin d&apos;aide ?</span>
                  </button> */}
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
                      disabled={loading}
                      className="flex flex-col items-center justify-center cursor-pointer focus:outline-none"
                    >
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <UploadCloud className="h-7 w-7" />
                      </div>
                      <p className="text-base font-semibold text-foreground">
                        Cliquez pour importer ou glissez-déposez
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        MP3 ou WAV (Max. 5MB, Idéalement 30 secondes)
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
                        disabled={loading}
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
                  {/* <p className="mt-1 text-sm text-muted-foreground">
                    Définissez où, quand et comment votre publicité sera
                    diffusée.
                  </p> */}
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

                {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                </div> */}
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

            {audioCampaign && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  Durée de la campagne
                </span>
                <span className="font-semibold text-foreground">
                  {audioCampaign?.duration} semaine
                  {audioCampaign?.duration.toString() > "1" && "s"}
                </span>
              </div>
            )}
            {/* <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Durée d&apos;audio</span>
              <span className="font-semibold text-foreground">
                {audioDuration} secondes
              </span>
            </div> */}

            {audioCampaign && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Date de debut</span>
                <span className="font-semibold text-foreground">
                  {new Date(audioCampaign.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Coût par taxi/duree</span>
              <span className="font-semibold text-foreground">
                ${costPerAudio.toFixed(2)}
              </span>
            </div>

            {/* <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Diffusions estimées</span>
              <span className="font-semibold text-blue-600">
                ~{totalDiffusions.toLocaleString()}
              </span>
            </div> */}
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
            type="button"
            size="lg"
            className="w-full mt-6 bg-blue-900 hover:bg-blue-950 text-white font-medium rounded-xl h-12 text-base shadow-sm transition-all flex items-center justify-center gap-2"
            disabled={loading}
            onClick={handleSubmit}
          >
            <span>Lancer ma campagne</span>
            {loading ? (
              uploadProgress ? (
                <p>{uploadProgress} %</p>
              ) : (
                <Loader size={20} className="animate-spin" />
              )
            ) : (
              <Rocket className="h-4 w-4" />
            )}
          </Button>

          {/* CONDITIONS */}
          <p className="mt-4 text-[10px] font-mono leading-normal text-center text-muted-foreground uppercase tracking-tight">
            En cliquant, vous acceptez nos conditions générales de vente.
          </p>
        </div>
      </div>

      <AuthDialog
        openAuthDialog={openAuthDialog}
        setOpenAuthDialog={setOpenAuthDialog}
      />
    </div>
  );
}
