"use server"

import { revalidatePath } from "next/cache"
import { MealType } from "@prisma/client"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/get-current-user"

const createSchema = z.object({
  name: z.string().min(1, "Name is required"),
  calories: z.number().int().positive("Calories must be positive"),
  mealType: z.nativeEnum(MealType),
  occurredAt: z.string().datetime(),
})

const updateSchema = createSchema.extend({
  id: z.string().cuid(),
})

type CreateInput = z.infer<typeof createSchema>
type UpdateInput = z.infer<typeof updateSchema>

function getDayRange(date: Date) {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(end.getDate() + 1)
  return { start, end }
}

async function requireUser() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  return user
}

export async function createFoodEntry(data: CreateInput) {
  try {
    const user = await requireUser()
    const parsed = createSchema.parse(data)

    const entry = await prisma.foodEntry.create({
      data: {
        userId: user.id,
        name: parsed.name,
        calories: parsed.calories,
        mealType: parsed.mealType,
        occurredAt: new Date(parsed.occurredAt),
      },
    })

    revalidatePath("/dashboard")
    revalidatePath("/history")
    return { success: true, data: entry }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message ?? "Invalid input" }
    }

    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" }
    }

    return { success: false, error: "Failed to create food entry" }
  }
}

export async function updateFoodEntry(data: UpdateInput) {
  try {
    const user = await requireUser()
    const parsed = updateSchema.parse(data)

    const exists = await prisma.foodEntry.findFirst({
      where: {
        id: parsed.id,
        userId: user.id,
      },
    })

    if (!exists) {
      return { success: false, error: "Food entry not found" }
    }

    const entry = await prisma.foodEntry.update({
      where: { id: parsed.id },
      data: {
        name: parsed.name,
        calories: parsed.calories,
        mealType: parsed.mealType,
        occurredAt: new Date(parsed.occurredAt),
      },
    })

    revalidatePath("/dashboard")
    revalidatePath("/history")
    return { success: true, data: entry }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message ?? "Invalid input" }
    }

    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" }
    }

    return { success: false, error: "Failed to update food entry" }
  }
}

export async function deleteFoodEntry(id: string) {
  try {
    const user = await requireUser()

    const exists = await prisma.foodEntry.findFirst({
      where: {
        id,
        userId: user.id,
      },
    })

    if (!exists) {
      return { success: false, error: "Food entry not found" }
    }

    await prisma.foodEntry.delete({
      where: { id },
    })

    revalidatePath("/dashboard")
    revalidatePath("/history")
    return { success: true }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" }
    }

    return { success: false, error: "Failed to delete food entry" }
  }
}

export async function getEntriesForDate(date: Date) {
  try {
    const user = await requireUser()
    const { start, end } = getDayRange(date)

    const entries = await prisma.foodEntry.findMany({
      where: {
        userId: user.id,
        occurredAt: {
          gte: start,
          lt: end,
        },
      },
      orderBy: { occurredAt: "asc" },
    })

    return { success: true, data: entries }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" }
    }

    return { success: false, error: "Failed to fetch entries" }
  }
}

export async function getEntriesForRange(days: number) {
  try {
    const user = await requireUser()
    const end = new Date()
    end.setHours(23, 59, 59, 999)
    const start = new Date(end)
    start.setDate(start.getDate() - days + 1)
    start.setHours(0, 0, 0, 0)

    const entries = await prisma.foodEntry.findMany({
      where: {
        userId: user.id,
        occurredAt: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { occurredAt: "asc" },
    })

    return { success: true, data: entries }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" }
    }

    return { success: false, error: "Failed to fetch entries" }
  }
}
