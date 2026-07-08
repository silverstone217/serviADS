"use server";
import {
  FLEXPAIE_MERCHANT_CODE,
  FLEXPAIE_TOKEN,
  FLEXPAIE_URL_API,
  FLEXPAIE_URL_API_CHECK_ORDER,
} from "@/utils/envVaraibles";

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

export const processFlexpaiePayment = async (
  data: AudioSubcribersType,
  transaction_id: string,
  baseUrl: string,
): Promise<{ error: boolean; message?: string; orderNumber?: string }> => {
  const flexpaieApiToken = FLEXPAIE_TOKEN;
  const flexpaieApiUrl = FLEXPAIE_URL_API;

  const flexpaieData: PaymentFlexpaieDataType = {
    merchant: FLEXPAIE_MERCHANT_CODE,
    type: "1",
    phone: `243${data.phoneClient.replace(/^0/, "")}`,
    reference: transaction_id,
    amount: data.price.toString(),
    currency: "USD",
    callbackUrl: baseUrl + "/audio/mes-campagnes",
  };

  // Appel API Flexpaie pour initialiser le paiement
  const response = await fetch(flexpaieApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${flexpaieApiToken}`,
    },
    body: JSON.stringify(flexpaieData),
  });

  console.log("Flexpaie response:", response);
  const dataResponse = (await response.json()) as PaymentFlexpaieResponseType;
  console.log("RESPONSE:", dataResponse);

  if (!response.ok) {
    throw new Error(
      `Flexpaie Error ${response.status}: ${JSON.stringify(dataResponse)}`,
    );
  }

  console.log("Flexpaie data:", data);

  // Vérification du code de paiement
  if (dataResponse.code !== "0") {
    return {
      error: true,
      message: `Le paiement a échoué: ${dataResponse.message}`,
    };
  }

  return {
    error: false,
    orderNumber: dataResponse.orderNumber,
  };
};

export async function checkFlexpaiePaymentAfterDelais(
  paymentRef: string,
  delaySeconds: number,
): Promise<boolean> {
  // 1️⃣ attendre 30 secondes côté serveur
  await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));
  try {
    const response = await fetch(
      `${FLEXPAIE_URL_API_CHECK_ORDER}${paymentRef}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${FLEXPAIE_TOKEN}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return false;
    }

    const paymentData = await response.json();

    console.log("Flexpaie check (server):", paymentData);

    if (paymentData.code !== "0") {
      return false;
    }

    // ✅ status "0" = paiement confirmé (selon ta logique actuelle)
    if (paymentData.transaction?.status === "0") {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Flexpaie check error:", error);
    return false;
  }
}
