import { apiFetch } from "@/lib/api";
import type { SignInRequest, SignInResponse } from "@/types/auth";

export function signIn(request: SignInRequest) {
  return apiFetch<SignInResponse>("/api/auth/signin", {
    method: "POST",
    body: JSON.stringify(request),
  });
}
