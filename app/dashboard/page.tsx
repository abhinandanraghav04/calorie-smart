import Link from 'next/link'

export default function DashboardPage() {
  return (
    <main>
      <header className="header">
        <div className="container">
          <h1>Dashboard</h1>
          <nav className="nav-links">
            <Link href="/dashboard" className="active">
              Dashboard
            </Link>
            <Link href="/history">History</Link>
          </nav>
        </div>
      </header>
      <div className="container">
        <section className="card">
          <h2>Today&apos;s Snapshot</h2>
          <p>Your recent activity will appear here.</p>
          <div style={{ marginTop: '1.5rem' }}>
            <Link href="/history" className="nav-link">
              View 7-day history →
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
