export interface FoodSuggestion {
  id: number;
  description: string;
  brand: string | null;
  calories: number | null;
}

export interface FoodSearchResult {
  data: FoodSuggestion[];
}
