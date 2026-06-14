"use client";
import {
  AudioCampaign,
  // StatusAudioCampaign,
} from "@/lib/generated/prisma/client";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader, Pencil } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { DATA_STATUS } from "@/utils/campaign";
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
import { AudioDataModType, modifyAudioCampaign } from "@/actions/campaign";

interface ModifyCampaignProps {
  audioCampaign: AudioCampaign;
}

const ModifyCampaign = ({ audioCampaign }: ModifyCampaignProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [campaignName, setCampaignName] = useState(audioCampaign.name ?? "");
  const [duration, setDuration] = useState(
    audioCampaign.duration.toString() ?? "2",
  ); // per weeks

  const [costPerAudio, setCostPerAudio] = useState(
    audioCampaign.costPerAudio.toString() ?? "2",
  ); // in dollars USD
  // const [status, setStatus] = useState(audioCampaign.status ?? "en_cours");
  const [startDate, setStartDate] = useState(
    new Date(audioCampaign.startDate).toISOString().slice(0, 16),
  );
  const [maxDuration, setMaxDuration] = useState(
    audioCampaign.audioMaxDuration.toString() ?? "30",
  ); // in seconds

  const isButtonDisabled = useMemo(() => {
    if (loading) return true;
    if (!campaignName || !duration || !costPerAudio) return true;
    if (
      campaignName === audioCampaign.name &&
      Number(duration) === audioCampaign.duration &&
      Number(costPerAudio) === audioCampaign.costPerAudio &&
      new Date(startDate).getTime() ===
        new Date(audioCampaign.startDate).getTime() &&
      audioCampaign.audioMaxDuration === Number(maxDuration)
    )
      return true;

    return false;
  }, [
    audioCampaign.audioMaxDuration,
    audioCampaign.costPerAudio,
    audioCampaign.duration,
    audioCampaign.name,
    audioCampaign.startDate,
    campaignName,
    costPerAudio,
    duration,
    loading,
    maxDuration,
    startDate,
  ]);

  //   SUBMIT
  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (isNaN(Number(costPerAudio))) {
        toast.error("Le cout doit etre un montant($)");
        return;
      }

      if (isNaN(Number(duration))) {
        toast.error("La duree doit etre un nombre (en semaine)");
        return;
      }

      if (isNaN(Number(maxDuration))) {
        toast.error("La duree doit etre un nombre (en secondes)");
        return;
      }

      const data: AudioDataModType = {
        costPerAudio: Number(costPerAudio),
        duration: Number(duration),
        name: campaignName.trim().toLowerCase(),
        startDate: new Date(startDate),
        id: audioCampaign.id,
        audioMaxDuration: Number(maxDuration),
      };

      const result = await modifyAudioCampaign(data);

      if (result.error) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    } catch (error) {
      console.error("ERROR ON Modifying CAMP", error);
      toast.error("Impossible continuer sur cette action!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
          disabled={loading}
        >
          <Pencil className="h-3.5 w-3.5" />
          Modifier
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full">
        <AlertDialogHeader>
          <AlertDialogTitle>Modification de la campagne</AlertDialogTitle>
          <AlertDialogDescription>
            Remplir les informations necessaires pour valider cette campagne.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-6 w-full">
          {/* Campaign name */}
          <div className="w-full grid gap-2">
            <Label htmlFor="campaignName">
              Nom de la campagne <span className="text-destructive">*</span>
            </Label>
            <Input
              id="campaignName"
              placeholder="juillet-2026"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              autoFocus
              autoCapitalize="off"
              autoCorrect="off"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Campaign duration */}
            <div className="w-full grid gap-2">
              <Label htmlFor="duration">
                Duree de la campagne (en semaine){" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="duration"
                placeholder="2"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                type="number"
                min={1}
              />
            </div>

            {/* Campaign duration */}
            <div className="w-full grid gap-2">
              <Label htmlFor="costPerAudio">
                Cout en taxi/audio (en dollars){" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="costPerAudio"
                placeholder="3"
                value={costPerAudio}
                onChange={(e) => setCostPerAudio(e.target.value)}
                type="number"
                min={0}
              />
            </div>
          </div>

          {/* STATUS  */}
          {/* <div className="w-full grid gap-2">
            <Label htmlFor="status">
              Status
              <span className="text-destructive">*</span>
            </Label>
            <Select
              value={status}
              onValueChange={(val) => setStatus(val as StatusAudioCampaign)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status de la campagne" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {DATA_STATUS.map((st) => {
                    return (
                      <SelectItem value={st.value} key={st.value}>
                        {st.label}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* START DATE */}
            <div className="w-full grid gap-2">
              <Label htmlFor="startDate">
                Début de la campagne
                <span className="text-destructive">*</span>
              </Label>

              <Input
                id="startDate"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* max audio duration */}
            <div className="w-full grid gap-2">
              <Label htmlFor="maxDuration">
                Duree max de l&apos;audio (sec){" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="maxDuration"
                placeholder="30"
                value={maxDuration}
                onChange={(e) => setMaxDuration(e.target.value)}
                type="number"
                min={0}
                step={5}
              />
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction disabled={isButtonDisabled} onClick={handleSubmit}>
            {loading ? (
              <Loader size={20} className="animate-spin" />
            ) : (
              "Modifier"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModifyCampaign;
