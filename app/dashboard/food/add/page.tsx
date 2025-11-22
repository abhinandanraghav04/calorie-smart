import { redirect } from "next/navigation"

import { Navbar } from "@/components/navigation/navbar"
import { AddFoodForm } from "@/components/food/add-food-form"
import { getCurrentUser } from "@/lib/get-current-user"
import { prisma } from "@/lib/prisma"

export default async function AddFoodPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  const profile = await prisma.profile.findUnique({ where: { userId: user.id } })

  if (!profile) {
    redirect("/onboarding")
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900">Add food entry</h1>
        <p className="mt-2 text-gray-600">Log a meal or snack</p>
        <div className="mt-8 rounded-lg bg-white p-6 shadow">
          <AddFoodForm />
        </div>
      </main>
    </>
  )
}
