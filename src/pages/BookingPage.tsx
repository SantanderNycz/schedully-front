import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../hooks/useAuthStore';
import { useLanguage, languageNames, Language } from '../contexts/LanguageContext';

interface Service {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: string;
}

interface Business {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

type Step = 'service' | 'date' | 'slot' | 'confirm' | 'done';

function getDatesForNextDays(n: number): string[] {
  const dates: string[] = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' });
}

function TranslateIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
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

export function BookingPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const { t, language, setLanguage } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [step, setStep] = useState<Step>('service');

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const dates = getDatesForNextDays(30);

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

  // Load business + services
  useEffect(() => {
    if (!slug) return;
    api.get(`/services/public/${slug}`).then((res) => {
      setBusiness(res.data.business);
      setServices(res.data.services);
    });
  }, [slug]);

  // Load slots when date + service selected
  useEffect(() => {
    if (!selectedService || !selectedDate) return;
    setSlotsLoading(true);
    setSlots([]);
    setSelectedSlot('');
    api
      .get('/bookings/slots', {
        params: { slug, serviceId: selectedService.id, date: selectedDate },
      })
      .then((res) => {
        setSlots(res.data.slots);
        setSlotsLoading(false);
      });
  }, [selectedService, selectedDate]);

  const handleServiceSelect = (s: Service) => {
    setSelectedService(s);
    setStep('date');
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setStep('slot');
  };

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
    setStep('confirm');
  };

  const handleConfirm = async () => {
    if (!token) {
      navigate(`/login?redirect=/book/${slug}`);
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await api.post('/bookings', {
        slug,
        serviceId: selectedService!.id,
        date: selectedDate,
        startTime: selectedSlot,
        notes: notes || undefined,
      });
      setStep('done');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-ink-400 font-mono text-sm">{t.loading}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-8 text-center relative">
          {/* Language selector — top right */}
          <div className="absolute right-0 top-0" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangOpen((o) => !o)}
              className="btn-ghost text-xs flex items-center gap-1 px-2 py-1"
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

          <span className="font-display text-sm text-amber-500 italic">{t.booking.poweredBy}</span>
          <h1 className="font-display text-4xl text-ink-100 mt-2 mb-1">{business.name}</h1>
          {business.description && (
            <p className="text-ink-400 text-sm">{business.description}</p>
          )}
        </div>

        {/* Step indicator */}
        {step !== 'done' && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {(['service', 'date', 'slot', 'confirm'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono transition-colors ${
                    step === s
                      ? 'bg-amber-500 text-ink-900 font-bold'
                      : ['service', 'date', 'slot', 'confirm'].indexOf(step) > i
                      ? 'bg-ink-600 text-ink-300'
                      : 'bg-ink-800 text-ink-500 border border-ink-600'
                  }`}
                >
                  {i + 1}
                </div>
                {i < 3 && <div className="w-6 h-px bg-ink-700" />}
              </div>
            ))}
          </div>
        )}

        {/* ── STEP 1: Choose service ── */}
        {step === 'service' && (
          <div className="animate-fade-up space-y-3">
            <h2 className="font-display text-2xl text-ink-100 mb-4">{t.booking.chooseService}</h2>
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => handleServiceSelect(s)}
                className="card w-full text-left hover:border-amber-500/50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-ink-100 group-hover:text-amber-400 transition-colors">
                      {s.name}
                    </h3>
                    {s.description && (
                      <p className="text-ink-400 text-sm mt-0.5">{s.description}</p>
                    )}
                    <p className="text-ink-500 text-xs mt-1 font-mono">
                      {s.durationMinutes} {t.booking.min}
                    </p>
                  </div>
                  <span className="font-display text-xl text-amber-500 ml-4">
                    €{parseFloat(s.price).toFixed(2)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ── STEP 2: Choose date ── */}
        {step === 'date' && selectedService && (
          <div className="animate-fade-up">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setStep('service')}
                className="text-ink-400 hover:text-ink-100 transition-colors"
              >
                {t.booking.back}
              </button>
              <h2 className="font-display text-2xl text-ink-100">{t.booking.chooseDate}</h2>
            </div>

            <div className="card mb-4 flex items-center justify-between">
              <span className="text-ink-300 text-sm">{selectedService.name}</span>
              <span className="font-mono text-xs text-ink-500">
                {selectedService.durationMinutes} {t.booking.min}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {dates.map((date, idx) => {
                const d = new Date(date + 'T12:00:00');
                const dayName = d.toLocaleString('default', { weekday: 'short' });
                const dayNum = d.getDate();
                const month = d.toLocaleString('default', { month: 'short' });
                return (
                  <button
                    key={date}
                    onClick={() => handleDateSelect(date)}
                    className={`card py-3 text-center hover:border-amber-500/50 transition-colors ${
                      selectedDate === date ? 'border-amber-500 bg-amber-500/5' : ''
                    }`}
                  >
                    <p className="font-mono text-xs text-ink-500">
                      {idx === 0 ? t.booking.today : dayName}
                    </p>
                    <p className="font-display text-xl text-ink-100">{dayNum}</p>
                    <p className="font-mono text-xs text-ink-500">{month}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STEP 3: Choose time slot ── */}
        {step === 'slot' && selectedService && selectedDate && (
          <div className="animate-fade-up">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setStep('date')}
                className="text-ink-400 hover:text-ink-100 transition-colors"
              >
                {t.booking.back}
              </button>
              <h2 className="font-display text-2xl text-ink-100">{t.booking.chooseTime}</h2>
            </div>

            <div className="card mb-4">
              <p className="text-ink-300 text-sm">
                {selectedService.name} · {formatDate(selectedDate)}
              </p>
            </div>

            {slotsLoading ? (
              <div className="text-center py-8 text-ink-400 font-mono text-sm animate-pulse">
                {t.booking.checkingAvailability}
              </div>
            ) : slots.length === 0 ? (
              <div className="card text-center py-8">
                <p className="font-display text-xl text-ink-400 mb-2">{t.booking.noAvailability}</p>
                <p className="text-ink-500 text-sm">{t.booking.tryAnotherDate}</p>
                <button onClick={() => setStep('date')} className="btn-ghost mt-4 text-sm">
                  {t.booking.chooseAnotherDate}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => handleSlotSelect(slot)}
                    className="card py-3 text-center hover:border-amber-500/50 transition-colors font-mono text-sm text-ink-200 hover:text-amber-400"
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── STEP 4: Confirm ── */}
        {step === 'confirm' && selectedService && selectedDate && selectedSlot && (
          <div className="animate-fade-up">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setStep('slot')}
                className="text-ink-400 hover:text-ink-100 transition-colors"
              >
                {t.booking.back}
              </button>
              <h2 className="font-display text-2xl text-ink-100">{t.booking.confirmBooking}</h2>
            </div>

            {/* Summary */}
            <div className="card mb-4 space-y-3">
              <Row label={t.booking.service} value={selectedService.name} />
              <Row label={t.booking.date} value={formatDate(selectedDate)} />
              <Row label={t.booking.time} value={selectedSlot} />
              <Row
                label={t.booking.duration}
                value={`${selectedService.durationMinutes} ${t.booking.min}`}
              />
              <div className="border-t border-ink-700 pt-3">
                <Row
                  label={t.booking.total}
                  value={`€${parseFloat(selectedService.price).toFixed(2)}`}
                  highlight
                />
              </div>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="label">{t.booking.notes}</label>
              <textarea
                className="input-field resize-none h-20"
                placeholder={t.booking.notesPlaceholder}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {!user && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3 mb-4 text-sm text-amber-400">
                {t.booking.signInNotice}
              </div>
            )}

            {error && (
              <div className="bg-red-950/50 border border-red-800 rounded-lg px-4 py-3 mb-4 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="btn-primary w-full"
            >
              {submitting
                ? t.booking.bookingInProgress
                : user
                ? t.booking.confirmBtn
                : t.booking.signInConfirmBtn}
            </button>
          </div>
        )}

        {/* ── DONE ── */}
        {step === 'done' && (
          <div className="animate-fade-up text-center py-8">
            <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">✓</span>
            </div>
            <h2 className="font-display text-3xl text-ink-100 mb-2">{t.booking.allBooked}</h2>
            <p className="text-ink-400 text-sm mb-2">
              {selectedService?.name} · {formatDate(selectedDate)} at {selectedSlot}
            </p>
            <p className="text-ink-500 text-xs mb-8">{t.booking.bookedSoon}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setStep('service');
                  setSelectedService(null);
                  setSelectedDate('');
                  setSelectedSlot('');
                  setNotes('');
                }}
                className="btn-ghost"
              >
                {t.booking.bookAgain}
              </button>
              <button onClick={() => navigate('/dashboard')} className="btn-primary">
                {t.booking.viewMyBookings}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-400 text-sm">{label}</span>
      <span
        className={`text-sm font-medium ${
          highlight ? 'text-amber-500 font-display text-lg' : 'text-ink-100'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
