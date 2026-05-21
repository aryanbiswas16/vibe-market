import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth-helpers"
import { NextResponse } from "next/server"
import { z } from "zod"

const createGigSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  game: z.string().min(1, "Game is required"),
  gameType: z.string().min(1, "Game type is required"),
  platform: z.string().min(1, "Platform is required"),
  budget: z.number().int().positive("Budget must be positive"),
  payoutType: z.string().min(1, "Payout type is required"),
  minFollowers: z.number().int().optional().nullable(),
  minAvgViewers: z.number().int().optional().nullable(),
  duration: z.string().min(1, "Duration is required"),
  scheduledDate: z.string().min(1, "Scheduled date is required"),
  tags: z.array(z.string()).optional().default([]),
})

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const search = url.searchParams.get("search") || ""
    const gameType = url.searchParams.get("gameType") || ""
    const platform = url.searchParams.get("platform") || ""
    const budgetMin = url.searchParams.get("budgetMin")
    const budgetMax = url.searchParams.get("budgetMax")
    const sortBy = url.searchParams.get("sortBy") || "newest"
    const status = url.searchParams.get("status") || "open"
    const tag = url.searchParams.get("tag") || ""
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10))
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "20", 10)))
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { game: { contains: search } },
        { dev: { name: { contains: search } } },
      ]
    }

    if (gameType) {
      where.gameType = gameType
    }

    if (platform) {
      where.platform = platform
    }

    if (budgetMin) {
      where.budget = { ...where.budget, gte: parseInt(budgetMin, 10) }
    }
    if (budgetMax) {
      where.budget = { ...where.budget, lte: parseInt(budgetMax, 10) }
    }

    if (tag) {
      where.tags = { contains: tag }
    }

    // Build orderBy
    let orderBy: any
    switch (sortBy) {
      case "budget_high":
        orderBy = { budget: "desc" }
        break
      case "budget_low":
        orderBy = { budget: "asc" }
        break
      case "applicants":
        orderBy = { applicants: "desc" }
        break
      case "newest":
      default:
        orderBy = { createdAt: "desc" }
        break
    }

    const [gigs, total] = await Promise.all([
      prisma.gig.findMany({
        where,
        orderBy,
        skip,
        take: limit,
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
      }),
      prisma.gig.count({ where }),
    ])

    // Parse tags for each gig
    const parsedGigs = gigs.map((gig) => ({
      ...gig,
      tags: JSON.parse(gig.tags),
    }))

    return NextResponse.json({
      gigs: parsedGigs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("GET /api/gigs error:", error)
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

    if (!user || user.role !== "dev") {
      return NextResponse.json({ error: "Only developers can create gigs" }, { status: 403 })
    }

    const body = await request.json()
    const parsed = createGigSchema.parse(body)

    const gig = await prisma.gig.create({
      data: {
        devId: user.id,
        title: parsed.title,
        description: parsed.description,
        game: parsed.game,
        gameType: parsed.gameType,
        platform: parsed.platform,
        budget: parsed.budget,
        payoutType: parsed.payoutType,
        minFollowers: parsed.minFollowers ?? null,
        minAvgViewers: parsed.minAvgViewers ?? null,
        duration: parsed.duration,
        scheduledDate: new Date(parsed.scheduledDate),
        tags: JSON.stringify(parsed.tags),
        status: "open",
        applicants: 0,
      },
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
    })

    return NextResponse.json(
      { ...gig, tags: JSON.parse(gig.tags) },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 })
    }
    console.error("POST /api/gigs error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}