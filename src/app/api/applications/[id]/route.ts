import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth-helpers"
import { NextResponse } from "next/server"
import { z } from "zod"

const updateStatusSchema = z.object({
  status: z.enum(["accepted", "rejected", "completed"]),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Find the application
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        gig: {
          select: { devId: true },
        },
      },
    })

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    // Check if the requesting user is the dev who owns the gig
    if (application.gig.devId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this gig" }, { status: 403 })
    }

    const body = await request.json()
    const parsed = updateStatusSchema.parse(body)

    const updated = await prisma.application.update({
      where: { id },
      data: { status: parsed.status },
      include: {
        gig: true,
        streamer: {
          select: {
            id: true,
            name: true,
            handle: true,
            image: true,
          },
        },
      },
    })

    // If application is accepted, update gig status to in_progress
    if (parsed.status === "accepted") {
      await prisma.gig.update({
        where: { id: application.gigId },
        data: { status: "in_progress" },
      })
    }

    return NextResponse.json({ application: updated })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 })
    }
    console.error("PATCH /api/applications/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}