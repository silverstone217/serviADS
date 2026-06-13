"use server";

import prisma from "@/lib/prisma";
import { getUser } from "./user";

export type AudioDataType = {
  name: string;
  duration: number;
  costPerAudio: number;
  startDate: Date;
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
  });

  return camps || [];
};

// GET CURRENT AUDIO CAMPAIGNS
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

    await prisma.audioCampaign.delete({
      where: {
        id,
      },
    });

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
