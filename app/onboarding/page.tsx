import { redirect } from "next/navigation"

import { ProfileForm } from "@/components/profile/profile-form"
import { getCurrentUser } from "@/lib/get-current-user"
import { prisma } from "@/lib/prisma"

export default async function OnboardingPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  })

  if (profile) {
    redirect("/dashboard")
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-4 py-16">
      <div className="rounded-xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to Calorie Smart</h1>
        <p className="mt-2 text-gray-600">
          Tell us about yourself to calculate a personalized daily calorie target.
        </p>

        <div className="mt-8">
          <ProfileForm />
        </div>
      </div>
    </main>
  )
}
