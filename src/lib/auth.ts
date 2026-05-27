export const ADMIN_COOKIE_NAME = "admin_auth";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24;

const encoder = new TextEncoder();

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "tamraght2026";
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "tamraght2026";
}

function base64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function sign(message: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return base64Url(new Uint8Array(signature));
}

export async function createAdminSessionToken() {
  const expiresAt = Date.now() + ADMIN_SESSION_MAX_AGE * 1000;
  const payload = String(expiresAt);
  return `v1.${payload}.${await sign(payload)}`;
}

export async function verifyAdminSessionToken(token: string | undefined) {
  if (!token) {
    return false;
  }

  const [version, expiresAt, signature] = token.split(".");
  if (version !== "v1" || !expiresAt || !signature) {
    return false;
  }

  const expiry = Number.parseInt(expiresAt, 10);
  if (!Number.isFinite(expiry) || expiry < Date.now()) {
    return false;
  }

  return signature === (await sign(expiresAt));
}

export async function isValidAdminPassword(password: string) {
  return password === getAdminPassword();
}
