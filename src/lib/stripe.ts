import Stripe from "stripe"

let stripeClient: Stripe | null = null

export function getStripe() {
  const apiKey = process.env.STRIPE_SECRET_KEY

  if (!apiKey) {
    throw new Error("STRIPE_SECRET_KEY is required for payment operations")
  }

  stripeClient ??= new Stripe(apiKey, {
    apiVersion: "2026-04-22.dahlia",
    typescript: true,
  })

  return stripeClient
}

export const PLATFORM_FEE_PERCENT = 10
export const CURRENCY = "usd"

export function calculateFee(amountInCents: number): number {
  return Math.round(amountInCents * (PLATFORM_FEE_PERCENT / 100))
}
