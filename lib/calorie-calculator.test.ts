import { describe, it, expect } from 'vitest';
import { calculateBMR, calculateTDEE, calculateCalorieTarget, ProfileData } from './calorie-calculator';

describe('Calorie Calculator', () => {
  describe('calculateBMR', () => {
    it('should calculate BMR for a 30-year-old male, 180cm, 80kg', () => {
      const profile: ProfileData = {
        age: 30,
        heightCm: 180,
        weightKg: 80,
        sex: 'MALE',
        activityLevel: 'MODERATELY_ACTIVE',
        goal: 'MAINTAIN',
      };
      
      const bmr = calculateBMR(profile);
      expect(bmr).toBeCloseTo(1780, 0);
    });

    it('should calculate BMR for a 25-year-old female, 165cm, 60kg', () => {
      const profile: ProfileData = {
        age: 25,
        heightCm: 165,
        weightKg: 60,
        sex: 'FEMALE',
        activityLevel: 'LIGHTLY_ACTIVE',
        goal: 'LOSE',
      };
      
      const bmr = calculateBMR(profile);
      expect(bmr).toBeCloseTo(1345.25, 0);
    });

    it('should calculate different BMR values for male vs female with same stats', () => {
      const maleProfile: ProfileData = {
        age: 35,
        heightCm: 175,
        weightKg: 75,
        sex: 'MALE',
        activityLevel: 'SEDENTARY',
        goal: 'MAINTAIN',
      };

      const femaleProfile: ProfileData = {
        ...maleProfile,
        sex: 'FEMALE',
      };

      const maleBMR = calculateBMR(maleProfile);
      const femaleBMR = calculateBMR(femaleProfile);
      
      expect(maleBMR).toBeGreaterThan(femaleBMR);
      expect(maleBMR - femaleBMR).toBe(166);
    });
  });

  describe('calculateTDEE', () => {
    it('should calculate TDEE for sedentary activity level', () => {
      const profile: ProfileData = {
        age: 30,
        heightCm: 180,
        weightKg: 80,
        sex: 'MALE',
        activityLevel: 'SEDENTARY',
        goal: 'MAINTAIN',
      };
      
      const tdee = calculateTDEE(profile);
      const bmr = calculateBMR(profile);
      expect(tdee).toBeCloseTo(bmr * 1.2, 0);
    });

    it('should calculate TDEE for very active level', () => {
      const profile: ProfileData = {
        age: 25,
        heightCm: 165,
        weightKg: 60,
        sex: 'FEMALE',
        activityLevel: 'VERY_ACTIVE',
        goal: 'MAINTAIN',
      };
      
      const tdee = calculateTDEE(profile);
      const bmr = calculateBMR(profile);
      expect(tdee).toBeCloseTo(bmr * 1.725, 0);
    });
  });

  describe('calculateCalorieTarget', () => {
    it('should subtract 500 calories for weight loss goal', () => {
      const profile: ProfileData = {
        age: 30,
        heightCm: 175,
        weightKg: 85,
        sex: 'MALE',
        activityLevel: 'MODERATELY_ACTIVE',
        goal: 'LOSE',
      };
      
      const target = calculateCalorieTarget(profile);
      const tdee = calculateTDEE(profile);
      expect(target).toBe(Math.round(tdee - 500));
    });

    it('should maintain TDEE for maintenance goal', () => {
      const profile: ProfileData = {
        age: 28,
        heightCm: 170,
        weightKg: 70,
        sex: 'MALE',
        activityLevel: 'LIGHTLY_ACTIVE',
        goal: 'MAINTAIN',
      };
      
      const target = calculateCalorieTarget(profile);
      const tdee = calculateTDEE(profile);
      expect(target).toBe(Math.round(tdee));
    });

    it('should add 500 calories for weight gain goal', () => {
      const profile: ProfileData = {
        age: 22,
        heightCm: 168,
        weightKg: 55,
        sex: 'FEMALE',
        activityLevel: 'MODERATELY_ACTIVE',
        goal: 'GAIN',
      };
      
      const target = calculateCalorieTarget(profile);
      const tdee = calculateTDEE(profile);
      expect(target).toBe(Math.round(tdee + 500));
    });

    it('should enforce minimum of 1200 calories', () => {
      const profile: ProfileData = {
        age: 65,
        heightCm: 150,
        weightKg: 45,
        sex: 'FEMALE',
        activityLevel: 'SEDENTARY',
        goal: 'LOSE',
      };
      
      const target = calculateCalorieTarget(profile);
      expect(target).toBeGreaterThanOrEqual(1200);
    });

    it('should calculate realistic targets for typical profiles', () => {
      const profile1: ProfileData = {
        age: 35,
        heightCm: 180,
        weightKg: 85,
        sex: 'MALE',
        activityLevel: 'LIGHTLY_ACTIVE',
        goal: 'LOSE',
      };
      
      const target1 = calculateCalorieTarget(profile1);
      expect(target1).toBeGreaterThanOrEqual(1800);
      expect(target1).toBeLessThanOrEqual(2500);

      const profile2: ProfileData = {
        age: 28,
        heightCm: 165,
        weightKg: 65,
        sex: 'FEMALE',
        activityLevel: 'MODERATELY_ACTIVE',
        goal: 'MAINTAIN',
      };
      
      const target2 = calculateCalorieTarget(profile2);
      expect(target2).toBeGreaterThanOrEqual(1600);
      expect(target2).toBeLessThanOrEqual(2200);
    });
  });
});
