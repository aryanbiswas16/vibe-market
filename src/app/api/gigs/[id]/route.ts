import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const gig = await prisma.gig.findUnique({
      where: { id },
      include: {
        dev: {
          select: {
            id: true,
            name: true,
            handle: true,
            image: true,
            bio: true,
            totalGigsCompleted: true,
            vibeScore: true,
            rating: true,
          },
        },
        applications: {
          include: {
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
        },
      },
    })

    if (!gig) {
      return NextResponse.json({ error: "Gig not found" }, { status: 404 })
    }

    return NextResponse.json({
      gig: {
        ...gig,
        tags: JSON.parse(gig.tags),
      },
    })
  } catch (error) {
    console.error("GET /api/gigs/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}