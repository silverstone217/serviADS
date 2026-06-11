"use client";

import { getUser } from "@/actions/user";
import { User } from "@/lib/generated/prisma/client";
import { useEffect, useState } from "react";

export function useGetUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const currentUser = await getUser();

        if (mounted) {
          setUser(currentUser);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    user,
    loading,
  };
}
