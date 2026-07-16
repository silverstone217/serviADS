import { AudioCampaign } from "@/lib/generated/prisma/client";
import { CampaignStatus } from "@/types/campaign";

export const DATA_STATUS = [
  {
    label: "En cours",
    value: "en_cours",
  },
  {
    label: "En pause",
    value: "en_pause",
  },
  {
    label: "Terminée",
    value: "terminee",
  },
];

// FUNCTION DATE

export const getCampaignStatus = (campaign: AudioCampaign): CampaignStatus => {
  const now = new Date();

  const startDate = new Date(campaign.startDate);

  // Début de la période d'enregistrement (J-1)
  const recordingStart = new Date(startDate);
  recordingStart.setDate(recordingStart.getDate() - 1);

  // Fin de la campagne (duration en jours)
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + campaign.duration);

  if (now > endDate) {
    return "terminee";
  }

  if (now >= startDate) {
    return "en_cours";
  }

  if (now >= recordingStart) {
    return "enregistrement";
  }

  // Avant la période d'enregistrement
  return "enregistrement";
};
