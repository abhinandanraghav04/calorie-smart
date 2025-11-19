import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <header className="header">
        <div className="container">
          <h1>Calorie Smart MVP</h1>
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
          <h2>Welcome to Calorie Smart</h2>
          <p>Track your calories and reach your goals!</p>
          <div style={{ marginTop: '1rem' }}>
            <Link
              href="/dashboard"
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                background: 'var(--accent)',
                color: 'white',
                borderRadius: '0.5rem',
                fontWeight: 500,
              }}
            >
              Go to Dashboard
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
