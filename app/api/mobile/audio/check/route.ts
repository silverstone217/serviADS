import prisma from "@/lib/prisma";
import { AUTH_SECRET } from "@/utils/envVaraibles";
import { isCampaignRunning } from "@/utils/functions";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // AUTHENTIFICATION
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          error: true,
          message: "Token manquant.",
        },
        { status: 401 },
      );
    }

    try {
      jwt.verify(authHeader.split(" ")[1], AUTH_SECRET);
    } catch {
      return NextResponse.json(
        {
          error: true,
          message: "Non autorisé.",
        },
        { status: 401 },
      );
    }

    // BODY
    const { campaignId } = await request.json();

    if (!campaignId) {
      return NextResponse.json(
        {
          error: true,
          message: "campaignId est requis.",
        },
        { status: 400 },
      );
    }

    // RECHERCHE DE LA CAMPAGNE
    const campaign = await prisma.audioCampaign.findUnique({
      where: {
        id: campaignId,
      },
    });

    // Campagne supprimée
    if (!campaign) {
      return NextResponse.json({
        error: false,
        exists: false,
        active: false,
      });
    }

    // Vérification de la période de validité
    const active = isCampaignRunning(campaign.startDate, campaign.duration);

    return NextResponse.json({
      error: false,
      exists: true,
      active,
    });
  } catch (error) {
    console.log("CHECK_CAMPAIGN_ERROR", error);

    return NextResponse.json(
      {
        error: true,
        message: "Impossible de vérifier la campagne.",
      },
      { status: 500 },
    );
  }
}
