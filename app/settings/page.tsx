import { redirect } from "next/navigation"

import { Navbar } from "@/components/navigation/navbar"
import { getCurrentUser } from "@/lib/get-current-user"
import { ProfileForm } from "@/components/profile/profile-form"
import { prisma } from "@/lib/prisma"

export default async function SettingsPage() {
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
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

        <div className="mt-8 space-y-8">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
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

          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile & Calorie Target</h2>
            <ProfileForm
              mode="update"
              initialData={{
                age: profile.age,
                heightCm: profile.heightCm,
                weightKg: profile.weightKg,
                sex: profile.sex,
                activityLevel: profile.activityLevel,
                goal: profile.goal,
              }}
              calorieTarget={profile.calorieTarget}
              calorieTargetOverridden={profile.calorieTargetOverridden}
              successRedirect={null}
            />
          </div>
        </div>
      </main>
    </>
  )
}
