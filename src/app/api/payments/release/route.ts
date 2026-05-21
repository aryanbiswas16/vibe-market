import { NextResponse } from "next/server"
import { auth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { getStripe } from "@/lib/stripe"
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit"
import { z } from "zod"

const schema = z.object({
  gigId: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rl = rateLimit({ key: `release:${session.user.id}`, ...RATE_LIMITS.payment })
    if (!rl.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const body = await request.json()
    const data = schema.parse(body)

    const gig = await prisma.gig.findUnique({ where: { id: data.gigId } })
    if (!gig) return NextResponse.json({ error: "Gig not found" }, { status: 404 })
    if (gig.devId !== session.user.id) {
      return NextResponse.json({ error: "You don't own this gig" }, { status: 403 })
    }
    if (gig.status !== "in_progress") {
      return NextResponse.json({ error: "Gig must be in progress" }, { status: 400 })
    }

    const payment = await prisma.payment.findFirst({
      where: { gigId: data.gigId, status: "succeeded" },
    })
    if (!payment?.stripePaymentIntentId) {
      return NextResponse.json({ error: "No successful payment found" }, { status: 400 })
    }

    const stripe = getStripe()

    // Capture the payment intent (release funds from hold)
    const intent = await stripe.paymentIntents.capture(payment.stripePaymentIntentId)

    // If streamer has Stripe Connect account, transfer funds minus fee
    const streamer = payment.payeeId ? await prisma.user.findUnique({ where: { id: payment.payeeId } }) : null
    let transferId: string | null = null

    if (streamer?.stripeAccountId && intent.status === "succeeded") {
      const transfer = await stripe.transfers.create({
        amount: payment.amount - payment.fee,
        currency: "usd",
        destination: streamer.stripeAccountId,
        transfer_group: `gig_${data.gigId}`,
      })
      transferId = transfer.id
    }

    // Update everything in parallel
    const [updatedPayment] = await Promise.all([
      prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "released",
          stripeTransferId: transferId,
        },
      }),
      prisma.gig.update({
        where: { id: data.gigId },
        data: { status: "completed" },
      }),
      prisma.application.updateMany({
        where: { gigId: data.gigId, status: "accepted" },
        data: { status: "completed" },
      }),
      payment.payeeId
        ? prisma.user.update({
            where: { id: payment.payeeId },
            data: { totalGigsCompleted: { increment: 1 } },
          })
        : Promise.resolve(),
    ])

    return NextResponse.json({
      ok: true,
      payment: updatedPayment,
      intentStatus: intent.status,
      transferCreated: !!transferId,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Validation failed" }, { status: 400 })
    }
    console.error("POST /api/payments/release error:", error)
    return NextResponse.json({ error: "Payment release failed" }, { status: 500 })
  }
}
