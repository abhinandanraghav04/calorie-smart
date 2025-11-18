import { redirect } from "next/navigation"

import { Navbar } from "@/components/navigation/navbar"
import { getCurrentUser } from "@/lib/get-current-user"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-4 text-gray-600">Welcome back, {user.email}!</p>
        <div className="mt-8 rounded-lg bg-white p-6 shadow">
          <p className="text-gray-700">
            This is your protected dashboard. Future metrics and insights will appear here.
          </p>
        </div>
      </main>
    </>
  )
}
