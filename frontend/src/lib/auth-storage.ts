export const ACCESS_TOKEN_KEY = "accessToken";

type JwtPayload = {
  exp?: number;
};

export function getAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function removeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function isAccessTokenExpired(
    token: string,
): boolean {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return true;
    }

    const payload = decodeJwtPayload(parts[1]);

    if (
        typeof payload.exp !== "number"
    ) {
      return true;
    }

    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

function decodeJwtPayload(
    encodedPayload: string,
): JwtPayload {
  const base64 = encodedPayload
      .replace(/-/g, "+")
      .replace(/_/g, "/");

  const padded = base64.padEnd(
      Math.ceil(base64.length / 4) * 4,
      "=",
  );

  const json = decodeURIComponent(
      Array.from(atob(padded))
          .map(
              (char) =>
                  `%${char
                      .charCodeAt(0)
                      .toString(16)
                      .padStart(2, "0")}`,
          )
          .join(""),
  );

  return JSON.parse(json) as JwtPayload;
}