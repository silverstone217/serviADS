"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const getUser = async () => {
  const session = await auth();

  if (session?.user) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    return user ?? null;
  }

  return null;
};
