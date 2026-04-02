import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuthStore } from '../../hooks/useAuthStore';
import { useLanguage } from '../../contexts/LanguageContext';

export function BillingTab() {
  const { business, fetchMe } = useAuthStore();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const billingParam = searchParams.get('billing');
  const isPro = business?.plan === 'pro';

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
      <h2 className="font-display text-2xl text-ink-100 mb-1">{t.billing.title}</h2>
      <p className="text-ink-400 text-sm mb-8">{t.billing.subtitle}</p>

      {billingParam === 'success' && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
          {t.billing.successBanner}
        </div>
      )}

      {billingParam === 'cancelled' && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-ink-700 border border-ink-600 text-ink-300 text-sm">
          {t.billing.cancelledBanner}
        </div>
      )}

      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

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
                {t.billing.current}
              </span>
            )}
          </div>
          <ul className="space-y-2 text-sm text-ink-400">
            <li className="flex items-center gap-2"><span className="text-ink-500">✓</span> {t.billing.freeFeature1}</li>
            <li className="flex items-center gap-2"><span className="text-ink-500">✓</span> {t.billing.freeFeature2}</li>
            <li className="flex items-center gap-2"><span className="text-ink-500">✓</span> {t.billing.freeFeature3}</li>
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
                {t.billing.current}
              </span>
            )}
          </div>
          <ul className="space-y-2 text-sm text-ink-400 mb-6">
            <li className="flex items-center gap-2"><span className="text-amber-500">✓</span> {t.billing.proFeature1}</li>
            <li className="flex items-center gap-2"><span className="text-amber-500">✓</span> {t.billing.proFeature2}</li>
            <li className="flex items-center gap-2"><span className="text-amber-500">✓</span> {t.billing.proFeature3}</li>
          </ul>

          {isPro ? (
            <button onClick={handlePortal} disabled={loading} className="btn-ghost w-full text-sm justify-center">
              {loading ? t.billing.loadingBtn : t.billing.manageBilling}
            </button>
          ) : (
            <button onClick={handleUpgrade} disabled={loading} className="btn-primary w-full text-sm justify-center">
              {loading ? t.billing.loadingBtn : t.billing.upgrade}
            </button>
          )}
        </div>
      </div>

      {isPro && (
        <p className="text-xs text-ink-500 mt-4">{t.billing.cancelHint}</p>
      )}
    </div>
  );
}
