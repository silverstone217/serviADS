import prisma from "@/lib/prisma";
import { AUTH_SECRET } from "@/utils/envVaraibles";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: true, message: "Non autorisé" },
        { status: 401 },
      );
    }

    jwt.verify(authHeader.split(" ")[1], AUTH_SECRET);

    const { audioId } = await request.json();

    const result = await prisma.audioSubscriber.updateMany({
      where: {
        id: audioId,
        limitDownloadNumber: {
          gt: 0,
        },
      },
      data: {
        limitDownloadNumber: {
          decrement: 1,
        },
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        {
          error: true,
          message: "Quota de téléchargement atteint.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      error: false,
      message: "Téléchargement validé.",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error: true,
        message: "Erreur serveur",
      },
      { status: 500 },
    );
  }
}
