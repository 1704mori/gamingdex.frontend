import { jwtVerify } from "jose";
import { setCookie } from "./utils";

export async function decodeAndVerifyJWT(token: string) {
  const verified = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.SECRET_TOKEN),
  );

  if (!verified.payload) {
    return "could not verify token";
  }

  return verified.payload;
}

function decodeOnlyJWT(token: string): Record<string, unknown> | null {
  if (!token) {
    return null;
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
  }

  try {
    const payload = parts[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(base64);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Failed to decode JWT", error);
    return null;
  }
}

export async function setTokenToCookie(
  token: string,
  cookieName: string,
): Promise<string> {
  if (!token) {
    return "token not found";
  }

  let fn: Function = decodeAndVerifyJWT;
  if (typeof window != undefined) {
    fn = decodeOnlyJWT;
  }

  const payload = await fn(token);
  if (typeof payload == "string") {
    return payload;
  }

  const { exp } = payload;

  const currentTime = Math.floor(Date.now() / 1000);

  const hoursUntilExpiration = (exp! - currentTime) / 3600;

  setCookie(cookieName, token, Math.max(hoursUntilExpiration, 0));
  return "";
}
