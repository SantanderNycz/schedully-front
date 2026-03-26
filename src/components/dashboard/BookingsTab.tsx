import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes: string | null;
  client: { name: string; email: string };
  service: { name: string; price: string };
}

const STATUS_STYLES = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  confirmed: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function BookingsTab() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  const fetchBookings = async () => {
    const res = await api.get('/bookings');
    setBookings(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    await api.patch(`/bookings/${id}/status`, { status });
    await fetchBookings();
  };

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  const counts = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  };

  if (loading) return <div className="text-ink-400 font-mono text-sm animate-pulse">Loading bookings…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-display text-2xl text-ink-100">Bookings</h2>
          <p className="text-ink-400 text-sm mt-1">All client appointments for your business.</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-ink-800 border border-ink-700 rounded-lg p-1">
          {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${
                filter === f
                  ? 'bg-ink-600 text-ink-100'
                  : 'text-ink-400 hover:text-ink-200'
              }`}
            >
              {f} <span className="ml-1 font-mono text-ink-500">{counts[f]}</span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <p className="font-display text-xl text-ink-400 mb-2">No bookings yet</p>
          <p className="text-ink-500 text-sm">Share your booking link to start receiving appointments.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((booking) => {
            const date = new Date(booking.date + 'T12:00:00');
            return (
              <div key={booking.id} className="card flex items-start gap-4">
                {/* Date block */}
                <div className="shrink-0 text-center bg-ink-700 rounded-lg px-3 py-2 min-w-[52px]">
                  <p className="font-mono text-xs text-ink-400">{DAY_NAMES[date.getDay()]}</p>
                  <p className="font-display text-2xl text-ink-100 leading-tight">{date.getDate()}</p>
                  <p className="font-mono text-xs text-ink-400">{date.toLocaleString('default', { month: 'short' })}</p>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-ink-100">{booking.client.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-mono ${STATUS_STYLES[booking.status]}`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-ink-400 text-sm">
                    {booking.service.name} · {booking.startTime}–{booking.endTime}
                  </p>
                  <p className="text-ink-500 text-xs mt-0.5">{booking.client.email}</p>
                  {booking.notes && (
                    <p className="text-ink-500 text-xs mt-1 italic">"{booking.notes}"</p>
                  )}
                </div>

                {/* Price + actions */}
                <div className="shrink-0 text-right">
                  <p className="font-display text-lg text-amber-500 mb-2">
                    €{parseFloat(booking.service.price).toFixed(2)}
                  </p>
                  {booking.status === 'pending' && (
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => updateStatus(booking.id, 'confirmed')}
                        className="text-xs px-3 py-1.5 rounded-md bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateStatus(booking.id, 'cancelled')}
                        className="text-xs px-3 py-1.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
