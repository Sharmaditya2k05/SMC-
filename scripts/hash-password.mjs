// Usage: npm run hash-password -- "your password"
// Prints the value for ADMIN_PASSWORD_HASH and a fresh SESSION_SECRET.
import { randomBytes, scryptSync } from "node:crypto";
const pw = process.argv[2];
if (!pw || pw.length < 10) {
  console.error('Give a password of at least 10 characters:  npm run hash-password -- "…"');
  process.exit(1);
}
const salt = randomBytes(16);
console.log(`ADMIN_PASSWORD_HASH=${salt.toString("hex")}:${scryptSync(pw, salt, 64).toString("hex")}`);
console.log(`SESSION_SECRET=${randomBytes(32).toString("hex")}`);
