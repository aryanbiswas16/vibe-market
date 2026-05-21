import { NextResponse } from "next/server"
import { auth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Verify the user is the dev who owns this gig
    const gig = await prisma.gig.findUnique({
      where: { id },
      select: { devId: true },
    })
    if (!gig) {
      return NextResponse.json({ error: "Gig not found" }, { status: 404 })
    }
    if (gig.devId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const payment = await prisma.payment.findFirst({
      where: { gigId: id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ payment })
  } catch (error) {
    console.error("GET /api/payments/gig/[id] error:", error)
    return NextResponse.json({ error: "Failed to fetch payment" }, { status: 500 })
  }
}