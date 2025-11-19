export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

export interface FoodEntryDTO {
  id: string;
  name: string;
  calories: number;
  mealType: MealType;
  occurredAt: string;
  createdAt: string;
}
