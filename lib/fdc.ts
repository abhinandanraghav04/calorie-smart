const FDC_ENDPOINT = "https://api.nal.usda.gov/fdc/v1/foods/search"

export interface FoodSuggestion {
  id: number
  description: string
  brand?: string | null
  calories: number | null
}

interface FdcSearchFood {
  fdcId: number
  description: string
  brandOwner?: string
  brandName?: string
  foodNutrients?: Array<{
    nutrientId?: number
    nutrientNumber?: string
    nutrientName?: string
    value?: number
  }>
  labelNutrients?: {
    calories?: {
      value: number
    }
  }
}

interface FdcSearchResponse {
  foods?: FdcSearchFood[]
}

function normalizeCalories(food: FdcSearchFood): number | null {
  const labelCalories = food.labelNutrients?.calories?.value
  if (typeof labelCalories === "number" && !Number.isNaN(labelCalories)) {
    return Math.round(labelCalories)
  }

  const nutrient = food.foodNutrients?.find((n) => {
    if (n.nutrientId === 1008) return true
    if (n.nutrientNumber?.trim() === "208") return true
    const name = n.nutrientName?.toLowerCase() ?? ""
    return name.includes("calorie") || name.includes("energy")
  })

  if (nutrient?.value != null && !Number.isNaN(nutrient.value)) {
    return Math.round(nutrient.value)
  }

  return null
}

export async function searchFoods(query: string, limit = 12): Promise<FoodSuggestion[]> {
  const trimmed = query.trim()
  if (!trimmed) {
    return []
  }

  const apiKey = process.env.FDC_API_KEY

  if (!apiKey) {
    throw new Error("FDC_API_KEY is not configured")
  }

  const url = new URL(FDC_ENDPOINT)
  url.searchParams.set("api_key", apiKey)

  const payload = {
    query: trimmed,
    pageSize: Math.max(1, Math.min(limit, 50)),
    pageNumber: 1,
    dataType: ["Survey (FNDDS)", "Foundation", "Branded"],
  }

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (response.status === 429) {
    throw new Error("Rate limit exceeded. Please try again soon")
  }

  if (!response.ok) {
    throw new Error("USDA FoodData Central search failed")
  }

  const json = (await response.json()) as FdcSearchResponse
  const foods = Array.isArray(json.foods) ? json.foods : []

  return foods.map((food) => ({
    id: food.fdcId,
    description: food.description,
    brand: food.brandOwner ?? food.brandName ?? null,
    calories: normalizeCalories(food),
  }))
}
