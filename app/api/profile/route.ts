import { NextResponse } from "next/server"
import { z } from "zod"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { calculateCalorieTarget } from "@/lib/calorie-calculator"

const baseSchema = z.object({
  age: z.number().int().min(13),
  heightCm: z.number().int().positive(),
  weightKg: z.number().positive(),
  sex: z.enum(["MALE", "FEMALE"]),
  activityLevel: z.enum([
    "SEDENTARY",
    "LIGHTLY_ACTIVE",
    "MODERATELY_ACTIVE",
    "VERY_ACTIVE",
    "EXTRA_ACTIVE",
  ]),
  goal: z.enum(["LOSE", "MAINTAIN", "GAIN"]),
  calorieTargetOverridden: z.boolean().optional(),
  calorieTarget: z.number().int().positive().optional(),
})

type BaseProfileInput = z.infer<typeof baseSchema>

type SessionUser = {
  id: string
  email: string
}

async function requireSessionUser(): Promise<SessionUser> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    throw new Response(null, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
    },
  })

  if (!user) {
    throw new Response(null, { status: 401 })
  }

  return user
}

export async function GET() {
  try {
    const user = await requireSessionUser()

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    })

    return NextResponse.json({ profile })
  } catch (error) {
    if (error instanceof Response) {
      return error
    }

    console.error("Error fetching profile", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser()
    const json = await request.json()
    const parsed = baseSchema.parse(json)

    const shouldOverride = parsed.calorieTargetOverridden ?? false
    const computedCalorieTarget = shouldOverride
      ? parsed.calorieTarget
      : calculateCalorieTarget({
          age: parsed.age,
          heightCm: parsed.heightCm,
          weightKg: parsed.weightKg,
          sex: parsed.sex,
          activityLevel: parsed.activityLevel,
          goal: parsed.goal,
        })

    if (computedCalorieTarget == null) {
      return NextResponse.json({ error: "Unable to calculate calorie target" }, { status: 400 })
    }

    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        age: parsed.age,
        heightCm: parsed.heightCm,
        weightKg: parsed.weightKg,
        sex: parsed.sex,
        activityLevel: parsed.activityLevel,
        goal: parsed.goal,
        calorieTarget: computedCalorieTarget,
        calorieTargetOverridden: shouldOverride,
      },
      update: {
        age: parsed.age,
        heightCm: parsed.heightCm,
        weightKg: parsed.weightKg,
        sex: parsed.sex,
        activityLevel: parsed.activityLevel,
        goal: parsed.goal,
        calorieTarget: computedCalorieTarget,
        calorieTargetOverridden: shouldOverride,
      },
    })

    return NextResponse.json({ profile })
  } catch (error) {
    if (error instanceof Response) {
      return error
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 })
    }

    console.error("Error saving profile", error)
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 })
  }
}

const updateSchema = baseSchema.partial()

export async function PATCH(request: Request) {
  try {
    const user = await requireSessionUser()
    const json = await request.json()
    const parsed = updateSchema.parse(json) as BaseProfileInput

    const existingProfile = await prisma.profile.findUnique({
      where: { userId: user.id },
    })

    if (!existingProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const shouldOverride = parsed.calorieTargetOverridden ?? existingProfile.calorieTargetOverridden

    const merged = {
      age: parsed.age ?? existingProfile.age,
      heightCm: parsed.heightCm ?? existingProfile.heightCm,
      weightKg: parsed.weightKg ?? existingProfile.weightKg,
      sex: parsed.sex ?? existingProfile.sex,
      activityLevel: parsed.activityLevel ?? existingProfile.activityLevel,
      goal: parsed.goal ?? existingProfile.goal,
    }

    const nextCalorieTarget = shouldOverride
      ? parsed.calorieTarget ?? existingProfile.calorieTarget
      : calculateCalorieTarget(merged)

    const profile = await prisma.profile.update({
      where: { userId: user.id },
      data: {
        ...parsed,
        calorieTarget: nextCalorieTarget,
        calorieTargetOverridden: shouldOverride,
      },
    })

    return NextResponse.json({ profile })
  } catch (error) {
    if (error instanceof Response) {
      return error
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 })
    }

    console.error("Error updating profile", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
