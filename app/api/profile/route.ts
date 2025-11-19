import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ActivityLevel, Goal, Sex, calculateCalorieTarget } from '@/lib/calorie-calculator'
import { getOrCreateDemoUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getOrCreateDemoUser()
    
    if (!user.profile) {
      return NextResponse.json({ profile: null })
    }

    return NextResponse.json({ profile: user.profile })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getOrCreateDemoUser()
    const data = await request.json()

    const { age, heightCm, weightKg, sex, activityLevel, goal, calorieTarget, calorieTargetOverridden } = data

    const numberFields = [age, heightCm, weightKg]
    if (numberFields.some((value) => typeof value !== 'number' || Number.isNaN(value))) {
      return NextResponse.json({ error: 'Invalid profile data' }, { status: 400 })
    }

    const allowedSexes: Sex[] = ['MALE', 'FEMALE']
    const allowedActivity: ActivityLevel[] = ['SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE', 'EXTRA_ACTIVE']
    const allowedGoals: Goal[] = ['LOSE', 'MAINTAIN', 'GAIN']

    if (!allowedSexes.includes(sex) || !allowedActivity.includes(activityLevel) || !allowedGoals.includes(goal)) {
      return NextResponse.json({ error: 'Invalid selection for sex, activity level, or goal' }, { status: 400 })
    }

    let computedCalorieTarget = calorieTarget

    if (calorieTargetOverridden) {
      if (typeof calorieTarget !== 'number' || calorieTarget <= 0) {
        return NextResponse.json({ error: 'Manual calorie target must be a positive number' }, { status: 400 })
      }
    } else {
      computedCalorieTarget = calculateCalorieTarget({
        age,
        heightCm,
        weightKg,
        sex,
        activityLevel,
        goal,
      })
    }

    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        age,
        heightCm,
        weightKg,
        sex,
        activityLevel,
        goal,
        calorieTarget: computedCalorieTarget,
        calorieTargetOverridden: calorieTargetOverridden || false,
      },
      update: {
        age,
        heightCm,
        weightKg,
        sex,
        activityLevel,
        goal,
        calorieTarget: computedCalorieTarget,
        calorieTargetOverridden: calorieTargetOverridden || false,
      },
    })

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error saving profile:', error)
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getOrCreateDemoUser()
    const data = await request.json()

    const existingProfile = await prisma.profile.findUnique({
      where: { userId: user.id },
    })

    if (!existingProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    interface UpdateData {
      age?: number
      heightCm?: number
      weightKg?: number
      sex?: Sex
      activityLevel?: ActivityLevel
      goal?: Goal
      calorieTarget?: number
      calorieTargetOverridden?: boolean
    }

    const updateData: UpdateData = {}
    
    if (data.age !== undefined) updateData.age = data.age
    if (data.heightCm !== undefined) updateData.heightCm = data.heightCm
    if (data.weightKg !== undefined) updateData.weightKg = data.weightKg
    if (data.sex !== undefined) updateData.sex = data.sex
    if (data.activityLevel !== undefined) updateData.activityLevel = data.activityLevel
    if (data.goal !== undefined) updateData.goal = data.goal

    if (data.calorieTarget !== undefined && data.calorieTargetOverridden) {
      updateData.calorieTarget = data.calorieTarget
      updateData.calorieTargetOverridden = true
    } else if (Object.keys(updateData).length > 0 && !existingProfile.calorieTargetOverridden) {
      const mergedData = { ...existingProfile, ...updateData }
      updateData.calorieTarget = calculateCalorieTarget({
        age: mergedData.age,
        heightCm: mergedData.heightCm,
        weightKg: mergedData.weightKg,
        sex: mergedData.sex as Sex,
        activityLevel: mergedData.activityLevel as ActivityLevel,
        goal: mergedData.goal as Goal,
      })
    }

    const profile = await prisma.profile.update({
      where: { userId: user.id },
      data: updateData,
    })

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
