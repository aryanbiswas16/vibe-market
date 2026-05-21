import { NextResponse } from "next/server"
import { auth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { stripe, calculateFee, CURRENCY } from "@/lib/stripe"
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit"
import { z } from "zod"

const schema = z.object({
  gigId: z.string().min(1),
  applicationId: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Rate limit
    const rl = rateLimit({ key: `payment:${session.user.id}`, ...RATE_LIMITS.payment })
    if (!rl.success) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 })
    }

    const body = await request.json()
    const data = schema.parse(body)

    // Verify dev owns the gig
    const gig = await prisma.gig.findUnique({
      where: { id: data.gigId },
      include: { dev: true },
    })
    if (!gig) return NextResponse.json({ error: "Gig not found" }, { status: 404 })
    if (gig.devId !== session.user.id) {
      return NextResponse.json({ error: "You don't own this gig" }, { status: 403 })
    }

    // Verify application exists and is accepted
    const application = await prisma.application.findUnique({
      where: { id: data.applicationId },
      include: { streamer: true },
    })
    if (!application || application.gigId !== data.gigId) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }
    if (application.status !== "accepted") {
      return NextResponse.json({ error: "Application must be accepted first" }, { status: 400 })
    }

    // Check no existing active payment
    const existingPayment = await prisma.payment.findFirst({
      where: {
        gigId: data.gigId,
        applicationId: data.applicationId,
        status: { notIn: ["failed", "refunded"] },
      },
    })
    if (existingPayment) {
      return NextResponse.json({ error: "Payment already exists for this application" }, { status: 409 })
    }

    const amountInCents = gig.budget * 100
    const fee = calculateFee(amountInCents)

    // Create Stripe PaymentIntent (manual capture)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: CURRENCY,
      metadata: {
        gigId: gig.id,
        applicationId: application.id,
        devId: session.user.id,
        streamerId: application.streamerId,
      },
      description: `Payment for gig: ${gig.title}`,
      capture_method: "manual",
    })

    // Create Payment record
    const payment = await prisma.payment.create({
      data: {
        gigId: gig.id,
        applicationId: application.id,
        payerId: session.user.id,
        payeeId: application.streamerId,
        amount: amountInCents,
        fee,
        stripePaymentIntentId: paymentIntent.id,
        status: "requires_action",
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id,
      amount: amountInCents,
      fee,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Validation failed" }, { status: 400 })
    }
    console.error("POST /api/payments/create-intent error:", error)
    return NextResponse.json({ error: "Payment creation failed" }, { status: 500 })
  }
}