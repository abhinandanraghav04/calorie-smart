import { CalorieEntry } from '../data/entries'

export type DailyTotal = {
  date: string
  dayName: string
  formattedDate: string
  calories: number
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function aggregateLast7Days(
  entries: CalorieEntry[],
  userId: string,
  referenceDate: Date = new Date(),
): DailyTotal[] {
  const now = new Date(referenceDate)
  const userEntries = entries.filter((e) => e.userId === userId)

  const totalsMap: Record<string, number> = {}

  userEntries.forEach((entry) => {
    const entryDate = new Date(entry.consumedAt)
    const dateKey = `${entryDate.getUTCFullYear()}-${String(entryDate.getUTCMonth() + 1).padStart(2, '0')}-${String(entryDate.getUTCDate()).padStart(2, '0')}`

    if (!totalsMap[dateKey]) {
      totalsMap[dateKey] = 0
    }
    totalsMap[dateKey] += entry.calories
  })

  const dailyTotals: DailyTotal[] = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i))
    const dateKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`

    const dayName = dayNames[date.getUTCDay()]
    const month = monthNames[date.getUTCMonth()]
    const day = date.getUTCDate()
    const formattedDate = `${month} ${day}`

    dailyTotals.push({
      date: dateKey,
      dayName,
      formattedDate,
      calories: totalsMap[dateKey] || 0,
    })
  }

  return dailyTotals
}
