import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  handle: z.string().min(1, "Handle is required").regex(/^[a-zA-Z0-9_]+$/, "Handle can only contain letters, numbers, and underscores"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  role: z.enum(["streamer", "dev"]),
  bio: z.string().optional().default(""),
  twitchConnected: z.boolean().optional().default(false),
  youtubeConnected: z.boolean().optional().default(false),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = registerSchema.parse(body)
    
    // Check existing email or handle
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { handle: data.handle }] }
    })
    if (existing) {
      return NextResponse.json(
        { error: existing.email === data.email ? "Email already in use" : "Handle already taken" },
        { status: 409 }
      )
    }
    
    const hashedPassword = await bcrypt.hash(data.password, 12)
    const user = await prisma.user.create({
      data: {
        name: data.name,
        handle: data.handle,
        email: data.email,
        hashedPassword,
        role: data.role,
        bio: data.bio,
        image: `https://api.dicebear.com/9.x/avataaars/svg?seed=${data.handle}`,
        twitchConnected: data.twitchConnected ?? false,
        youtubeConnected: data.youtubeConnected ?? false,
        vibeScore: 50,
      }
    })
    
    return NextResponse.json({ 
      id: user.id, 
      name: user.name, 
      email: user.email,
      role: user.role,
      handle: user.handle,
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues?.[0]?.message || "Validation failed" },
        { status: 400 }
      )
    }
    console.error("Register error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
