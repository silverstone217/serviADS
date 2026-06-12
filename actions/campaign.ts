"use server";

import prisma from "@/lib/prisma";
import { getUser } from "./user";
import { StatusAudioCampaign } from "@/lib/generated/prisma/enums";

export type AudioDataType = {
  name: string;
  duration: number;
  costPerAudio: number;
  status: StatusAudioCampaign;
};

// CREATE AUDIO CAMPAIGN AS ADMIN
export const newAudioCampaign = async (data: AudioDataType) => {
  try {
    const user = await getUser();

    // IF USER CAN ACCCES !
    if (!user || user.isBanned) {
      return {
        message: "Acces refuse!",
        error: true,
      };
    }

    // CHECK ROLE

    // CHECK IF THERE'S CURRENT AUDIO CAMP
    const isAcampaignExist = await prisma.audioCampaign.findFirst({
      where: {
        status: "en_cours",
      },
    });

    if (isAcampaignExist && data.status === "en_cours") {
      return {
        message:
          "Une campagne a deja un status en cours, terminez la, avant de lancer une autre!",
        error: true,
      };
    }

    // CREATE CAMPAIGN
    //const newCamp =
    await prisma.audioCampaign.create({
      data: {
        ...data,
      },
    });

    return {
      message: "Nouvelle campagne creee!",
      error: false,
    };
  } catch (error) {
    console.error("ERROR ON CAMPAIGN", error);
    return {
      message: "Oops impossible de creer!",
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

// GET CURRENT AUDIO CAMPAIGN
export const getCurrentAudioCampaign = async () => {
  return prisma.audioCampaign.findFirst({
    where: {
      status: "en_cours",
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
