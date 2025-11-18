import Link from "next/link"

import { getCurrentUser } from "@/lib/get-current-user"
import { UserNav } from "@/components/navigation/user-nav"

export async function Navbar() {
  const user = await getCurrentUser()

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold text-gray-900">
          Calorie Smart
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Dashboard
          </Link>
          {user ? (
            <UserNav user={user} />
          ) : (
            <Link
              href="/signin"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
