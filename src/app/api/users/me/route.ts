import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth-helpers"
import { NextResponse } from "next/server"
import { z } from "zod"

const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  handle: z.string().min(1).optional(),
  bio: z.string().optional(),
  twitchConnected: z.boolean().optional(),
  youtubeConnected: z.boolean().optional(),
  twitchUsername: z.string().optional().nullable(),
  youtubeChannelId: z.string().optional().nullable(),
  avatar: z.string().optional(),
})

export async function GET() {
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

    // Return user without hashedPassword
    const { hashedPassword, ...safeUser } = user
    return NextResponse.json({ user: safeUser })
  } catch (error) {
    console.error("GET /api/users/me error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = updateProfileSchema.parse(body)

    const updateData: any = {}
    if (parsed.name !== undefined) updateData.name = parsed.name
    if (parsed.handle !== undefined) updateData.handle = parsed.handle
    if (parsed.bio !== undefined) updateData.bio = parsed.bio
    if (parsed.twitchConnected !== undefined) updateData.twitchConnected = parsed.twitchConnected
    if (parsed.youtubeConnected !== undefined) updateData.youtubeConnected = parsed.youtubeConnected
    if (parsed.twitchUsername !== undefined) updateData.twitchUsername = parsed.twitchUsername
    if (parsed.youtubeChannelId !== undefined) updateData.youtubeChannelId = parsed.youtubeChannelId
    if (parsed.avatar !== undefined) updateData.image = parsed.avatar

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    })

    const { hashedPassword, ...safeUser } = user
    return NextResponse.json({ user: safeUser })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 })
    }
    console.error("PATCH /api/users/me error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}