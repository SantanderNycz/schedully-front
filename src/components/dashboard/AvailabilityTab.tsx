import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useLanguage } from '../../contexts/LanguageContext';

interface DaySlot {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

const defaultSlot = (): DaySlot => ({ enabled: false, startTime: '09:00', endTime: '18:00' });

export function AvailabilityTab() {
  const { t } = useLanguage();
  const DAYS = t.availability.days;

  const [schedule, setSchedule] = useState<DaySlot[]>(Array(7).fill(null).map(defaultSlot));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get('/availability')
      .then((res) => {
        const fresh = Array(7).fill(null).map(defaultSlot);
        res.data.forEach((a: { dayOfWeek: number; startTime: string; endTime: string }) => {
          fresh[a.dayOfWeek] = {
            enabled: true,
            startTime: a.startTime.slice(0, 5),
            endTime: a.endTime.slice(0, 5),
          };
        });
        setSchedule(fresh);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
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
    setSaved(false);
    setSaveError(false);
    try {
      const slots = schedule
        .map((d, i) => ({ ...d, dayOfWeek: i }))
        .filter((d) => d.enabled)
        .map(({ dayOfWeek, startTime, endTime }) => ({ dayOfWeek, startTime, endTime }));

      await api.post('/availability', { slots });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setSaveError(true);
      setTimeout(() => setSaveError(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-ink-400 font-mono text-sm animate-pulse">{t.loading}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-ink-100">{t.availability.title}</h2>
        <p className="text-ink-400 text-sm mt-1">{t.availability.subtitle}</p>
      </div>

      <div className="space-y-3">
        {DAYS.map((day, i) => {
          const d = schedule[i];
          return (
            <div
              key={i}
              className={`card flex items-center gap-4 transition-opacity ${!d.enabled ? 'opacity-50' : ''}`}
            >
              {/* Toggle */}
              <button
                type="button"
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
              <span className="w-28 text-sm font-medium text-ink-200 shrink-0">{day}</span>

              {/* Time pickers */}
              {d.enabled ? (
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="time"
                    value={d.startTime}
                    onChange={(e) => update(i, 'startTime', e.target.value)}
                    className="input-field w-32 py-2 text-sm"
                  />
                  <span className="text-ink-500 text-sm">{t.availability.to}</span>
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
                      const diff = end[0] * 60 + end[1] - (start[0] * 60 + start[1]);
                      return diff > 0
                        ? `${Math.floor(diff / 60)}h${diff % 60 ? ` ${diff % 60}m` : ''}`
                        : '';
                    })()}
                  </span>
                </div>
              ) : (
                <span className="text-ink-500 text-sm">{t.availability.closed}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="btn-primary"
        >
          {saving
            ? t.availability.saving
            : saved
            ? t.availability.saved
            : t.availability.save}
        </button>
        {saveError && (
          <span className="text-red-400 text-sm">{t.availability.saveError}</span>
        )}
      </div>
    </div>
  );
}
