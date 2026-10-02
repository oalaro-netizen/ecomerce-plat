/**
 * Fail-fast env validation, run before the server binds or connects to
 * Mongo. Throws if JWT_SECRET is missing or still the placeholder so
 * auth tokens can never be signed with a known secret.
 */
const PLACEHOLDER_SECRET = "change-me-to-a-long-random-string";

export function validateEnv() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set. Add it to server/.env.");
  }
  if (process.env.JWT_SECRET === PLACEHOLDER_SECRET) {
    throw new Error(
      "JWT_SECRET is still the placeholder. Set a real random value in server/.env."
    );
  }
}

/** Generate a strong random secret for local development. */
if (process.env.NODE_ENV !== "production" && !process.env.JWT_SECRET) {
  console.warn(
    "Warning: JWT_SECRET not set. Using a development-only placeholder.\n" +
      "Set JWT_SECRET in server/.env before deploying!"
  );
  process.env.JWT_SECRET = "dev-secret-" + Math.random().toString(36).slice(2);
}
