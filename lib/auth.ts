import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import Google from "next-auth/providers/google";
import {
  AUTH_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "@/utils/envVaraibles";
import { UserRole } from "./generated/prisma/enums";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    // Google Provider
    Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    // Facebook Provider (Désactivé pour l'instant)
  ],

  secret: AUTH_SECRET,
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async session({ session, token }) {
      if (!token?.sub) return session;

      const user = await prisma.user.findUnique({
        where: { id: token.sub },
      });

      if (!user) {
        return {
          ...session,
          user: null,
        };
      }

      session.user = {
        id: user.id,
        name: user.name ?? "",
        email: user.email ?? "",
        image: user.image ?? "",
        // tel: user.tel ?? "",
        // address: user.address ?? "",
        role: (user.role as UserRole) ?? "USER",
        isBanned: user.isBanned ?? false,
        emailVerified: user.emailVerified ?? null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return session;
    },
  },
});
