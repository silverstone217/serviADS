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

  const recordingStart = new Date(startDate);
  recordingStart.setDate(recordingStart.getDate() - 1);

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + campaign.duration * 7);

  if (now > endDate) {
    return "terminee";
  }

  if (now >= startDate) {
    return "en_cours";
  }

  return "enregistrement";
};
