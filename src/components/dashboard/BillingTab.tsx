import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuthStore } from '../../hooks/useAuthStore';

export function BillingTab() {
  const { business, fetchMe } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const billingParam = searchParams.get('billing');
  const isPro = business?.plan === 'pro';

  // After Stripe redirect, refresh user so plan badge updates
  useEffect(() => {
    if (billingParam === 'success') {
      fetchMe();
      setSearchParams({}, { replace: true });
    }
  }, [billingParam]);

  async function handleUpgrade() {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/billing/create-checkout-session');
      window.location.href = res.data.url;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to start checkout');
      setLoading(false);
    }
  }

  async function handlePortal() {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/billing/portal');
      window.location.href = res.data.url;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to open billing portal');
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h2 className="font-display text-2xl text-ink-100 mb-1">Billing</h2>
      <p className="text-ink-400 text-sm mb-8">Manage your subscription and plan.</p>

      {/* Success banner */}
      {billingParam === 'success' && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
          Subscription activated! Your plan has been upgraded to Pro.
        </div>
      )}

      {/* Cancelled banner */}
      {billingParam === 'cancelled' && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-ink-700 border border-ink-600 text-ink-300 text-sm">
          Checkout cancelled. No changes were made.
        </div>
      )}

      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Free */}
        <div className={`card p-6 ${!isPro ? 'border-amber-500/40' : ''}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-medium text-ink-200">Free</p>
              <p className="text-2xl font-bold text-ink-100 mt-1">$0<span className="text-sm font-normal text-ink-400">/mo</span></p>
            </div>
            {!isPro && (
              <span className="font-mono text-xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full border border-amber-500/20">
                current
              </span>
            )}
          </div>
          <ul className="space-y-2 text-sm text-ink-400">
            <li className="flex items-center gap-2"><span className="text-ink-500">✓</span> 1 business</li>
            <li className="flex items-center gap-2"><span className="text-ink-500">✓</span> Up to 50 bookings/mo</li>
            <li className="flex items-center gap-2"><span className="text-ink-500">✓</span> Basic availability</li>
          </ul>
        </div>

        {/* Pro */}
        <div className={`card p-6 ${isPro ? 'border-amber-500/40' : ''}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-medium text-ink-200">Pro</p>
              <p className="text-2xl font-bold text-ink-100 mt-1">$19<span className="text-sm font-normal text-ink-400">/mo</span></p>
            </div>
            {isPro && (
              <span className="font-mono text-xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full border border-amber-500/20">
                current
              </span>
            )}
          </div>
          <ul className="space-y-2 text-sm text-ink-400 mb-6">
            <li className="flex items-center gap-2"><span className="text-amber-500">✓</span> Unlimited bookings</li>
            <li className="flex items-center gap-2"><span className="text-amber-500">✓</span> Email notifications</li>
            <li className="flex items-center gap-2"><span className="text-amber-500">✓</span> Priority support</li>
          </ul>

          {isPro ? (
            <button
              onClick={handlePortal}
              disabled={loading}
              className="btn-ghost w-full text-sm justify-center"
            >
              {loading ? 'Loading…' : 'Manage billing'}
            </button>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="btn-primary w-full text-sm justify-center"
            >
              {loading ? 'Loading…' : 'Upgrade to Pro'}
            </button>
          )}
        </div>
      </div>

      {isPro && (
        <p className="text-xs text-ink-500 mt-4">
          To cancel or change your subscription, use the billing portal above.
        </p>
      )}
    </div>
  );
}
