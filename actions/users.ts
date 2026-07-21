"use server";

import prisma from "@/lib/prisma";
import { getUser } from "./user";
import { revalidatePath } from "next/cache";

// GET ALL USERS AND TAXIS BASED ON ADMIN PANELS
export const getUsers = async () => {
  try {
    const user = await getUser();
    if (!user || !user.role || user.role !== "ADMIN") {
      return null;
    }

    const taxis = await prisma.taxiUser.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        isBanned: true,
        // role: true,
        createdAt: true,
        phone: true,
      },
    });

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        isBanned: true,
        role: true,
        createdAt: true,
      },
    });

    const mappedUsers = users ? users.map((u) => ({ ...u, phone: "N/A" })) : [];

    const combinedUsers = {
      taxis,
      users: mappedUsers,
    };

    return combinedUsers;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    return null;
  }
};

// GET TAXI WITH DEATILS BASED ON ID

export const getTaxiById = async (id: string) => {
  try {
    const user = await getUser();

    if (!user || !user.role || user.role !== "ADMIN") {
      //   console.log(
      //     "❌ REFUSÉ: L'utilisateur n'est pas ADMIN ou n'est pas connecté.",
      //   );
      return null;
    }

    const taxi = await prisma.taxiUser.findUnique({
      where: { id },
      include: {
        logs: true,
        taxiConfigs: true,
      },
    });

    // console.log(
    //   "👉 TAXI TROUVÉ DANS DB :",
    //   taxi ? taxi.id : "AUCUN TAXI TROUVÉ",
    // );

    if (!taxi) return null;

    return taxi; // ⚠️ Assurez-vous que le return taxi est bien là !
  } catch (error) {
    console.error("Erreur lors de la récupération du taxi :", error);
    return null;
  }
};

// BAN TAXI USER
export async function toggleBanTaxi(data: {
  id: string;
  isBanned: boolean;
  banReason?: string;
  banExpiresAt?: Date | null;
}) {
  try {
    const user = await getUser();
    if (!user || user.role !== "ADMIN") {
      return { success: false, message: "Non autorisé" };
    }

    await prisma.taxiUser.update({
      where: { id: data.id },
      data: {
        isBanned: data.isBanned,
        banReason: data.isBanned ? data.banReason : null,
        banExpiresAt: data.isBanned ? data.banExpiresAt : null,
      },
    });

    revalidatePath(`/admins/utilisateurs/taxis/${data.id}`);
    return { success: true };
  } catch (error) {
    console.error("Erreur toggleBanTaxi:", error);
    return { success: false, message: "Une erreur est survenue" };
  }
}
