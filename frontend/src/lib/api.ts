const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

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
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorResponse =
      (await response.json()) as ApiErrorResponse;

    throw new ApiError(errorResponse);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
