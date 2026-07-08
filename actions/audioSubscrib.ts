"use server";

import prisma from "@/lib/prisma";
import { getUser } from "./user";
import { v4 } from "uuid";
import {
  checkFlexpaiePaymentAfterDelais,
  processFlexpaiePayment,
} from "./flexpaieAction";

export type AudioSubcribersType = {
  audioCampaignId: string;
  taxiNumber: number;
  price: number;
  companyName: string;
  phoneClient: string;
  audioDuration: number;
};

export interface PaymentFlexpaieDataType {
  merchant: string;
  type: "1" | "2";
  phone: string;
  reference: string;
  amount: string;
  currency: "CDF" | "USD";
  callbackUrl: string;
}

export interface PaymentFlexpaieResponseType {
  code: "0" | "1";
  message: string;
  orderNumber: string;
}

// CREATE NEW AUDIO SUBSCRIBER
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

    const transaction_id = v4().toString().replace(/-/g, "");

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://servi-ads.com"
        : "http://localhost:3000";

    // Variables pour stocker la référence finale
    let paymentRef = transaction_id;

    // ==========================================
    // LOGIQUE DE DISTINCTION ADMIN vs CLIENT
    // ==========================================
    if (user.role.includes("ADMIN")) {
      // Si c'est un admin, on passe direct à la création avec une méthode "gratuit/admin"
      console.log(`Création de campagne par l'admin: ${user.id}`);
      paymentRef = `ADMIN-${transaction_id}`;
    } else {
      // Si ce n'est pas un admin, on procède au paiement Flexpaie normal
      const paymentResult = await processFlexpaiePayment(
        data,
        transaction_id,
        baseUrl,
      );

      if (paymentResult.error) {
        return {
          error: true,
          message: paymentResult.message,
          data: null,
        };
      }

      paymentRef = paymentResult.orderNumber || transaction_id;

      // ATTENTE DE 30 SECONDES POUR CONFIRMATION (Uniquement pour les clients)
      const isPaymentSuccessful = await checkFlexpaiePaymentAfterDelais(
        paymentRef,
        35,
      );

      if (!isPaymentSuccessful) {
        return {
          error: true,
          message: "Le paiement n'a pas été confirmé. Veuillez réessayer.",
          data: null,
        };
      }
    }

    // ==========================================
    // ENREGISTREMENT DANS LA BASE DE DONNÉES
    // ==========================================
    const newAudio = await prisma.audioSubscriber.create({
      data: {
        audioDuration: data.audioDuration,
        taxiNumber: data.taxiNumber,
        subscriberId: user.id,
        companyName: data.companyName,
        clientPhone: data.phoneClient,
        price: /*user.role.includes("ADMIN") ? 0 : */ data.price, // Optionnel : force le prix à 0 si admin
        audioCampaignId: data.audioCampaignId,
        paymentRef: paymentRef,
        paymentMethod: "flexpaie",
        limitDownloadNumber: data.taxiNumber,
      },
    });

    return {
      error: false,
      audioSubscribedId: newAudio.id,
      message: user.role.includes("ADMIN")
        ? "Votre souscription admin a été créée avec succès"
        : "Votre souscription est en cours veuillez patienter",
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
  audioDuration: number,
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
        audioDuration,
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
