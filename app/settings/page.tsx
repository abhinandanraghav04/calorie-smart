'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ActivityLevel, Goal, Sex, calculateCalorieTarget } from '@/lib/calorie-calculator'

interface ProfileFormState {
  age: number
  heightCm: number
  weightKg: number
  sex: Sex
  activityLevel: ActivityLevel
  goal: Goal
  calorieTarget: number
  calorieTargetOverridden: boolean
}

const emptyProfile = {
  age: 0,
  heightCm: 0,
  weightKg: 0,
  sex: 'MALE' as Sex,
  activityLevel: 'SEDENTARY' as ActivityLevel,
  goal: 'MAINTAIN' as Goal,
  calorieTarget: 0,
  calorieTargetOverridden: false,
}

export default function SettingsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileFormState>(emptyProfile)
  const [manualCalorie, setManualCalorie] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile')
        const data = await response.json()

        if (data.profile) {
          setProfile(data.profile)
          setManualCalorie(data.profile.calorieTargetOverridden ? String(data.profile.calorieTarget) : '')
        } else {
          router.push('/onboarding')
        }
      } catch (error) {
        console.error('Failed to load profile:', error)
        setError('Unable to load profile right now. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleChange = (field: keyof ProfileFormState) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = event.target.type === 'number' ? Number(event.target.value) : event.target.value
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
    setSuccess(null)
  }

  const handleManualCalorieChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (value === '' || /^\d+$/.test(value)) {
      setManualCalorie(value)
      setProfile((prev) => ({
        ...prev,
        calorieTargetOverridden: value !== '',
        calorieTarget: value ? Number(value) : prev.calorieTarget,
      }))
    }
  }

  const computedTarget = !profile.calorieTargetOverridden
    ? calculateCalorieTarget(profile)
    : null

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const payload: any = {
        age: Number(profile.age),
        heightCm: Number(profile.heightCm),
        weightKg: Number(profile.weightKg),
        sex: profile.sex,
        activityLevel: profile.activityLevel,
        goal: profile.goal,
      }

      if (manualCalorie) {
        payload.calorieTarget = Number(manualCalorie)
        payload.calorieTargetOverridden = true
      } else {
        payload.calorieTargetOverridden = false
      }

      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to save profile changes')
      }

      const { profile: updatedProfile } = await response.json()
      setProfile(updatedProfile)
      setManualCalorie(updatedProfile.calorieTargetOverridden ? String(updatedProfile.calorieTarget) : '')
      setSuccess('Your profile has been updated successfully.')
    } catch (error) {
      console.error('Error saving settings', error)
      setError('Could not save your changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading settings…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-1">Adjust your personal details and calorie target.</p>
          </div>
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to dashboard
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-8 space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Personal information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={handleChange('age')}
                  min={18}
                  max={110}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                <input
                  type="number"
                  value={profile.heightCm}
                  onChange={handleChange('heightCm')}
                  min={120}
                  max={230}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                <input
                  type="number"
                  value={profile.weightKg}
                  onChange={handleChange('weightKg')}
                  min={35}
                  max={250}
                  step={0.1}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sex</label>
                <select
                  value={profile.sex}
                  onChange={handleChange('sex')}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">Activity & goal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Activity level</label>
                <select
                  value={profile.activityLevel}
                  onChange={handleChange('activityLevel')}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="SEDENTARY">Sedentary (little or no exercise)</option>
                  <option value="LIGHTLY_ACTIVE">Lightly active (1-3 days/week)</option>
                  <option value="MODERATELY_ACTIVE">Moderately active (3-5 days/week)</option>
                  <option value="VERY_ACTIVE">Very active (6-7 days/week)</option>
                  <option value="EXTRA_ACTIVE">Extra active (physical job or 2x training)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Goal</label>
                <select
                  value={profile.goal}
                  onChange={handleChange('goal')}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="LOSE">Lose weight</option>
                  <option value="MAINTAIN">Maintain weight</option>
                  <option value="GAIN">Gain muscle</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">Calorie target</h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-sm text-blue-800">Recommended daily calories</p>
                <div className="text-3xl font-bold text-blue-700 mt-2">
                  {profile.calorieTargetOverridden && manualCalorie
                    ? `${Number(manualCalorie).toLocaleString()} kcal`
                    : `${(computedTarget ?? profile.calorieTarget).toLocaleString()} kcal`}
                </div>
                {!profile.calorieTargetOverridden && (
                  <p className="text-xs text-blue-700 mt-2">
                    Automatically updated when you change your profile or goals.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Manual override (optional)</label>
                <input
                  type="text"
                  value={manualCalorie}
                  onChange={handleManualCalorieChange}
                  placeholder="Leave blank to use recommended target"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Enter a custom daily calorie target if you need a clinician-approved plan.
                </p>
              </div>
            </div>
          </div>

          {error && <div className="rounded-lg bg-red-50 text-red-600 px-4 py-3 text-sm">{error}</div>}
          {success && <div className="rounded-lg bg-green-50 text-green-700 px-4 py-3 text-sm">{success}</div>}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
