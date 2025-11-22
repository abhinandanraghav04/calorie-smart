"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type ActivityLevel = "SEDENTARY" | "LIGHTLY_ACTIVE" | "MODERATELY_ACTIVE" | "VERY_ACTIVE" | "EXTRA_ACTIVE"
type Goal = "LOSE" | "MAINTAIN" | "GAIN"
type Sex = "MALE" | "FEMALE"

interface ProfileFormData {
  age: number
  heightCm: number
  weightKg: number
  sex: Sex
  activityLevel: ActivityLevel
  goal: Goal
}

interface ProfileFormProps {
  initialData?: Partial<ProfileFormData>
  calorieTarget?: number
  calorieTargetOverridden?: boolean
  mode?: "create" | "update"
  successRedirect?: string | null
}

export function ProfileForm({
  initialData,
  calorieTarget,
  calorieTargetOverridden,
  mode = "create",
  successRedirect,
}: ProfileFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<ProfileFormData>({
    age: initialData?.age ?? 30,
    heightCm: initialData?.heightCm ?? 170,
    weightKg: initialData?.weightKg ?? 70,
    sex: initialData?.sex ?? "MALE",
    activityLevel: initialData?.activityLevel ?? "MODERATELY_ACTIVE",
    goal: initialData?.goal ?? "MAINTAIN",
  })
  const [manualTarget, setManualTarget] = useState<string>(
    calorieTarget !== undefined ? String(calorieTarget) : ""
  )
  const [useManualTarget, setUseManualTarget] = useState(calorieTargetOverridden ?? false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      const payload: any = {
        ...formData,
        calorieTargetOverridden: useManualTarget,
      }

      if (useManualTarget) {
        const target = parseInt(manualTarget, 10)
        if (isNaN(target) || target <= 0) {
          setError("Please enter a valid calorie target")
          setLoading(false)
          return
        }
        payload.calorieTarget = target
      }

      const response = await fetch("/api/profile", {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Failed to save profile")
        setLoading(false)
        return
      }

      const redirect = successRedirect !== null ? successRedirect ?? "/dashboard" : null
      if (redirect) {
        router.push(redirect)
        router.refresh()
      } else {
        setSuccess(true)
        router.refresh()
        setLoading(false)
      }
    } catch (err) {
      setError("An unexpected error occurred")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <p className="text-sm text-green-800">Profile updated successfully!</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">
            Age
          </label>
          <input
            type="number"
            id="age"
            min="13"
            max="120"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value, 10) || 0 })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="sex" className="block text-sm font-medium text-gray-700">
            Sex
          </label>
          <select
            id="sex"
            value={formData.sex}
            onChange={(e) => setFormData({ ...formData, sex: e.target.value as Sex })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>

        <div>
          <label htmlFor="heightCm" className="block text-sm font-medium text-gray-700">
            Height (cm)
          </label>
          <input
            type="number"
            id="heightCm"
            min="100"
            max="250"
            value={formData.heightCm}
            onChange={(e) => setFormData({ ...formData, heightCm: parseInt(e.target.value, 10) || 0 })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="weightKg" className="block text-sm font-medium text-gray-700">
            Weight (kg)
          </label>
          <input
            type="number"
            id="weightKg"
            min="30"
            max="300"
            step="0.1"
            value={formData.weightKg}
            onChange={(e) => setFormData({ ...formData, weightKg: parseFloat(e.target.value) || 0 })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700">
            Activity Level
          </label>
          <select
            id="activityLevel"
            value={formData.activityLevel}
            onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as ActivityLevel })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="SEDENTARY">Sedentary (little or no exercise)</option>
            <option value="LIGHTLY_ACTIVE">Lightly active (1-3 days/week)</option>
            <option value="MODERATELY_ACTIVE">Moderately active (3-5 days/week)</option>
            <option value="VERY_ACTIVE">Very active (6-7 days/week)</option>
            <option value="EXTRA_ACTIVE">Extra active (physical job or training)</option>
          </select>
        </div>

        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
            Goal
          </label>
          <select
            id="goal"
            value={formData.goal}
            onChange={(e) => setFormData({ ...formData, goal: e.target.value as Goal })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="LOSE">Lose weight (-500 cal/day)</option>
            <option value="MAINTAIN">Maintain weight</option>
            <option value="GAIN">Gain muscle (+500 cal/day)</option>
          </select>
        </div>
      </div>

      <div className="rounded-md bg-gray-50 p-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={useManualTarget}
            onChange={(e) => setUseManualTarget(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Set manual calorie target (override calculation)</span>
        </label>

        {useManualTarget && (
          <div className="mt-4">
            <label htmlFor="manualTarget" className="block text-sm font-medium text-gray-700">
              Daily calorie target
            </label>
            <input
              type="number"
              id="manualTarget"
              min="1200"
              max="5000"
              value={manualTarget}
              onChange={(e) => setManualTarget(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required={useManualTarget}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  )
}
