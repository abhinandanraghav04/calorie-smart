import { NextResponse } from "next/server"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(request: Request) {
  try {
    const json = await request.json()

    const { email, password } = registerSchema.parse(json)

    const normalizedEmail = email.toLowerCase()

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      )
    }

    const bcrypt = await import("bcryptjs")
    const passwordHash = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
      },
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid input provided.",
          issues: error.issues,
        },
        { status: 400 },
      )
    }

    console.error("Register error", error)

    return NextResponse.json(
      { error: "Unable to create account. Please try again." },
      { status: 500 },
    )
  }
}
