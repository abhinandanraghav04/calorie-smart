import type { Metadata } from "next"
import "./globals.css"

import { SessionProvider } from "@/components/auth/session-provider"

export const metadata: Metadata = {
  title: "Calorie Smart MVP",
  description: "Track your calories smartly",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
