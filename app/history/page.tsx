'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'

type DailyTotal = {
  date: string
  dayName: string
  formattedDate: string
  calories: number
}

function LoadingSkeleton() {
  return (
    <>
      <div className="summary-card">
        <div className="skeleton" style={{ width: '160px', height: '28px', marginBottom: '0.75rem' }} />
        <div className="skeleton" style={{ width: '220px', height: '20px', marginBottom: '1.5rem' }} />
        <div className="skeleton chart" />
      </div>
      <div className="history-grid">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="history-row">
            <div>
              <div className="skeleton" style={{ width: '120px', height: '20px', marginBottom: '0.5rem' }} />
              <div className="skeleton" style={{ width: '80px', height: '16px' }} />
            </div>
            <div className="skeleton" style={{ width: '72px', height: '20px' }} />
          </div>
        ))}
      </div>
    </>
  )
}

function EmptyState() {
  return (
    <div className="empty-state">
      <h3>No History Yet</h3>
      <p>Your 7-day calorie history will appear here once you start tracking meals.</p>
    </div>
  )
}

function WeeklySummary({ data }: { data: DailyTotal[] }) {
  const total = data.reduce((sum, day) => sum + day.calories, 0)
  const average = Math.round(total / data.length)
  const high = Math.max(...data.map((day) => day.calories))

  return (
    <div className="summary-card">
      <div className="summary-header">
        <div>
          <span className="summary-subtitle">Last 7 days total</span>
          <h3 className="summary-total">{total.toLocaleString()} cal</h3>
        </div>
        <div className="summary-metrics">
          <div>
            <span className="metric-label">Average</span>
            <strong>{average.toLocaleString()} cal</strong>
          </div>
          <div>
            <span className="metric-label">Highest</span>
            <strong>{high.toLocaleString()} cal</strong>
          </div>
        </div>
      </div>
      <div className="summary-chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="history-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--sparkline-stroke)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--sparkline-stroke)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="calories"
              stroke="var(--sparkline-stroke)"
              strokeWidth={2.2}
              fill="url(#history-gradient)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function DayRow({ day }: { day: DailyTotal }) {
  return (
    <div className="history-row">
      <div>
        <div className="day">{day.dayName}</div>
        <div className="date">{day.formattedDate}</div>
      </div>
      <div className="calories">{day.calories.toLocaleString()} cal</div>
    </div>
  )
}

export default function HistoryPage() {
  const [history, setHistory] = useState<DailyTotal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch('/api/history')
        if (!res.ok) throw new Error('Failed to fetch history')
        const data: DailyTotal[] = await res.json()
        setHistory(data)
      } catch (error) {
        console.error('Error fetching history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const hasData = history.some((day) => day.calories > 0)

  return (
    <main>
      <header className="header">
        <div className="container">
          <h1>History</h1>
          <nav className="nav-links">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/history" className="active">
              History
            </Link>
          </nav>
        </div>
      </header>
      <div className="container">
        <section className="card">
          <div className="section-title">
            <h2>7-Day Calorie History</h2>
            <span>Last 7 days</span>
          </div>
          {loading ? (
            <LoadingSkeleton />
          ) : !hasData ? (
            <EmptyState />
          ) : (
            <>
              <WeeklySummary data={history} />
              <div className="history-grid">
                {history
                  .slice()
                  .reverse()
                  .map((day) => (
                    <DayRow key={day.date} day={day} />
                  ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  )
}
