import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

interface Service {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: string;
  active: boolean;
}

interface ServiceFormData {
  name: string;
  description: string;
  durationMinutes: number;
  price: string;
}

const empty: ServiceFormData = { name: '', description: '', durationMinutes: 60, price: '0' };

export function ServicesTab() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<ServiceFormData>(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchServices = async () => {
    const res = await api.get('/services');
    setServices(res.data.filter((s: Service) => s.active));
    setLoading(false);
  };

  useEffect(() => { fetchServices(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/services/${editing}`, form);
      } else {
        await api.post('/services', form);
      }
      await fetchServices();
      setForm(empty);
      setEditing(null);
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (s: Service) => {
    setForm({ name: s.name, description: s.description || '', durationMinutes: s.durationMinutes, price: s.price });
    setEditing(s.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this service?')) return;
    await api.delete(`/services/${id}`);
    await fetchServices();
  };

  const handleCancel = () => {
    setForm(empty);
    setEditing(null);
    setShowForm(false);
  };

  if (loading) return <div className="text-ink-400 font-mono text-sm animate-pulse">Loading services…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-ink-100">Services</h2>
          <p className="text-ink-400 text-sm mt-1">Define what you offer and how long each takes.</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary">
            + Add service
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="card border-amber-500/30 animate-fade-up">
          <h3 className="font-display text-lg text-ink-100 mb-4">
            {editing ? 'Edit service' : 'New service'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="label">Service name</label>
                <input
                  className="input-field"
                  placeholder="Haircut & Styling"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="label">Description (optional)</label>
                <textarea
                  className="input-field resize-none h-20"
                  placeholder="A short description for your clients…"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Duration (minutes)</label>
                <select
                  className="input-field"
                  value={form.durationMinutes}
                  onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                >
                  {[15, 30, 45, 60, 90, 120, 180, 240].map((d) => (
                    <option key={d} value={d}>{d} min</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Price (€)</label>
                <input
                  className="input-field"
                  placeholder="25.00"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  pattern="^\d+(\.\d{1,2})?$"
                  required
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Saving…' : editing ? 'Save changes' : 'Create service'}
              </button>
              <button type="button" onClick={handleCancel} className="btn-ghost">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {services.length === 0 && !showForm ? (
        <div className="card text-center py-12">
          <p className="font-display text-xl text-ink-400 mb-2">No services yet</p>
          <p className="text-ink-500 text-sm">Add your first service to start accepting bookings.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <div key={service.id} className="card flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-medium text-ink-100">{service.name}</h3>
                  <span className="font-mono text-xs bg-ink-700 text-ink-400 px-2 py-0.5 rounded-full">
                    {service.durationMinutes} min
                  </span>
                </div>
                {service.description && (
                  <p className="text-ink-400 text-sm truncate">{service.description}</p>
                )}
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="font-display text-lg text-amber-500">€{parseFloat(service.price).toFixed(2)}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(service)} className="btn-ghost text-xs py-1.5 px-3">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="btn-ghost text-xs py-1.5 px-3 text-red-400 hover:text-red-300 hover:border-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
