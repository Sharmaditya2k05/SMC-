/**
 * Admin password storage. The password set in the admin panel is kept as a
 * salted scrypt hash in the database and takes precedence over the
 * ADMIN_PASSWORD_HASH environment variable, which remains the fallback
 * (and the way back in if the stored one is ever lost).
 */
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { get, upsert } from "./store";

export function hashPassword(password: string) {
  const salt = randomBytes(16);
  return `${salt.toString("hex")}:${scryptSync(password, salt, 64).toString("hex")}`;
}

function matches(password: string, stored: string) {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(password, Buffer.from(saltHex, "hex"), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

async function currentHash() {
  const saved = await get("site", "auth").catch(() => null);
  return (saved?.passwordHash as string | undefined) || process.env.ADMIN_PASSWORD_HASH || "";
}

export async function passwordIsCorrect(password: string) {
  const hash = await currentHash();
  return Boolean(hash) && matches(password, hash);
}

export async function checkLogin(username: string, password: string) {
  const expectedUser = (process.env.ADMIN_USERNAME ?? "").trim().toLowerCase();
  const a = Buffer.from(username.trim().toLowerCase());
  const b = Buffer.from(expectedUser);
  const userOk = expectedUser.length > 0 && a.length === b.length && timingSafeEqual(a, b);
  // always run the password check so timing does not reveal whether the username was right
  const passOk = await passwordIsCorrect(password);
  return userOk && passOk;
}

export async function setPassword(password: string) {
  await upsert("site", { id: "auth", passwordHash: hashPassword(password), changedAt: new Date().toISOString() });
}
