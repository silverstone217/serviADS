import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { AUTH_SECRET } from "@/utils/envVaraibles";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json(
        { error: true, message: "Tous les champs sont obligatoires" },
        { status: 400 },
      );
    }

    const isUserExist = await prisma.taxiUser.findUnique({
      where: { phone },
    });

    // CHECK IF USER EXISTS
    if (!isUserExist) {
      return NextResponse.json(
        { error: true, message: "Numéro ou mot de passe incorrect" },
        { status: 401 },
      );
    }

    // is user banned ?
    const isBanned = isUserExist.isBanned;

    if (isBanned) {
      return NextResponse.json(
        { error: true, message: "Vous avez ete banni!" },
        { status: 400 },
      );
    }

    // COMPARE PASSWORD
    const comparePassword = await bcrypt.compare(
      password,
      isUserExist.password,
    );

    if (!comparePassword) {
      return NextResponse.json(
        { error: true, message: "Mot de passe incorrect!" },
        { status: 401 },
      );
    }

    const token = jwt.sign({ phone, id: isUserExist.id }, AUTH_SECRET);

    return NextResponse.json(
      {
        error: false,
        message: "Connexion reussie",
        token,
        user: {
          id: isUserExist.id,
          name: isUserExist.name,
          phone: isUserExist.phone,
          isBanned: isUserExist.isBanned,
          createdAt: isUserExist.createdAt,
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
