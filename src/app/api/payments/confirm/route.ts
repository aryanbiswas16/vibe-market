import { NextResponse } from "next/server"
import { auth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit"
import { z } from "zod"

const schema = z.object({
  paymentIntentId: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rl = rateLimit({ key: `payment-confirm:${session.user.id}`, ...RATE_LIMITS.payment })
    if (!rl.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const body = await request.json()
    const data = schema.parse(body)

    // Retrieve the PaymentIntent from Stripe to verify status
    const paymentIntent = await stripe.paymentIntents.retrieve(data.paymentIntentId)

    if (paymentIntent.status !== "succeeded" && paymentIntent.status !== "requires_capture") {
      return NextResponse.json({
        error: `Payment not confirmed. Status: ${paymentIntent.status}`,
      }, { status: 400 })
    }

    // Map Stripe status to our status
    const paymentStatus = paymentIntent.status === "requires_capture" ? "succeeded" : paymentIntent.status

    // Update the payment record in DB
    const updated = await prisma.payment.updateMany({
      where: { stripePaymentIntentId: data.paymentIntentId },
      data: { status: paymentStatus },
    })

    // Also update the gig to in_progress if it was still open
    const payment = await prisma.payment.findFirst({
      where: { stripePaymentIntentId: data.paymentIntentId },
    })

    if (payment) {
      await prisma.gig.updateMany({
        where: { id: payment.gigId, status: "open" },
        data: { status: "in_progress" },
      })
    }

    return NextResponse.json({
      ok: true,
      status: paymentStatus,
      updated: updated.count,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Validation failed" }, { status: 400 })
    }
    console.error("POST /api/payments/confirm error:", error)
    return NextResponse.json({ error: "Payment confirmation failed" }, { status: 500 })
  }
}