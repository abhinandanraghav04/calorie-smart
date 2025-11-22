import { redirect } from "next/navigation"

import { Navbar } from "@/components/navigation/navbar"
import { getCurrentUser } from "@/lib/get-current-user"
import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  })

  if (!profile) {
    redirect("/onboarding")
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const entries = await prisma.foodEntry.findMany({
    where: {
      userId: user.id,
      occurredAt: {
        gte: today,
        lt: tomorrow,
      },
    },
    orderBy: { occurredAt: "asc" },
  })

  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0)
  const remaining = profile.calorieTarget - totalCalories

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-4 text-gray-600">Welcome back, {user.email}!</p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-sm font-medium text-gray-500">Daily Target</h2>
            <p className="mt-2 text-3xl font-bold text-gray-900">{profile.calorieTarget}</p>
            <p className="mt-1 text-sm text-gray-500">calories/day</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-sm font-medium text-gray-500">Consumed</h2>
            <p className="mt-2 text-3xl font-bold text-blue-600">{totalCalories}</p>
            <p className="mt-1 text-sm text-gray-500">calories today</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-sm font-medium text-gray-500">Remaining</h2>
            <p className={`mt-2 text-3xl font-bold ${remaining >= 0 ? "text-green-600" : "text-red-600"}`}>
              {remaining}
            </p>
            <p className="mt-1 text-sm text-gray-500">calories left</p>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-white p-6 shadow">
         <div className="flex items-center justify-between">
           <h2 className="text-xl font-bold text-gray-900">Today&apos;s Food Log</h2>
           <a
             href="/dashboard/food/add"
             className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
           >
             Add Food
           </a>
         </div>

          {entries.length === 0 ? (
            <p className="mt-4 text-center text-gray-500">
              No food entries yet. Start tracking your meals!
            </p>
          ) : (
            <div className="mt-4 space-y-2">
              {entries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between border-b border-gray-200 py-3">
                  <div>
                    <p className="font-medium text-gray-900">{entry.name}</p>
                    <p className="text-sm text-gray-500">{entry.mealType.toLowerCase().replace("_", " ")}</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{entry.calories} cal</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            <a href="/history" className="text-blue-600 hover:underline">View 7-day history</a>
            {" | "}
            <a href="/settings" className="text-blue-600 hover:underline">Update profile & settings</a>
          </p>
        </div>
      </main>
    </>
  )
}
