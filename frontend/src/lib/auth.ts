import { apiFetch } from "@/lib/api";
import type {
  CheckEmailResponse,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
} from "@/types/auth";

export function signIn(request: SignInRequest) {
  return apiFetch<SignInResponse>("/api/auth/signin", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function signUp(request: SignUpRequest) {
  return apiFetch<SignUpResponse>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function checkEmail(email: string) {
  return apiFetch<CheckEmailResponse>(
    `/api/auth/check-email?email=${encodeURIComponent(email)}`,
  );
}
