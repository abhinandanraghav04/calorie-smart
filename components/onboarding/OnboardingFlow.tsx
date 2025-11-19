'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Stepper from './Stepper'
import { ActivityLevel, Goal, Sex, calculateCalorieTarget } from '@/lib/calorie-calculator'

const STEP_LABELS = ['Profile Info', 'Goals', "Review & Save"]

interface FormData {
  age: number | ''
  heightCm: number | ''
  weightKg: number | ''
  sex: Sex | ''
  activityLevel: ActivityLevel | ''
  goal: Goal | ''
}

interface ValidationErrors {
  age?: string
  heightCm?: string
  weightKg?: string
  sex?: string
  activityLevel?: string
  goal?: string
}

const DEFAULT_FORM_DATA: FormData = {
  age: '',
  heightCm: '',
  weightKg: '',
  sex: '',
  activityLevel: '',
  goal: '',
}

export default function OnboardingFlow() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    setSaveError(null)
  }, [step])

  const calorieTarget = useMemo(() => {
    if (
      formData.age === '' ||
      formData.heightCm === '' ||
      formData.weightKg === '' ||
      formData.sex === '' ||
      formData.activityLevel === '' ||
      formData.goal === ''
    ) {
      return null
    }

    return calculateCalorieTarget({
      age: Number(formData.age),
      heightCm: Number(formData.heightCm),
      weightKg: Number(formData.weightKg),
      sex: formData.sex,
      activityLevel: formData.activityLevel,
      goal: formData.goal,
    })
  }, [formData])

  const validateStep = (currentStep: number) => {
    const newErrors: ValidationErrors = {}

    if (currentStep === 1) {
      if (formData.age === '' || Number(formData.age) <= 0) {
        newErrors.age = 'Please enter a valid age.'
      }
      if (formData.heightCm === '' || Number(formData.heightCm) <= 100) {
        newErrors.heightCm = 'Height should be greater than 100 cm.'
      }
      if (formData.weightKg === '' || Number(formData.weightKg) <= 30) {
        newErrors.weightKg = 'Weight should be greater than 30 kg.'
      }
      if (formData.sex === '') {
        newErrors.sex = 'Please select your biological sex.'
      }
    } else if (currentStep === 2) {
      if (formData.activityLevel === '') {
        newErrors.activityLevel = 'Select your typical weekly activity level.'
      }
      if (formData.goal === '') {
        newErrors.goal = 'Choose a goal that fits your plan.'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, STEP_LABELS.length))
    }
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const handleChange = (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const rawValue = event.target.value
    const value = event.target.type === 'number' ? (rawValue === '' ? '' : Number(rawValue)) : rawValue
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async () => {
    if (!validateStep(2)) {
      setStep(2)
      return
    }

    if (!calorieTarget) {
      return
    }

    setIsSaving(true)
    setSaveError(null)

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          age: Number(formData.age),
          heightCm: Number(formData.heightCm),
          weightKg: Number(formData.weightKg),
          sex: formData.sex,
          activityLevel: formData.activityLevel,
          goal: formData.goal,
          calorieTargetOverridden: false,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save profile')
      }

      router.push('/')
    } catch (error) {
      console.error('Error saving profile', error)
      setSaveError('Something went wrong while saving. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 transition-all duration-300">
      <Stepper currentStep={step} totalSteps={STEP_LABELS.length} steps={STEP_LABELS} />

      {step === 1 && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tell us about yourself</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={handleChange('age')}
                className={`mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.age ? 'border-red-400' : 'border-gray-300'
                }`}
                min={18}
                max={110}
              />
              {errors.age && <p className="mt-2 text-sm text-red-500">{errors.age}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
              <input
                type="number"
                value={formData.heightCm}
                onChange={handleChange('heightCm')}
                className={`mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.heightCm ? 'border-red-400' : 'border-gray-300'
                }`}
                min={120}
                max={230}
              />
              {errors.heightCm && <p className="mt-2 text-sm text-red-500">{errors.heightCm}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
              <input
                type="number"
                value={formData.weightKg}
                onChange={handleChange('weightKg')}
                className={`mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.weightKg ? 'border-red-400' : 'border-gray-300'
                }`}
                min={35}
                max={250}
                step={0.1}
              />
              {errors.weightKg && <p className="mt-2 text-sm text-red-500">{errors.weightKg}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sex</label>
              <select
                value={formData.sex}
                onChange={handleChange('sex')}
                className={`mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.sex ? 'border-red-400' : 'border-gray-300'
                }`}
              >
                <option value="">Select...</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
              {errors.sex && <p className="mt-2 text-sm text-red-500">{errors.sex}</p>}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-slide-left">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Define your plan</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Activity level</label>
              <select
                value={formData.activityLevel}
                onChange={handleChange('activityLevel')}
                className={`mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.activityLevel ? 'border-red-400' : 'border-gray-300'
                }`}
              >
                <option value="">Select...</option>
                <option value="SEDENTARY">Sedentary (little or no exercise)</option>
                <option value="LIGHTLY_ACTIVE">Lightly active (1-3 days/week)</option>
                <option value="MODERATELY_ACTIVE">Moderately active (3-5 days/week)</option>
                <option value="VERY_ACTIVE">Very active (6-7 days/week)</option>
                <option value="EXTRA_ACTIVE">Extra active (hard labor or 2x training)</option>
              </select>
              {errors.activityLevel && <p className="mt-2 text-sm text-red-500">{errors.activityLevel}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Goal</label>
              <select
                value={formData.goal}
                onChange={handleChange('goal')}
                className={`mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.goal ? 'border-red-400' : 'border-gray-300'
                }`}
              >
                <option value="">Select...</option>
                <option value="LOSE">Lose weight</option>
                <option value="MAINTAIN">Maintain weight</option>
                <option value="GAIN">Gain muscle</option>
              </select>
              {errors.goal && <p className="mt-2 text-sm text-red-500">{errors.goal}</p>}
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-slide-up">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Review your daily target</h2>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-800">Your recommended target</h3>
            <div className="text-4xl font-bold text-blue-700 mt-4">
              {calorieTarget ? `${calorieTarget.toLocaleString()} kcal` : '—'}
            </div>
            <p className="text-sm text-blue-700 mt-2">
              Based on your inputs, this target accounts for your total daily energy expenditure and adjusts for your goal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800">Profile</h4>
              <ul className="mt-2 space-y-1">
                <li>Age: <strong>{formData.age}</strong></li>
                <li>Height: <strong>{formData.heightCm} cm</strong></li>
                <li>Weight: <strong>{formData.weightKg} kg</strong></li>
                <li>Sex: <strong>{formData.sex === 'MALE' ? 'Male' : 'Female'}</strong></li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800">Plan</h4>
              <ul className="mt-2 space-y-1">
                <li>Activity level: <strong>{formData.activityLevel.replace('_', ' ').toLowerCase()}</strong></li>
                <li>Goal: <strong>{formData.goal?.toLowerCase()}</strong></li>
              </ul>
            </div>
          </div>

          {saveError && <div className="mt-6 text-sm text-red-500">{saveError}</div>}
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button
          onClick={handleBack}
          className={`rounded-lg border px-5 py-2 font-medium transition ${
            step === 1
              ? 'opacity-0 pointer-events-none'
              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
          }`}
        >
          Back
        </button>

        {step < STEP_LABELS.length ? (
          <button
            onClick={handleNext}
            className="rounded-lg bg-blue-600 text-white px-5 py-2 font-medium shadow hover:bg-blue-700 transition"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="rounded-lg bg-green-600 text-white px-5 py-2 font-medium shadow hover:bg-green-700 transition disabled:bg-green-300 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save & Continue'}
          </button>
        )}
      </div>
    </div>
  )
}
