import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { useLanguage } from '../../contexts/LanguageContext';

interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes: string | null;
  business: { name: string; slug: string };
  service: { name: string; price: string };
}

const STATUS_STYLES = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  confirmed: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export function ClientBookingsTab() {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings').then((res) => {
      setBookings(res.data);
      setLoading(false);
    });
  }, []);

  const statusLabels = {
    pending: t.bookings.pending,
    confirmed: t.bookings.confirmed,
    cancelled: t.bookings.cancelled,
  };

  if (loading) return <div className="text-ink-400 font-mono text-sm animate-pulse">{t.loading}</div>;

  if (bookings.length === 0) {
    return (
      <div className="card text-center py-16">
        <p className="font-display text-2xl text-ink-300 mb-2">{t.clientBookings.empty}</p>
        <p className="text-ink-500 text-sm mb-6">{t.clientBookings.emptyHint}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => {
        const date = new Date(booking.date + 'T12:00:00');
        const isPast = date < new Date();
        return (
          <div key={booking.id} className={`card flex items-start gap-4 ${isPast ? 'opacity-60' : ''}`}>
            <div className="shrink-0 text-center bg-ink-700 rounded-lg px-3 py-2 min-w-[52px]">
              <p className="font-mono text-xs text-ink-400">
                {date.toLocaleString('default', { month: 'short' })}
              </p>
              <p className="font-display text-2xl text-ink-100 leading-tight">{date.getDate()}</p>
              <p className="font-mono text-xs text-ink-400">{date.getFullYear()}</p>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-medium text-ink-100">{booking.service.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-mono ${STATUS_STYLES[booking.status]}`}>
                  {statusLabels[booking.status]}
                </span>
              </div>
              <p className="text-ink-400 text-sm">{booking.business.name} · {booking.startTime}–{booking.endTime}</p>
              {booking.notes && (
                <p className="text-ink-500 text-xs mt-1 italic">"{booking.notes}"</p>
              )}
            </div>

            <div className="shrink-0 text-right">
              <p className="font-display text-lg text-amber-500">
                €{parseFloat(booking.service.price).toFixed(2)}
              </p>
              <Link
                to={`/book/${booking.business.slug}`}
                className="text-xs text-ink-400 hover:text-amber-500 transition-colors mt-1 block"
              >
                {t.clientBookings.bookAgain}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
