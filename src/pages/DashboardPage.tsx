import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuthStore';
import { ServicesTab } from '../components/dashboard/ServicesTab';
import { AvailabilityTab } from '../components/dashboard/AvailabilityTab';
import { BookingsTab } from '../components/dashboard/BookingsTab';
import { ClientBookingsTab } from '../components/dashboard/ClientBookingsTab';
import { BillingTab } from '../components/dashboard/BillingTab';

type OwnerTab = 'bookings' | 'services' | 'availability' | 'billing';

export function DashboardPage() {
  const { user, business, logout, fetchMe, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<OwnerTab>('bookings');

  useEffect(() => {
    if (!user) fetchMe();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-ink-400 font-mono text-sm">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-ink-700 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-display text-xl text-amber-500 italic">Schedully</span>
            {business && (
              <>
                <span className="text-ink-600">|</span>
                <span className="text-ink-300 text-sm">{business.name}</span>
                <span className="font-mono text-xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full border border-amber-500/20">
                  {business.plan}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            {business && (
              <a
                href={`/book/${business.slug}`}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost text-xs"
              >
                ↗ View booking page
              </a>
            )}
            <span className="text-sm text-ink-400 hidden sm:block">{user.name}</span>
            <button onClick={handleLogout} className="btn-ghost text-xs">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {user.role === 'owner' ? (
          <>
            {/* Owner tabs */}
            <div className="flex gap-1 mb-8 bg-ink-800 border border-ink-700 rounded-xl p-1 w-fit">
              {(['bookings', 'services', 'availability', 'billing'] as OwnerTab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    tab === t
                      ? 'bg-ink-600 text-ink-100 shadow-sm'
                      : 'text-ink-400 hover:text-ink-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {tab === 'bookings' && <BookingsTab />}
            {tab === 'services' && <ServicesTab />}
            {tab === 'availability' && <AvailabilityTab />}
            {tab === 'billing' && <BillingTab />}
          </>
        ) : (
          <>
            {/* Client view */}
            <div className="mb-8">
              <h1 className="font-display text-4xl text-ink-100 mb-2">
                Hi, <em className="text-amber-500">{user.name.split(' ')[0]}</em>
              </h1>
              <p className="text-ink-400 text-sm">Your upcoming and past bookings.</p>
            </div>
            <ClientBookingsTab />
          </>
        )}
      </main>
    </div>
  );
}
