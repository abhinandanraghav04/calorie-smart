import Link from "next/link"

import { Navbar } from "@/components/navigation/navbar"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Calorie Smart
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Track your calories and achieve your health goals
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
            >
              Get Started
            </Link>
            <Link
              href="/dashboard"
              className="rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
