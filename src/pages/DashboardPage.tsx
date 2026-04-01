import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuthStore';
import { ServicesTab } from '../components/dashboard/ServicesTab';
import { AvailabilityTab } from '../components/dashboard/AvailabilityTab';
import { BookingsTab } from '../components/dashboard/BookingsTab';
import { ClientBookingsTab } from '../components/dashboard/ClientBookingsTab';
import { BillingTab } from '../components/dashboard/BillingTab';
import { useLanguage, languageNames, Language } from '../contexts/LanguageContext';

type OwnerTab = 'bookings' | 'services' | 'availability' | 'billing';

function TranslateIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 8 6 6" />
      <path d="m4 14 6-6 2-3" />
      <path d="M2 5h12" />
      <path d="M7 2h1" />
      <path d="m22 22-5-10-5 10" />
      <path d="M14 18h6" />
    </svg>
  );
}

export function DashboardPage() {
  const { user, business, logout, fetchMe, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const [tab, setTab] = useState<OwnerTab>('bookings');
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) fetchMe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-ink-400 font-mono text-sm">{t.loading}</div>
      </div>
    );
  }

  const ownerTabs: OwnerTab[] = ['bookings', 'services', 'availability', 'billing'];

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

          <div className="flex items-center gap-3">
            {/* Language selector */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangOpen((o) => !o)}
                className="btn-ghost text-xs flex items-center gap-1.5 px-2"
                title="Language / Idioma"
              >
                <TranslateIcon />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-ink-800 border border-ink-700 rounded-xl shadow-xl py-1 z-50 min-w-[140px] animate-fade-in">
                  {(Object.entries(languageNames) as [Language, string][]).map(([code, name]) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => { setLanguage(code); setLangOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        language === code
                          ? 'text-amber-500 bg-amber-500/5'
                          : 'text-ink-300 hover:text-ink-100 hover:bg-ink-700'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {business && (
              <a
                href={`/book/${business.slug}`}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost text-xs"
              >
                {t.viewBookingPage}
              </a>
            )}
            <span className="text-sm text-ink-400 hidden sm:block">{user.name}</span>
            <button onClick={handleLogout} className="btn-ghost text-xs">
              {t.signOut}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {user.role === 'owner' ? (
          <>
            {/* Owner tabs */}
            <div className="flex gap-1 mb-8 bg-ink-800 border border-ink-700 rounded-xl p-1 w-fit">
              {ownerTabs.map((tabKey) => (
                <button
                  key={tabKey}
                  onClick={() => setTab(tabKey)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    tab === tabKey
                      ? 'bg-ink-600 text-ink-100 shadow-sm'
                      : 'text-ink-400 hover:text-ink-200'
                  }`}
                >
                  {t.tabs[tabKey]}
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
                {t.client.hi} <em className="text-amber-500">{user.name.split(' ')[0]}</em>
              </h1>
              <p className="text-ink-400 text-sm">{t.client.upcomingBookings}</p>
            </div>
            <ClientBookingsTab />
          </>
        )}
      </main>
    </div>
  );
}
