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
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );

  return JSON.parse(jsonPayload);
}

export async function setTokenToCookie(
  cookieName: string,
  token: string,
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
