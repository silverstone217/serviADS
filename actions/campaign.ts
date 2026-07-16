"use server";
import prisma from "@/lib/prisma";
import { getUser } from "./user";
import { storage } from "@/lib/firebase";
import { deleteObject, listAll, ref } from "firebase/storage";
import { isCampaignRunning } from "@/utils/functions";

export type AudioDataType = {
  name: string;
  duration: number;
  costPerAudio: number;
  startDate: Date;
  audioMaxDuration: number;
};

// CREATE AUDIO CAMPAIGN AS ADMIN
export const newAudioCampaign = async (data: AudioDataType) => {
  try {
    const user = await getUser();

    // CHECK ACCESS
    if (!user || user.isBanned || user.role !== "ADMIN") {
      return {
        message: "Accès refusé !",
        error: true,
      };
    }

    // CHECK DUPLICATE CAMPAIGN
    const isCampaignExist = await prisma.audioCampaign.findFirst({
      where: {
        startDate: data.startDate,
        duration: data.duration,
      },
    });

    if (isCampaignExist) {
      return {
        message:
          "Une campagne avec cette date de démarrage et cette durée existe déjà.",
        error: true,
      };
    }

    // CREATE CAMPAIGN
    await prisma.audioCampaign.create({
      data: {
        name: data.name,
        startDate: data.startDate,
        duration: data.duration,
        costPerAudio: data.costPerAudio,
        audioMaxDuration: data.audioMaxDuration,
      },
    });

    return {
      message: "Nouvelle campagne créée avec succès !",
      error: false,
    };
  } catch (error) {
    console.error("ERROR ON CAMPAIGN", error);

    return {
      message: "Oops, impossible de créer la campagne !",
      error: true,
    };
  }
};

export const getAllAudioCampaings = async () => {
  const camps = await prisma.audioCampaign.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      audioSubscribers: {
        select: {
          id: true,
          audioFile: true,
          createdAt: true,
        },
      },
    },
  });

  return camps || [];
};

// GET FUTURE AUDIO CAMPAIGNS (FROM TOMORROW ONLY)
export const getCurrentAudioCampaigns = async () => {
  const now = new Date();

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0); // important : début de journée

  return prisma.audioCampaign.findMany({
    where: {
      startDate: {
        gte: tomorrow,
      },
    },
    orderBy: {
      startDate: "asc",
    },
  });
};

export type AudioDataModType = {
  id: string;
  name: string;
  duration: number;
  costPerAudio: number;
  startDate: Date;
  audioMaxDuration: number;
};

// CREATE AUDIO CAMPAIGN AS ADMIN
export const modifyAudioCampaign = async (data: AudioDataModType) => {
  try {
    const user = await getUser();

    if (!user || user.isBanned || user.role !== "ADMIN") {
      return {
        message: "Acces refuse!",
        error: true,
      };
    }

    const campaign = await prisma.audioCampaign.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!campaign) {
      return {
        message: "Campagne introuvable.",
        error: true,
      };
    }

    console.log("CAMPAIGN DATA", {
      isCampaignRunning: isCampaignRunning(
        campaign.startDate,
        campaign.duration,
      ),
      startDate: new Date(campaign.startDate),
      duration: campaign.duration,
    });

    // Vérifier si la campagne est en cours
    if (isCampaignRunning(campaign.startDate, campaign.duration)) {
      return {
        message: "Impossible de modifier une campagne en cours.",
        error: true,
      };
    }

    // Vérifier qu'une campagne identique n'existe pas déjà
    const isAcampaignExist = await prisma.audioCampaign.findFirst({
      where: {
        id: {
          not: data.id,
        },
        startDate: data.startDate,
        duration: data.duration,
      },
    });

    if (isAcampaignExist) {
      return {
        message:
          "Une campagne avec cette date de démarrage et cette durée existe déjà.",
        error: true,
      };
    }

    await prisma.audioCampaign.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        duration: data.duration,
        costPerAudio: data.costPerAudio,
        startDate: data.startDate,
        audioMaxDuration: data.audioMaxDuration,
      },
    });

    return {
      message: "Campagne modifiée avec succès !",
      error: false,
    };
  } catch (error) {
    console.error("ERROR ON CAMPAIGN", error);

    return {
      message: "Oops impossible de modifier !",
      error: true,
    };
  }
};

// DELETE CAMP
export const deleteAudioCampaignById = async (id: string) => {
  try {
    const user = await getUser();

    // IF USER CAN ACCCES !
    if (!user || user.isBanned || user.role !== "ADMIN") {
      return {
        message: "Acces refuse!",
        error: true,
      };
    }

    // DELETE SOUND
    const campaignId = id;

    const folderRef = ref(storage, `audio-campaigns/${campaignId}`);

    const files = await listAll(folderRef);

    await prisma.audioCampaign.delete({
      where: {
        id,
      },
    });

    await Promise.all(files.items.map((fileRef) => deleteObject(fileRef)));

    return {
      message: "Campagne supprimee!",
      error: false,
    };
  } catch (error) {
    console.error("ERROR ON DELTEING CAMPAIGN", error);
    return {
      message: "Oops impossible de supprimer!",
      error: true,
    };
  }
};

// GET CAMPAIGN BY ID with subscribers
export const getAudioCampaignById = async (id: string) => {
  const user = await getUser();

  if (!user || user.isBanned || user.role !== "ADMIN") {
    return null;
  }

  const campaign = await prisma.audioCampaign.findUnique({
    where: {
      id,
    },
    include: {
      audioSubscribers: true,
    },
  });

  return campaign || null;
};
