import { redirect } from "next/navigation"

import { Navbar } from "@/components/navigation/navbar"
import { getCurrentUser } from "@/lib/get-current-user"

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <div className="mt-8 rounded-lg bg-white p-6 shadow">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Account Information</h2>
              <div className="mt-4 space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Member since</label>
                  <p className="text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            Additional settings will be available in future updates.
          </p>
        </div>
      </main>
    </>
  )
}
