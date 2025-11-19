import { getTodayEntries } from './actions/food-entries';
import { getCurrentUser } from '@/lib/auth';
import { DashboardClient } from '@/components/dashboard/dashboard-client';
import type { FoodEntryDTO } from '@/types/food';

export default async function Home() {
  const user = await getCurrentUser();
  const result = await getTodayEntries();

  const entries: FoodEntryDTO[] = result.success && result.data
    ? result.data.map((entry) => ({
        id: entry.id,
        name: entry.name,
        calories: entry.calories,
        mealType: entry.mealType,
        occurredAt: entry.occurredAt.toISOString(),
        createdAt: entry.createdAt.toISOString(),
      }))
    : [];

  return <DashboardClient initialEntries={entries} targetCalories={user.targetCalories} />;
}
