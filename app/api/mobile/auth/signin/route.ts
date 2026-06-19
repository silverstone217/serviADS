import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AUTH_SECRET } from "@/utils/envVaraibles";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, password, name } = body;

    if (!phone || !password || !name) {
      return NextResponse.json(
        { erreur: true, message: "Tous les champs sont obligatoires" },
        { status: 400 },
      );
    }

    const isUserExist = await prisma.taxiUser.findUnique({
      where: { phone },
    });

    // CHECK IF USER EXISTS
    if (isUserExist) {
      return NextResponse.json(
        { erreur: true, message: "Ce numéro existe déjà" },
        { status: 409 }, // Conflict
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // CREATE USER
    const user = await prisma.taxiUser.create({
      data: {
        password: hashPassword,
        phone,
        name,
      },
    });

    const token = jwt.sign({ phone, id: user.id }, AUTH_SECRET);

    return NextResponse.json(
      {
        erreur: false,
        message: "Votre compte a été créé",
        token,
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          createdAt: user.createdAt,
          isBanned: user.isBanned,
        },
      },
      { status: 201 },
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
