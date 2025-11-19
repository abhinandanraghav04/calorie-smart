'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import OnboardingFlow from '@/components/onboarding/OnboardingFlow'

export default function OnboardingPage() {
  const router = useRouter()

  useEffect(() => {
    const checkProfile = async () => {
      const response = await fetch('/api/profile')
      const data = await response.json()
      if (data.profile) {
        router.replace('/')
      }
    }

    checkProfile()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Welcome to CalorieSmart 🎯</h1>
          <p className="text-gray-600 mt-2">Let's set up your personalized nutrition plan</p>
        </div>
        <OnboardingFlow />
      </div>
    </div>
  )
}
