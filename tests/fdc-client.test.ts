import { beforeEach, afterEach, afterAll, describe, expect, it, vi } from 'vitest';
import {
  searchFoods,
  clearFoodSearchCache,
  FdcApiError,
  FdcRateLimitError,
} from '@/lib/fdc/client';
import type { FdcFoodItem } from '@/lib/fdc/types';

const originalEnv = { ...process.env };
const originalFetch = globalThis.fetch;

describe('searchFoods', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    clearFoodSearchCache();
    process.env = { ...originalEnv, FDC_API_KEY: 'test-key' };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    process.env = originalEnv;
    if (originalFetch) {
      globalThis.fetch = originalFetch;
    }
  });

  it('fetches and normalizes results from the USDA API', async () => {
    const foods: FdcFoodItem[] = [
      {
        fdcId: 1,
        description: 'Roasted Chicken Breast',
        brandOwner: 'Generic',
        labelNutrients: {
          calories: { value: 165 },
        },
      },
    ];

    const mockResponse = {
      foods,
    };

    const json = vi.fn().mockResolvedValue(mockResponse);
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json,
    });

    vi.stubGlobal('fetch', mockFetch as unknown as typeof fetch);

    const results = await searchFoods('chicken');

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, options] = mockFetch.mock.calls[0];
    expect(String(url)).toContain('api.nal.usda.gov/fdc/v1/foods/search');
    expect(options).toMatchObject({ method: 'POST' });
    expect(results).toEqual([
      {
        id: 1,
        description: 'Roasted Chicken Breast',
        brand: 'Generic',
        calories: 165,
      },
    ]);
  });

  it('uses cached results for repeated queries within the TTL', async () => {
    const foods: FdcFoodItem[] = [
      {
        fdcId: 2,
        description: 'Banana',
        brandName: 'Fresh Farms',
        foodNutrients: [
          {
            nutrientId: 1008,
            nutrientName: 'Energy',
            value: 89,
          },
        ],
      },
    ];

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ foods }),
    });

    vi.stubGlobal('fetch', mockFetch as unknown as typeof fetch);

    const first = await searchFoods('banana');
    const second = await searchFoods('banana');

    expect(mockFetch).toHaveBeenCalledOnce();
    expect(first).toEqual(second);
    expect(first[0]).toMatchObject({ description: 'Banana', brand: 'Fresh Farms', calories: 89 });
  });

  it('throws a rate limit error when the API returns 429', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      json: vi.fn(),
    });

    vi.stubGlobal('fetch', mockFetch as unknown as typeof fetch);

    await expect(searchFoods('oats')).rejects.toBeInstanceOf(FdcRateLimitError);
  });

  it('throws an error when the API key is missing', async () => {
    process.env.FDC_API_KEY = '';

    await expect(searchFoods('apple')).rejects.toBeInstanceOf(FdcApiError);
  });
});
