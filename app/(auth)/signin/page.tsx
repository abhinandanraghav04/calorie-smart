import Link from "next/link"

import { SignInForm } from "@/components/auth/sign-in-form"
import { Navbar } from "@/components/navigation/navbar"

export default function SignInPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
        <div className="rounded-lg bg-white p-8 shadow">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Sign in to your account</h1>
          <SignInForm />
          <p className="mt-6 text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Create one now
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}
