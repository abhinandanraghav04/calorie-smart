export type CalorieEntry = {
  id: string
  userId: string
  calories: number
  consumedAt: string
}

type EntryConfig = {
  id: string
  userId: string
  calories: number
  daysAgo: number
  hour?: number
  minute?: number
}

function buildEntry(referenceDate: Date, config: EntryConfig): CalorieEntry {
  const { id, userId, calories, daysAgo, hour = 12, minute = 0 } = config
  const utcDate = new Date(
    Date.UTC(
      referenceDate.getUTCFullYear(),
      referenceDate.getUTCMonth(),
      referenceDate.getUTCDate() - daysAgo,
      hour,
      minute,
      0,
      0,
    ),
  )

  return {
    id,
    userId,
    calories,
    consumedAt: utcDate.toISOString(),
  }
}

export function getCalorieEntries(referenceDate: Date = new Date()): CalorieEntry[] {
  return [
    buildEntry(referenceDate, { id: 'm1', userId: 'user-1', calories: 420, daysAgo: 0, hour: 8 }),
    buildEntry(referenceDate, { id: 'm2', userId: 'user-1', calories: 620, daysAgo: 0, hour: 13 }),
    buildEntry(referenceDate, { id: 'm3', userId: 'user-1', calories: 480, daysAgo: 0, hour: 19 }),

    buildEntry(referenceDate, { id: 'm4', userId: 'user-1', calories: 380, daysAgo: 1, hour: 9 }),
    buildEntry(referenceDate, { id: 'm5', userId: 'user-1', calories: 710, daysAgo: 1, hour: 12 }),
    buildEntry(referenceDate, { id: 'm6', userId: 'user-1', calories: 320, daysAgo: 1, hour: 18 }),

    buildEntry(referenceDate, { id: 'm7', userId: 'user-1', calories: 510, daysAgo: 2, hour: 8 }),
    buildEntry(referenceDate, { id: 'm8', userId: 'user-1', calories: 640, daysAgo: 2, hour: 13 }),
    buildEntry(referenceDate, { id: 'm9', userId: 'user-1', calories: 450, daysAgo: 2, hour: 19 }),

    buildEntry(referenceDate, { id: 'm10', userId: 'user-1', calories: 420, daysAgo: 3, hour: 8 }),
    buildEntry(referenceDate, { id: 'm11', userId: 'user-1', calories: 600, daysAgo: 3, hour: 13 }),
    buildEntry(referenceDate, { id: 'm12', userId: 'user-1', calories: 410, daysAgo: 3, hour: 19 }),

    buildEntry(referenceDate, { id: 'm13', userId: 'user-1', calories: 520, daysAgo: 4, hour: 9 }),
    buildEntry(referenceDate, { id: 'm14', userId: 'user-1', calories: 670, daysAgo: 4, hour: 13 }),
    buildEntry(referenceDate, { id: 'm15', userId: 'user-1', calories: 350, daysAgo: 4, hour: 20 }),

    buildEntry(referenceDate, { id: 'm16', userId: 'user-1', calories: 460, daysAgo: 5, hour: 9 }),
    buildEntry(referenceDate, { id: 'm17', userId: 'user-1', calories: 680, daysAgo: 5, hour: 13 }),
    buildEntry(referenceDate, { id: 'm18', userId: 'user-1', calories: 390, daysAgo: 5, hour: 20 }),

    buildEntry(referenceDate, { id: 'm19', userId: 'user-1', calories: 430, daysAgo: 6, hour: 9 }),
    buildEntry(referenceDate, { id: 'm20', userId: 'user-1', calories: 620, daysAgo: 6, hour: 13 }),
    buildEntry(referenceDate, { id: 'm21', userId: 'user-1', calories: 360, daysAgo: 6, hour: 20 }),

    buildEntry(referenceDate, { id: 'm22', userId: 'user-1', calories: 450, daysAgo: 7, hour: 8 }),
    buildEntry(referenceDate, { id: 'm23', userId: 'user-1', calories: 500, daysAgo: 7, hour: 13 }),
    buildEntry(referenceDate, { id: 'm24', userId: 'user-1', calories: 370, daysAgo: 7, hour: 19 }),

    buildEntry(referenceDate, { id: 'm25', userId: 'user-2', calories: 800, daysAgo: 0, hour: 8 }),
    buildEntry(referenceDate, { id: 'm26', userId: 'user-2', calories: 900, daysAgo: 2, hour: 12 }),
  ]
}
