import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CalorieSmart - Your Personal Nutrition Tracker',
  description: 'Track your calories and reach your health goals',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
