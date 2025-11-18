import Link from "next/link"

import { SignUpForm } from "@/components/auth/sign-up-form"
import { Navbar } from "@/components/navigation/navbar"

export default function SignUpPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
        <div className="rounded-lg bg-white p-8 shadow">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create your account</h1>
          <SignUpForm />
          <p className="mt-6 text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/signin" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}
