import { UserRole } from "@/lib/generated/prisma/enums";

declare module "next-auth" {
  interface User {
    id: string;
    email: string | null;
    name: string | null;
    image: string | null;
    role: UserRole;
    // tel: string;
    // address: string;
    isBanned: boolean;
    emailVerified: Date | null;
    createdAt: Date;
    updatedAt: Date;
    // isBuyingGeneralTermsAccepted: boolean;
  }

  interface Session {
    user: User | null; // ⬅️ Important
  }

  interface JWT {
    sub?: string;
    role?: UserRole;
  }
}
