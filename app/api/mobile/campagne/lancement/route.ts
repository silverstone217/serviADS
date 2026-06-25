import prisma from "@/lib/prisma";
import { AUTH_SECRET } from "@/utils/envVaraibles";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

// Typage des logs reçus du client mobile
interface IncomingLog {
  date: string; // "YYYY-MM-DD"
  campaignId: string;
  totalDuration: number; // En secondes
  avgSpeed: number; // En km/h
}

export async function POST(request: NextRequest) {
  try {
    // 1️⃣ AUTHORIZATION HEADER & VERIFY JWT
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: true, message: "Token manquant, veuillez vous reconnecter!" },
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1];
    try {
      jwt.verify(token, AUTH_SECRET);
    } catch {
      return NextResponse.json(
        { error: true, message: "Non autorisé, veuillez vous reconnecter!" },
        { status: 401 },
      );
    }

    // 2️⃣ EXTRACTION DU BODY
    const body = await request.json();
    const logs: IncomingLog[] = body.logs || [];
    const taxiUserId: string = body.TaxiUserId;

    // 3️⃣ TRAITEMENT ET SAUVEGARDE DES LOGS (Si présents)
    if (logs.length > 0) {
      // Vérification stricte de l'existence du chauffeur de taxi
      const taxiExists = await prisma.taxiUser.findUnique({
        where: { id: taxiUserId },
      });

      if (!taxiExists) {
        return NextResponse.json(
          { error: true, message: "Utilisateur Taxi non trouvé ou invalide." },
          { status: 404 },
        );
      }

      // Traitement de chaque ligne de log reçue
      for (const log of logs) {
        // Vérification que la campagne ciblée par ce log existe bien dans notre DB
        const campaignExists = await prisma.audioCampaign.findUnique({
          where: { id: log.campaignId },
        });

        if (!campaignExists) {
          console.log(`Campagne ${log.campaignId} introuvable. Log ignoré.`);
          continue; // On passe au log suivant sans crash
        }

        // Conversion du string "YYYY-MM-DD" en objet Date natif pour Prisma
        const logDate = new Date(log.date);

        // Sauvegarde intelligente (Upsert) pour gérer l'index @@unique
        await prisma.audioLogs.upsert({
          where: {
            taxiUserId_campaignId_date: {
              taxiUserId: taxiUserId,
              campaignId: log.campaignId,
              date: logDate,
            },
          },
          update: {
            // Si le log existe déjà pour ce jour, on additionne le temps et fait la moyenne des vitesses
            totalDuration: { increment: log.totalDuration },
            avgSpeed: log.avgSpeed, // Remplacé par la dernière vitesse moyenne globale calculée
          },
          create: {
            taxiUserId: taxiUserId,
            campaignId: log.campaignId,
            date: logDate,
            totalDuration: log.totalDuration,
            avgSpeed: log.avgSpeed,
          },
        });
      }
    }

    // 4️⃣ RÉCUPÉRATION DES CAMPAGNES POUR LE RETOUR MOBILE
    const now = new Date();
    const campaigns = await prisma.audioCampaign.findMany({
      include: {
        audioSubscribers: {
          select: {
            id: true,
            audioFile: true,
            audioDuration: true,
            companyName: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
    });

    // TROUVER LA CAMPAGNE ACTIVE
    const currentCampaign = campaigns.find((campaign) => {
      const startDate = new Date(campaign.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + campaign.duration * 7);

      return now >= startDate && now <= endDate;
    });

    // RÉSULTAT STANDARD SI AUCUNE CAMPAGNE
    if (!currentCampaign) {
      return NextResponse.json(
        {
          error: false,
          campaign: null,
          message: "Logs enregistrés. Aucune campagne active à diffuser.",
        },
        { status: 200 },
      );
    }

    // RETOUR AVEC LA CAMPAGNE FRAICHEMENT ACTIVÉE
    return NextResponse.json(
      {
        error: false,
        campaign: {
          id: currentCampaign.id,
          name: currentCampaign.name,
          startDate: currentCampaign.startDate,
          duration: currentCampaign.duration,
          costPerAudio: currentCampaign.costPerAudio,
          audioMaxDuration: currentCampaign.audioMaxDuration,
          audios: currentCampaign.audioSubscribers,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("ERROR_MOBILE", error);
    return NextResponse.json(
      { error: true, message: "Impossible de faire cette action" },
      { status: 500 },
    );
  }
}
