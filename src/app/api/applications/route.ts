import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth-helpers"
import { NextResponse } from "next/server"
import { z } from "zod"

const createAppSchema = z.object({
  gigId: z.string().min(1, "Gig ID is required"),
  message: z.string().min(1, "Message is required"),
})

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const url = new URL(request.url)
    const statusFilter = url.searchParams.get("status") || ""
    const gigIdFilter = url.searchParams.get("gigId") || ""

    let applications

    if (user.role === "streamer") {
      // Streamer sees their own applications
      const where: any = { streamerId: user.id }
      if (statusFilter) where.status = statusFilter
      if (gigIdFilter) where.gigId = gigIdFilter

      applications = await prisma.application.findMany({
        where,
        include: {
          gig: {
            include: {
              dev: {
                select: {
                  id: true,
                  name: true,
                  handle: true,
                  image: true,
                },
              },
            },
          },
        },
        orderBy: { appliedAt: "desc" },
      })
    } else if (user.role === "dev") {
      // Dev sees applications for their gigs
      const where: any = {
        gig: { devId: user.id },
      }
      if (statusFilter) where.status = statusFilter
      if (gigIdFilter) where.gigId = gigIdFilter

      applications = await prisma.application.findMany({
        where,
        include: {
          gig: {
            include: {
              dev: {
                select: {
                  id: true,
                  name: true,
                  handle: true,
                  image: true,
                },
              },
            },
          },
          streamer: {
            select: {
              id: true,
              name: true,
              handle: true,
              image: true,
              bio: true,
              followers: true,
              avgViewers: true,
              totalGigsCompleted: true,
              vibeScore: true,
              rating: true,
            },
          },
        },
        orderBy: { appliedAt: "desc" },
      })
    } else {
      return NextResponse.json({ error: "Invalid user role" }, { status: 400 })
    }

    return NextResponse.json({ applications })
  } catch (error) {
    console.error("GET /api/applications error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user || user.role !== "streamer") {
      return NextResponse.json({ error: "Only streamers can apply to gigs" }, { status: 403 })
    }

    const body = await request.json()
    const parsed = createAppSchema.parse(body)

    // Check if gig exists
    const gig = await prisma.gig.findUnique({
      where: { id: parsed.gigId },
    })

    if (!gig) {
      return NextResponse.json({ error: "Gig not found" }, { status: 404 })
    }

    if (gig.status !== "open") {
      return NextResponse.json({ error: "This gig is no longer accepting applications" }, { status: 400 })
    }

    // Check for duplicate application
    const existing = await prisma.application.findUnique({
      where: {
        gigId_streamerId: {
          gigId: parsed.gigId,
          streamerId: user.id,
        },
      },
    })

    if (existing) {
      return NextResponse.json({ error: "You have already applied to this gig" }, { status: 409 })
    }

    // Create application and increment applicant count in a transaction
    const [application] = await prisma.$transaction([
      prisma.application.create({
        data: {
          gigId: parsed.gigId,
          streamerId: user.id,
          message: parsed.message,
          status: "pending",
        },
        include: {
          gig: {
            include: {
              dev: {
                select: {
                  id: true,
                  name: true,
                  handle: true,
                  image: true,
                },
              },
            },
          },
        },
      }),
      prisma.gig.update({
        where: { id: parsed.gigId },
        data: { applicants: { increment: 1 } },
      }),
    ])

    return NextResponse.json({ application }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 })
    }
    console.error("POST /api/applications error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}