import { Link } from 'react-router-dom';

// Scaffold for Task 1 (routing). Full sections — features, dashboard preview,
// footer, i18n — are built in Tasks 2 and 6.
export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-ink-700 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-display text-xl text-amber-500 italic">Schedully</span>
          <nav className="flex items-center gap-2">
            <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
            <Link to="/register/owner" className="btn-primary text-sm">Create account</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-20">
        <div className="max-w-2xl">
          <h1 className="font-display text-5xl text-ink-100 leading-[1.1] mb-6">
            Multi-tenant scheduling,<br />
            <em className="text-amber-500">from public link to checkout.</em>
          </h1>
          <p className="text-ink-400 text-base leading-relaxed mb-8 max-w-xl">
            Every business gets its own booking page, calendar, and access control.
            Clients book in seconds; owners confirm, cancel, and charge — no spreadsheets,
            no back-and-forth.
          </p>
          <div className="flex gap-3">
            <Link to="/register/owner" className="btn-primary">Create a business account →</Link>
            <Link to="/login" className="btn-ghost">Sign in</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
