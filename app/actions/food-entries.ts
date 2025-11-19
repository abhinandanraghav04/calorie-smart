'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const createFoodEntrySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  calories: z.number().int().positive('Calories must be positive'),
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']),
  occurredAt: z.string().datetime(),
});

const updateFoodEntrySchema = createFoodEntrySchema.extend({
  id: z.string(),
});

export async function createFoodEntry(data: z.infer<typeof createFoodEntrySchema>) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const validated = createFoodEntrySchema.parse(data);

    const entry = await prisma.foodEntry.create({
      data: {
        ...validated,
        occurredAt: new Date(validated.occurredAt),
        userId: user.id,
      },
    });

    revalidatePath('/');
    return { success: true, data: entry };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Failed to create food entry' };
  }
}

export async function updateFoodEntry(data: z.infer<typeof updateFoodEntrySchema>) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const validated = updateFoodEntrySchema.parse(data);

    // Verify ownership
    const existingEntry = await prisma.foodEntry.findFirst({
      where: {
        id: validated.id,
        userId: user.id,
      },
    });

    if (!existingEntry) {
      return { success: false, error: 'Food entry not found' };
    }

    const entry = await prisma.foodEntry.update({
      where: { id: validated.id },
      data: {
        name: validated.name,
        calories: validated.calories,
        mealType: validated.mealType,
        occurredAt: new Date(validated.occurredAt),
      },
    });

    revalidatePath('/');
    return { success: true, data: entry };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Failed to update food entry' };
  }
}

export async function deleteFoodEntry(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Verify ownership
    const existingEntry = await prisma.foodEntry.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingEntry) {
      return { success: false, error: 'Food entry not found' };
    }

    await prisma.foodEntry.delete({
      where: { id },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete food entry' };
  }
}

export async function getTodayEntries() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const entries = await prisma.foodEntry.findMany({
      where: {
        userId: user.id,
        occurredAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      orderBy: {
        occurredAt: 'asc',
      },
    });

    return { success: true, data: entries };
  } catch (error) {
    return { success: false, error: 'Failed to fetch entries' };
  }
}
