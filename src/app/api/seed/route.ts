import { NextResponse } from "next/server"

export async function POST() {
  try {
    const { seed } = await import(/* webpackIgnore: true */ "../../../../prisma/seed")
    await seed()
    return NextResponse.json({ ok: true, message: "Database seeded" })
  } catch (error) {
    console.error("POST /api/seed error:", error)
    return NextResponse.json({ ok: false, message: "Seed failed" }, { status: 500 })
  }
}