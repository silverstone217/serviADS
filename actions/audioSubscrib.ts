"use server";

import prisma from "@/lib/prisma";
import { getUser } from "./user";

export type AudioSubcribersType = {
  audioCampaignId: string;
  taxiNumber: number;
  price: number;
  companyName: string;
  phoneClient: string;
  audioDuration: number;
};

export const audioSubcriber = async (data: AudioSubcribersType) => {
  try {
    const user = await getUser();
    if (!user || user.isBanned) {
      return {
        error: true,
        message: "Acces refuse, connectez vous pour continuer!",
      };
    }

    // CHECK IF USER ALREADY SUBSCRIBBED ?

    // CREATE NEW SUBSCRIPTION
    const newAudio = await prisma.audioSubscriber.create({
      data: {
        audioDuration: data.audioDuration,
        taxiNumber: data.taxiNumber,
        subscriberId: user.id,
        companyName: data.companyName,
        clientPhone: data.phoneClient,
        price: data.price,
        audioCampaignId: data.audioCampaignId,
      },
    });

    return {
      error: false,
      audioSubscribedId: newAudio.id,
      message: "Votre souscription est en cours veuillez patientez",
    };
  } catch (error) {
    console.error("ERROR ON SUBSCRIB ON AUDIO", error);
    return {
      error: true,
      message: "Impossible de souscrire a cette offre!",
    };
  }
};

// SEND AUDIO
// actions/audioSubscrib.ts

export const updateAudioSubscriberUrl = async (
  audioSubscribedId: string,
  audioUrl: string,
) => {
  try {
    const user = await getUser();
    if (!user || user.isBanned) {
      return {
        error: true,
        message: "Acces refuse, connectez vous pour continuer!",
      };
    }

    const isAudioSubscribedExist = await prisma.audioSubscriber.findUnique({
      where: { id: audioSubscribedId },
    });

    if (!isAudioSubscribedExist) {
      return {
        error: true,
        message: "Impossible de souscrire a cette offre car elle n'existe pas!",
      };
    }

    if (user.id !== isAudioSubscribedExist.subscriberId) {
      return {
        error: true,
        message: "Non autorise!",
      };
    }

    await prisma.audioSubscriber.update({
      where: {
        id: audioSubscribedId,
      },
      data: {
        audioFile: audioUrl,
      },
    });

    return {
      error: false,
      message: "Audio ajoutee avec success",
    };
  } catch (error) {
    console.error("ERROR ON SUBSCRIB ON AUDIO", error);
    return {
      error: true,
      message: "Impossible de souscrire a cette offre!",
    };
  }
};

// GET ALL AUDIO SUBSCRIBERS
export const getAllAudiSubscribers = async () => {
  const user = await getUser();

  if (!user) return [];
  const subs = await prisma.audioSubscriber.findMany({
    where: { subscriberId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      audioCampaign: true,
    },
  });
  return subs || [];
};
