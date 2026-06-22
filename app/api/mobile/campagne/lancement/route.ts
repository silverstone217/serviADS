import prisma from "@/lib/prisma";
import { AUTH_SECRET } from "@/utils/envVaraibles";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // AUTHORIZATION HEADER
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          error: true,
          message: "Token manquant, veuillez vous reconnecter!",
        },
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1];

    // VERIFY JWT
    try {
      jwt.verify(token, AUTH_SECRET);
    } catch {
      return NextResponse.json(
        {
          error: true,
          message: "Non autorisé, veuillez vous reconnecter!",
        },
        { status: 401 },
      );
    }

    const now = new Date();

    // RECUPERER LES CAMPAGNES
    const campaigns = await prisma.audioCampaign.findMany({
      include: {
        audioSubscribers: {
          select: {
            id: true,
            audioFile: true,
            audioDuration: true,
            companyName: true,
            clientPhone: true,
            taxiNumber: true,
            zone: true,
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

      // duration est en semaines
      endDate.setDate(endDate.getDate() + campaign.duration * 7);

      return now >= startDate && now <= endDate;
    });

    // AUCUNE CAMPAGNE ACTIVE
    if (!currentCampaign) {
      return NextResponse.json(
        {
          error: false,
          campaign: null,
          message: "Aucune campagne active",
        },
        { status: 200 },
      );
    }

    // CAMPAGNE ACTIVE
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
      {
        error: true,
        message: "Impossible de faire cette action",
      },
      { status: 500 },
    );
  }
}
