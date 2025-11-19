import { NextResponse } from 'next/server'
import { getCalorieEntries } from '../../../data/entries'
import { aggregateLast7Days } from '../../../lib/aggregation'

export async function GET() {
  const userId = 'user-1'
  const calorieEntries = getCalorieEntries()
  const history = aggregateLast7Days(calorieEntries, userId)
  return NextResponse.json(history)
}
