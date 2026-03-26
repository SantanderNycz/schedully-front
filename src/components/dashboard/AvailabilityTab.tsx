import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface DaySlot {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

const defaultSlot = (): DaySlot => ({ enabled: false, startTime: '09:00', endTime: '18:00' });

export function AvailabilityTab() {
  const [schedule, setSchedule] = useState<DaySlot[]>(DAYS.map(defaultSlot));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/availability').then((res) => {
      const fresh = DAYS.map(defaultSlot);
      res.data.forEach((a: { dayOfWeek: number; startTime: string; endTime: string }) => {
        fresh[a.dayOfWeek] = { enabled: true, startTime: a.startTime, endTime: a.endTime };
      });
      setSchedule(fresh);
      setLoading(false);
    });
  }, []);

  const toggle = (i: number) => {
    setSchedule((prev) =>
      prev.map((d, idx) => (idx === i ? { ...d, enabled: !d.enabled } : d))
    );
  };

  const update = (i: number, field: 'startTime' | 'endTime', value: string) => {
    setSchedule((prev) =>
      prev.map((d, idx) => (idx === i ? { ...d, [field]: value } : d))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    const slots = schedule
      .map((d, i) => ({ ...d, dayOfWeek: i }))
      .filter((d) => d.enabled)
      .map(({ dayOfWeek, startTime, endTime }) => ({ dayOfWeek, startTime, endTime }));

    await api.post('/availability', { slots });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="text-ink-400 font-mono text-sm animate-pulse">Loading schedule…</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-ink-100">Availability</h2>
        <p className="text-ink-400 text-sm mt-1">Set which days and hours your business is open for bookings.</p>
      </div>

      <div className="space-y-3">
        {DAYS.map((day, i) => {
          const d = schedule[i];
          return (
            <div
              key={day}
              className={`card flex items-center gap-4 transition-opacity ${!d.enabled ? 'opacity-50' : ''}`}
            >
              {/* Toggle */}
              <button
                onClick={() => toggle(i)}
                className={`w-10 h-6 rounded-full transition-colors shrink-0 relative ${
                  d.enabled ? 'bg-amber-500' : 'bg-ink-600'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    d.enabled ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>

              {/* Day label */}
              <span className="w-24 text-sm font-medium text-ink-200 shrink-0">{day}</span>

              {/* Time pickers */}
              {d.enabled ? (
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="time"
                    value={d.startTime}
                    onChange={(e) => update(i, 'startTime', e.target.value)}
                    className="input-field w-32 py-2 text-sm"
                  />
                  <span className="text-ink-500 text-sm">to</span>
                  <input
                    type="time"
                    value={d.endTime}
                    onChange={(e) => update(i, 'endTime', e.target.value)}
                    className="input-field w-32 py-2 text-sm"
                  />
                  <span className="text-ink-500 text-xs font-mono ml-2">
                    {(() => {
                      const start = d.startTime.split(':').map(Number);
                      const end = d.endTime.split(':').map(Number);
                      const diff = (end[0] * 60 + end[1]) - (start[0] * 60 + start[1]);
                      return diff > 0 ? `${Math.floor(diff / 60)}h${diff % 60 ? ` ${diff % 60}m` : ''}` : '';
                    })()}
                  </span>
                </div>
              ) : (
                <span className="text-ink-500 text-sm">Closed</span>
              )}
            </div>
          );
        })}
      </div>

      <button onClick={handleSave} disabled={saving} className="btn-primary">
        {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save schedule'}
      </button>
    </div>
  );
}
