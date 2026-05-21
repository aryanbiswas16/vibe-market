const requiredEnvVars = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
] as const

export function validateEnv() {
  const missing: string[] = []
  for (const key of requiredEnvVars) {
    if (!process.env[key] || process.env[key] === "") {
      missing.push(key)
    }
  }
  if (missing.length > 0) {
    console.warn(`⚠️ Missing required environment variables: ${missing.join(", ")}`)
    console.warn("Some features may not work correctly.")
  }
}

// Call at import time
validateEnv()

export const env = {
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  nextauthUrl: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
  nextauthSecret: process.env.NEXTAUTH_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "file:./dev.db",
} as const