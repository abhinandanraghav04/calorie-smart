'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Profile {
  id: string
  age: number
  heightCm: number
  weightKg: number
  sex: string
  activityLevel: string
  goal: string
  calorieTarget: number
}

export default function HomePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile')
        const data = await response.json()

        if (data.profile) {
          setProfile(data.profile)
        } else {
          router.push('/onboarding')
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">CalorieSmart 🎯</h1>
            <Link
              href="/settings"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Settings
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg p-8 text-white mb-8">
          <h2 className="text-xl font-semibold mb-2">Today's Target</h2>
          <div className="flex items-baseline">
            <div className="text-5xl font-bold">{profile.calorieTarget.toLocaleString()}</div>
            <div className="text-2xl ml-2">kcal</div>
          </div>
          <p className="mt-4 text-blue-100">
            Stay on track with your {profile.goal.toLowerCase()} goal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Profile</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex justify-between">
                <span>Age:</span>
                <strong>{profile.age} years</strong>
              </li>
              <li className="flex justify-between">
                <span>Height:</span>
                <strong>{profile.heightCm} cm</strong>
              </li>
              <li className="flex justify-between">
                <span>Weight:</span>
                <strong>{profile.weightKg} kg</strong>
              </li>
              <li className="flex justify-between">
                <span>Sex:</span>
                <strong>{profile.sex === 'MALE' ? 'Male' : 'Female'}</strong>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity & Goal</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex justify-between">
                <span>Activity level:</span>
                <strong className="text-right max-w-[50%]">
                  {profile.activityLevel.replace(/_/g, ' ').toLowerCase()}
                </strong>
              </li>
              <li className="flex justify-between">
                <span>Goal:</span>
                <strong>{profile.goal.replace(/_/g, ' ').toLowerCase()}</strong>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/settings"
                className="block w-full text-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Update Profile
              </Link>
              <button
                className="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                disabled
              >
                Log Food (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
