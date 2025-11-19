import type { FoodSuggestion } from '@/types/food';
import type { FdcFoodItem, FdcSearchParams, FdcSearchResponse } from './types';

const FDC_SEARCH_URL = 'https://api.nal.usda.gov/fdc/v1/foods/search';
const CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_PAGE_SIZE = 50;

type CacheEntry = {
  timestamp: number;
  data: FoodSuggestion[];
};

const cache = new Map<string, CacheEntry>();

export class FdcApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = 'FdcApiError';
  }
}

export class FdcRateLimitError extends FdcApiError {
  constructor(message = 'Rate limit exceeded, please try again soon.') {
    super(message, 429);
    this.name = 'FdcRateLimitError';
  }
}

function buildCacheKey({ query, pageNumber, pageSize }: FdcSearchParams): string {
  const normalizedQuery = query.trim().toLowerCase();
  return `${normalizedQuery}|${pageNumber}|${pageSize}`;
}

function findEnergyNutrient(food: FdcFoodItem) {
  return (food.foodNutrients ?? []).find((nutrient) => {
    const number = nutrient.nutrientNumber?.trim();
    const name = nutrient.nutrientName?.toLowerCase() ?? '';

    if (nutrient.nutrientId === 1008) return true;
    if (number === '208') return true;
    if (name.includes('energy') || name.includes('calorie')) return true;

    return false;
  });
}

export function normalizeCalories(food: FdcFoodItem): number | null {
  const labelCalories = food.labelNutrients?.calories?.value;
  if (typeof labelCalories === 'number' && !Number.isNaN(labelCalories)) {
    return Math.round(labelCalories);
  }

  const nutrient = findEnergyNutrient(food);
  if (nutrient?.value != null && !Number.isNaN(nutrient.value)) {
    return Math.round(nutrient.value);
  }

  return null;
}

export function normalizeFoodItem(food: FdcFoodItem): FoodSuggestion {
  const brand = food.brandOwner ?? food.brandName ?? null;
  return {
    id: food.fdcId,
    description: food.description,
    brand,
    calories: normalizeCalories(food),
  };
}

function clampPageSize(pageSize: number): number {
  if (!Number.isFinite(pageSize) || pageSize < 1) return 10;
  if (pageSize > MAX_PAGE_SIZE) return MAX_PAGE_SIZE;
  return pageSize;
}

function sanitizeParams(query: string, pageSize: number, pageNumber: number): FdcSearchParams {
  const trimmedQuery = query.trim();
  const size = clampPageSize(pageSize);
  const page = Number.isFinite(pageNumber) && pageNumber > 0 ? Math.floor(pageNumber) : 1;

  return {
    query: trimmedQuery,
    pageSize: size,
    pageNumber: page,
  };
}

export async function searchFoods(
  query: string,
  pageSize = 10,
  pageNumber = 1
): Promise<FoodSuggestion[]> {
  const params = sanitizeParams(query, pageSize, pageNumber);

  if (!params.query) {
    return [];
  }

  const cacheKey = buildCacheKey(params);
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const apiKey = process.env.FDC_API_KEY;
  if (!apiKey) {
    throw new FdcApiError('USDA FoodData Central API key is not configured');
  }

  const url = new URL(FDC_SEARCH_URL);
  url.searchParams.set('api_key', apiKey);

  const body = {
    query: params.query,
    pageSize: params.pageSize,
    pageNumber: params.pageNumber,
    requireAllWords: false,
    dataType: ['Survey (FNDDS)', 'Foundation', 'Branded'],
  };

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    throw new FdcApiError('Unable to reach USDA FoodData Central service');
  }

  if (response.status === 429) {
    throw new FdcRateLimitError();
  }

  if (!response.ok) {
    throw new FdcApiError('USDA FoodData search failed', response.status);
  }

  let payload: FdcSearchResponse;
  try {
    payload = await response.json();
  } catch (error) {
    throw new FdcApiError('Received an unexpected response from USDA FoodData Central');
  }

  const foods = Array.isArray(payload.foods) ? payload.foods : [];
  const normalized = foods.map(normalizeFoodItem);

  cache.set(cacheKey, {
    timestamp: Date.now(),
    data: normalized,
  });

  return normalized;
}

export function clearFoodSearchCache() {
  cache.clear();
}
