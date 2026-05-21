import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth-helpers"
import { NextResponse } from "next/server"
import { z } from "zod"

const connectSchema = z.object({
  platform: z.enum(["twitch", "youtube"]),
  username: z.string().optional().nullable(),
  channelId: z.string().optional().nullable(),
})

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = connectSchema.parse(body)

    const updateData: any = {}

    if (parsed.platform === "twitch") {
      updateData.twitchConnected = true
      if (parsed.username !== undefined) updateData.twitchUsername = parsed.username
    } else if (parsed.platform === "youtube") {
      updateData.youtubeConnected = true
      if (parsed.channelId !== undefined) updateData.youtubeChannelId = parsed.channelId
    }

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
    console.error("POST /api/stream/connect error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}