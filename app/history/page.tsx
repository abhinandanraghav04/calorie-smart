import { redirect } from "next/navigation"

import { Navbar } from "@/components/navigation/navbar"
import { getCurrentUser } from "@/lib/get-current-user"
import { prisma } from "@/lib/prisma"

function formatDateLabel(date: Date) {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

export default async function HistoryPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  const profile = await prisma.profile.findUnique({ where: { userId: user.id } })

  if (!profile) {
    redirect("/onboarding")
  }

  const end = new Date()
  end.setHours(23, 59, 59, 999)
  const start = new Date(end)
  start.setDate(start.getDate() - 6)
  start.setHours(0, 0, 0, 0)

  const entries = await prisma.foodEntry.findMany({
    where: {
      userId: user.id,
      occurredAt: {
        gte: start,
        lte: end,
      },
    },
    orderBy: { occurredAt: "asc" },
  })

  const totalsByDate = new Map<string, number>()

  for (const entry of entries) {
    const key = entry.occurredAt.toISOString().slice(0, 10)
    totalsByDate.set(key, (totalsByDate.get(key) ?? 0) + entry.calories)
  }

  const days: Array<{ date: string; label: string; total: number }> = []

  for (let i = 6; i >= 0; i -= 1) {
    const current = new Date(end)
    current.setHours(0, 0, 0, 0)
    current.setDate(current.getDate() - i)
    const key = current.toISOString().slice(0, 10)
    days.push({
      date: key,
      label: formatDateLabel(current),
      total: totalsByDate.get(key) ?? 0,
    })
  }

  const maxCalories = Math.max(1, ...days.map((day) => day.total))

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900">7-day history</h1>
        <p className="mt-2 text-gray-600">
          Review your calorie intake over the past week. Your daily target is {profile.calorieTarget} calories.
        </p>

        <section className="mt-10">
          <div className="grid grid-cols-7 gap-4">
            {days.map((day) => {
              const heightPercentage = Math.round((day.total / maxCalories) * 100)
              return (
                <div key={day.date} className="flex flex-col items-center gap-3">
                  <div className="flex h-40 w-8 items-end justify-center rounded-full bg-gray-100">
                    <div
                      className={`w-6 rounded-full ${day.total >= profile.calorieTarget ? "bg-red-500" : "bg-blue-500"}`}
                      style={{ height: `${Math.max(8, heightPercentage)}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">{day.total}</p>
                    <p className="text-xs text-gray-500">{day.label}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="mt-12">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Calories</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Difference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {days.map((day) => {
                  const delta = day.total - profile.calorieTarget
                  return (
                    <tr key={day.date}>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{day.label}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{day.total} cal</td>
                      <td
                        className={`whitespace-nowrap px-4 py-3 text-sm font-medium ${
                          delta === 0 ? "text-gray-500" : delta > 0 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {delta === 0 ? "On target" : `${delta > 0 ? "+" : ""}${delta} cal`}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  )
}
