"use client";

import React, { useEffect, useRef, useState } from "react";
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

import {
  SquarePen,
  UploadCloud,
  FileAudio,
  Loader2,
  X,
  Music4,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/firebase";
import {
  //   deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

// action serveur à créer
import { updateAudioSubscriberUrl } from "@/actions/audioSubscrib";
import { Progress } from "../ui/progress";

type ModifySoundProps = {
  campaignId: string;
  audioFileUrl?: string | null;
  audioSubId: string;
  audiomaxDuration?: number;
};

const ModifySound = ({
  audioSubId,
  campaignId,
  audioFileUrl,
  audiomaxDuration = 30,
}: ModifySoundProps) => {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioDuration, setAudioDuration] = useState(30);

  //   AUDIO DURATIOn
  useEffect(() => {
    if (audioFile) {
      const audio = new Audio(URL.createObjectURL(audioFile));
      audio.addEventListener("loadedmetadata", () => {
        const duration = Math.round(audio.duration);
        setAudioDuration(duration);
      });
    }
  }, [audioFile]);

  if (!audioFileUrl) return null;

  const validateAudioDuration = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const audio = document.createElement("audio");

      audio.preload = "metadata";

      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(audio.src);

        if (audio.duration <= audiomaxDuration) {
          resolve(true);
        } else {
          toast.error(
            `La durée maximale autorisée est ${audiomaxDuration} secondes.`,
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (
      file.type !== "audio/mpeg" &&
      file.type !== "audio/wav" &&
      file.type !== "audio/x-wav"
    ) {
      toast.error("Seuls les fichiers MP3 et WAV sont acceptés.");
      return;
    }

    const isValid = await validateAudioDuration(file);

    if (isValid) {
      setAudioFile(file);
    } else {
      e.target.value = "";
    }
  };

  const handleUpdateAudio = async () => {
    try {
      if (!audioFile) {
        toast.error("Veuillez sélectionner un nouvel audio.");
        return;
      }

      setLoading(true);

      const extension = audioFile.name.split(".").pop()?.toLowerCase() || "mp3";

      const fileName = `${audioSubId}.${extension}`;

      const storageRef = ref(
        storage,
        `audio-campaigns/${campaignId}/${fileName}`,
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

      //   DELETE OLD AUDIO
      //   const storageOldRef = ref(storage, audioFileUrl);
      //   await deleteObject(storageOldRef);

      const result = await updateAudioSubscriberUrl(
        audioSubId,
        audioUrl,
        audioDuration,
      );

      if (result.error) {
        toast.error(result.message);
        return;
      }

      toast.success("Audio mis à jour avec succès.");

      //   console.log({
      //     audioFileUrl,
      //     fileName: `audio-campaigns/${campaignId}/${fileName}`,
      //   });

      setAudioFile(null);
      router.refresh();
    } catch (error) {
      console.log(error);

      toast.error("Une erreur est survenue lors de la mise à jour.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild disabled={loading}>
        <Button variant="outline" size="sm" className="absolute top-0 right-2 ">
          <SquarePen size={16} />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Modifier le spot publicitaire</AlertDialogTitle>

          <AlertDialogDescription>
            Remplacez votre fichier audio tout en conservant votre souscription
            actuelle.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-6">
          {/* AUDIO ACTUEL */}
          <div className="rounded-xl border bg-muted/30 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Music4 className="h-4 w-4 text-primary" />
              <p className="font-medium">Audio actuellement diffusé</p>
            </div>

            <audio controls src={audioFileUrl} className="w-full" />
          </div>

          {/* NOUVEL AUDIO */}
          <div className="rounded-xl border border-dashed p-6">
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp3,.wav,audio/mpeg,audio/wav"
              className="hidden"
              onChange={handleFileChange}
              disabled={loading}
            />

            {!audioFile ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="flex w-full flex-col items-center justify-center gap-3"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                  <UploadCloud className="h-7 w-7 text-blue-600" />
                </div>

                <div>
                  <p className="font-medium">Sélectionner un nouveau fichier</p>

                  <p className="text-xs text-muted-foreground">
                    MP3 ou WAV • Max {audiomaxDuration}
                    secondes
                  </p>
                </div>
              </button>
            ) : (
              <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                    <FileAudio className="h-5 w-5 text-blue-600" />
                  </div>

                  <div>
                    <p className="font-medium">{audioFile.name}</p>

                    <p className="text-xs text-muted-foreground">
                      {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setAudioFile(null)}
                  disabled={loading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* PREVIEW NOUVEL AUDIO */}
          {audioFile && (
            <div className="rounded-xl border bg-muted/30 p-4">
              <p className="mb-3 text-sm font-medium">Aperçu du nouvel audio</p>

              <audio
                controls
                src={URL.createObjectURL(audioFile)}
                className="w-full"
              />
            </div>
          )}

          {/* PROGRESS */}
          {loading && uploadProgress > 0 && (
            <div className="space-y-2">
              <Progress value={uploadProgress} />

              <p className="text-center text-sm text-muted-foreground">
                Téléversement : {uploadProgress}%
              </p>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleUpdateAudio();
            }}
            disabled={!audioFile || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mise à jour...
              </>
            ) : (
              "Enregistrer les modifications"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModifySound;
