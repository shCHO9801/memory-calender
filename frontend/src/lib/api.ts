import {
  getAccessToken,
  removeAccessToken,
} from "@/lib/auth-storage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
}

export type ApiErrorResponse = {
  status: number;
  message: string;
  code: string | null;
  field: string | null;
};

export class ApiError extends Error {
  status: number;
  code: string | null;
  field: string | null;

  constructor(response: ApiErrorResponse) {
    super(response.message);

    this.name = "ApiError";
    this.status = response.status;
    this.code = response.code;
    this.field = response.field;
  }
}

export async function apiFetch<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
  const token = getAccessToken();

  const headers = new Headers(options.headers);

  if (token) {
    headers.set(
        "Authorization",
        `Bearer ${token}`,
    );
  }

  if (
      options.body &&
      !headers.has("Content-Type")
  ) {
    headers.set(
        "Content-Type",
        "application/json",
    );
  }

  const response = await fetch(
      `${API_BASE_URL}${path}`,
      {
        ...options,
        headers,
      },
  );

  if (response.status === 401) {
    removeAccessToken();

    if (typeof window !== "undefined") {
      window.location.replace("/login");
    }
  }

  if (!response.ok) {
    let errorResponse: ApiErrorResponse;

    try {
      errorResponse =
          (await response.json()) as ApiErrorResponse;
    } catch {
      errorResponse = {
        status: response.status,
        message: "요청 처리에 실패했습니다.",
        code: null,
        field: null,
      };
    }

    throw new ApiError(errorResponse);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}