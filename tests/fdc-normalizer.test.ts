import { describe, it, expect } from 'vitest';
import { normalizeCalories, normalizeFoodItem } from '@/lib/fdc/client';
import type { FdcFoodItem } from '@/lib/fdc/types';

describe('normalizeCalories', () => {
  it('should return null if foodNutrients is undefined or empty', () => {
    const food1: FdcFoodItem = {
      fdcId: 123,
      description: 'Test Food',
    };

    const food2: FdcFoodItem = {
      fdcId: 124,
      description: 'Test Food 2',
      foodNutrients: [],
    };

    expect(normalizeCalories(food1)).toBeNull();
    expect(normalizeCalories(food2)).toBeNull();
  });

  it('should prioritize labelNutrients calories over foodNutrients', () => {
    const food: FdcFoodItem = {
      fdcId: 123,
      description: 'Branded Food',
      labelNutrients: {
        calories: {
          value: 99,
        },
      },
      foodNutrients: [
        {
          nutrientId: 1008,
          nutrientName: 'Energy',
          value: 200,
        },
      ],
    };

    expect(normalizeCalories(food)).toBe(99);
  });

  it('should extract calories from foodNutrients with nutrientId 1008', () => {
    const food: FdcFoodItem = {
      fdcId: 123,
      description: 'Test Food',
      foodNutrients: [
        {
          nutrientId: 1008,
          nutrientName: 'Energy',
          value: 250.5,
        },
      ],
    };

    expect(normalizeCalories(food)).toBe(251);
  });

  it('should extract calories from foodNutrients with nutrientNumber "208"', () => {
    const food: FdcFoodItem = {
      fdcId: 123,
      description: 'Test Food',
      foodNutrients: [
        {
          nutrientId: 9999,
          nutrientName: 'Something',
          nutrientNumber: '208',
          value: 300,
        },
      ],
    };

    expect(normalizeCalories(food)).toBe(300);
  });

  it('should extract calories from foodNutrients with name containing "energy"', () => {
    const food: FdcFoodItem = {
      fdcId: 123,
      description: 'Test Food',
      foodNutrients: [
        {
          nutrientId: 9999,
          nutrientName: 'Total Energy',
          value: 150.2,
        },
      ],
    };

    expect(normalizeCalories(food)).toBe(150);
  });

  it('should round calories to nearest integer', () => {
    const food: FdcFoodItem = {
      fdcId: 123,
      description: 'Test Food',
      foodNutrients: [
        {
          nutrientId: 1008,
          nutrientName: 'Energy',
          value: 123.7,
        },
      ],
    };

    expect(normalizeCalories(food)).toBe(124);
  });

  it('should return null if no energy nutrient is found', () => {
    const food: FdcFoodItem = {
      fdcId: 123,
      description: 'Test Food',
      foodNutrients: [
        {
          nutrientId: 1003,
          nutrientName: 'Protein',
          value: 10,
        },
      ],
    };

    expect(normalizeCalories(food)).toBeNull();
  });
});

describe('normalizeFoodItem', () => {
  it('should normalize a food item with all fields', () => {
    const food: FdcFoodItem = {
      fdcId: 456,
      description: 'Chicken Breast',
      brandOwner: 'Great Brand',
      foodNutrients: [
        {
          nutrientId: 1008,
          nutrientName: 'Energy',
          value: 165,
        },
      ],
    };

    const result = normalizeFoodItem(food);
    expect(result).toEqual({
      id: 456,
      description: 'Chicken Breast',
      brand: 'Great Brand',
      calories: 165,
    });
  });

  it('should use brandName if brandOwner is not available', () => {
    const food: FdcFoodItem = {
      fdcId: 789,
      description: 'Banana',
      brandName: 'Organic Farms',
      foodNutrients: [
        {
          nutrientId: 1008,
          nutrientName: 'Energy',
          value: 89,
        },
      ],
    };

    const result = normalizeFoodItem(food);
    expect(result).toEqual({
      id: 789,
      description: 'Banana',
      brand: 'Organic Farms',
      calories: 89,
    });
  });

  it('should handle missing brand', () => {
    const food: FdcFoodItem = {
      fdcId: 111,
      description: 'Apple',
      foodNutrients: [
        {
          nutrientId: 1008,
          nutrientName: 'Energy',
          value: 52,
        },
      ],
    };

    const result = normalizeFoodItem(food);
    expect(result).toEqual({
      id: 111,
      description: 'Apple',
      brand: null,
      calories: 52,
    });
  });

  it('should handle missing calories', () => {
    const food: FdcFoodItem = {
      fdcId: 222,
      description: 'Unknown Food',
      brandOwner: 'Some Brand',
      foodNutrients: [],
    };

    const result = normalizeFoodItem(food);
    expect(result).toEqual({
      id: 222,
      description: 'Unknown Food',
      brand: 'Some Brand',
      calories: null,
    });
  });
});
