import crypto from "crypto";
import { promisify } from "util";

const scrypt = promisify(crypto.scrypt);

export async function hash(password: string) {
  const salt = crypto.randomBytes(8).toString("hex");

  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return salt + ":" + derivedKey.toString("hex");
}

export async function verify(password: string, hash: string) {
  const [salt, key] = hash.split(":");
  const keyBuffer = Buffer.from(key, "hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return crypto.timingSafeEqual(keyBuffer, derivedKey);
}
