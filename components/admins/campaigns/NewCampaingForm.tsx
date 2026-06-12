"use client";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
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
import { Loader, PlusCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DATA_STATUS } from "@/utils/campaign";
import { AudioDataType, newAudioCampaign } from "@/actions/campaign";
import { toast } from "sonner";
import { StatusAudioCampaign } from "@/lib/generated/prisma/enums";

const NewCampaingForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [campaignName, setCampaignName] = useState("");
  const [duration, setDuration] = useState("2"); // per weeks

  const [costPerAudio, setCostPerAudio] = useState("2"); // in dollars USD
  const [status, setStatus] = useState("en_cours");

  const isButtonDisabled = useMemo(() => {
    if (loading) return true;
    if (!campaignName || !duration || !costPerAudio) return true;

    return false;
  }, [campaignName, costPerAudio, duration, loading]);

  //   handlesubmit

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

      const data: AudioDataType = {
        costPerAudio: Number(costPerAudio),
        duration: Number(duration),
        name: campaignName.trim().toLocaleLowerCase(),
        status: status as StatusAudioCampaign,
      };

      const result = await newAudioCampaign(data);

      if (result.error) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    } catch (error) {
      console.error("ERROR ON CREATE CAMP", error);
      toast.error("Impossible continuer sur cette action!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="default" disabled={loading} className="px-6 w-full">
          <PlusCircle size={20} /> Nouvelle campagne
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full">
        <AlertDialogHeader>
          <AlertDialogTitle>Creation d&apos;une campagne</AlertDialogTitle>
          <AlertDialogDescription>
            Remplir les informations necessaires pour creer cette nouvelle
            campagne.
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
          <div className="w-full grid gap-2">
            <Label htmlFor="status">
              Status
              <span className="text-destructive">*</span>
            </Label>
            <Select value={status} onValueChange={setStatus}>
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
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction disabled={isButtonDisabled} onClick={handleSubmit}>
            {loading ? <Loader size={20} className="animate-spin" /> : "Creer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NewCampaingForm;
