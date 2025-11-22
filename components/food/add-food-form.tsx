"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

import { createFoodEntry } from "@/app/actions/food-entries"

const MEAL_TYPES = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"] as const

type MealType = (typeof MEAL_TYPES)[number]

export function AddFoodForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [calories, setCalories] = useState("")
  const [mealType, setMealType] = useState<MealType>("BREAKFAST")
  const [occurredAt, setOccurredAt] = useState(() => new Date().toISOString().slice(0, 16))
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const parsedCalories = Number.parseInt(calories, 10)
    if (!name.trim()) {
      setError("Please enter a food name")
      return
    }

    if (!Number.isFinite(parsedCalories) || parsedCalories <= 0) {
      setError("Calories must be a positive number")
      return
    }

    const occurredAtIso = new Date(occurredAt).toISOString()

    startTransition(async () => {
      const result = await createFoodEntry({
        name: name.trim(),
        calories: parsedCalories,
        mealType,
        occurredAt: occurredAtIso,
      })

      if (result.success) {
        router.push("/dashboard")
        router.refresh()
      } else {
        setError(result.error ?? "Failed to add food entry")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Food name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="e.g. Grilled chicken salad"
          required
        />
      </div>

      <div>
        <label htmlFor="calories" className="block text-sm font-medium text-gray-700">
          Calories
        </label>
        <input
          id="calories"
          type="number"
          inputMode="numeric"
          min="0"
          value={calories}
          onChange={(event) => setCalories(event.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="mealType" className="block text-sm font-medium text-gray-700">
          Meal type
        </label>
        <select
          id="mealType"
          value={mealType}
          onChange={(event) => setMealType(event.target.value as MealType)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {MEAL_TYPES.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0) + type.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="occurredAt" className="block text-sm font-medium text-gray-700">
          When did you eat this?
        </label>
        <input
          id="occurredAt"
          type="datetime-local"
          value={occurredAt}
          onChange={(event) => setOccurredAt(event.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save entry"}
        </button>
      </div>
    </form>
  )
}
