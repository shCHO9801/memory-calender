"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getAccessToken } from "@/lib/auth-storage";

export function useAuthGuard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    // localStorage is only available after the client mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAuthenticated(true);
  }, [router]);

  return isAuthenticated;
}
