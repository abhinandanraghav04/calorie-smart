import Link from "next/link"

import { Navbar } from "@/components/navigation/navbar"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Welcome to Calorie Smart MVP
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Track your calories and achieve your health goals with science-based calorie calculations
          </p>

          <div className="mb-16 grid grid-cols-1 gap-8 sm:grid-cols-3 text-left">
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🎯 Profile & Targets</h3>
              <p className="text-sm text-gray-600">
                Set up your profile with age, height, weight, and goals. Get personalized calorie targets using the Mifflin-St Jeor formula.
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">📝 Food Logging</h3>
              <p className="text-sm text-gray-600">
                Easily log meals and snacks throughout the day. Track your progress against your daily calorie goal.
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 History & Insights</h3>
              <p className="text-sm text-gray-600">
                View your 7-day calorie history with visual charts to understand your eating patterns over time.
              </p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="rounded-md bg-blue-600 px-8 py-4 text-base font-medium text-white hover:bg-blue-700 shadow"
            >
              Get Started
            </Link>
            <Link
              href="/signin"
              className="rounded-md border border-gray-300 bg-white px-8 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 shadow"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
