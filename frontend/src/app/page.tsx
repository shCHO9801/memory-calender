"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";

import {
  getAccessToken,
  isAccessTokenExpired,
  removeAccessToken,
} from "@/lib/auth-storage";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    if (isAccessTokenExpired(token)) {
      removeAccessToken();
      router.replace("/login");
      return;
    }

    router.replace("/dashboard");
  }, [router]);

  return null;
}