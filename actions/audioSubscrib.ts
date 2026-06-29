"use server";

import prisma from "@/lib/prisma";
import { getUser } from "./user";
import { v4 } from "uuid";
import {
  FLEXPAIE_MERCHANT_CODE,
  FLEXPAIE_TOKEN,
  FLEXPAIE_URL_API,
} from "@/utils/envVaraibles";
import { checkFlexpaiePaymentAfterDelais } from "./flexpaieAction";

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

    // FLEXPAIE PAYMENT ENGAGED
    // proceed to create order
    const transaction_id = v4().toString().replace(/-/g, "");
    const flexpaieApiToken = FLEXPAIE_TOKEN;
    const flexpaieApiUrl = FLEXPAIE_URL_API;

    // URL to notify
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://servi-ads.com"
        : "http://localhost:3000";

    const flexpaieData: PaymentFlexpaieDataType = {
      merchant: FLEXPAIE_MERCHANT_CODE,
      type: "1",
      phone: `243${data.phoneClient.replace(/^0/, "")}`,
      reference: transaction_id,
      amount: data.price.toString(),
      currency: "USD",
      callbackUrl: baseUrl + "/audio/mes-campagnes",
    };

    // call flexpaie api to init payment
    // const response = await fetch(flexpaieApiUrl, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${flexpaieApiToken}`,
    //   },
    //   body: JSON.stringify(flexpaieData),
    // });

    // console.log("Flexpaie response:", response);

    // const dataResponse = (await response.json()) as PaymentFlexpaieResponseType;

    // console.log("RESPONSE:", dataResponse);

    // if (!response.ok) {
    //   throw new Error(
    //     `Flexpaie Error ${response.status}: ${JSON.stringify(dataResponse)}`,
    //   );
    // }

    // console.log("Flexpaie data:", data);

    // Paiement accepté, préparer les données de commande
    // const paymentCode = dataResponse.code;

    // if (paymentCode !== "0") {
    //   return {
    //     error: true,
    //     message: `Le paiement a échoué: ${dataResponse.message}`,
    //     data: null,
    //   };
    // }

    const paymentRef = transaction_id; /*dataResponse.orderNumber;*/

    // WAIT 30 SECONDS BEFORE CALLING THE NEW ORDER ACTION TO ENSURE PAYMENT IS PROCESSED
    // const isPaymentSuccessful = await checkFlexpaiePaymentAfterDelais(
    //   paymentRef,
    //   35,
    // );

    // if (!isPaymentSuccessful) {
    //   return {
    //     error: true,
    //     message: "Le paiement n'a pas été confirmé. Veuillez réessayer.",
    //     data: null,
    //   };
    // }

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
        paymentRef: paymentRef || transaction_id,
        paymentMethod: "flexpaie",
        limitDownloadNumber: data.taxiNumber,
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
