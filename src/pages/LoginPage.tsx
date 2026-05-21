import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuthStore';
import { useLanguage, languageNames, Language } from '../contexts/LanguageContext';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

function TranslateIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" />
      <path d="M7 2h1" /><path d="m22 22-5-10-5 10" /><path d="M14 18h6" />
    </svg>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { t, language, setLanguage } = useLanguage();
  const [serverError, setServerError] = useState('');
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError('');
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })
        ?.response?.data?.error || 'Something went wrong';
      setServerError(msg);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink-800 border-r border-ink-700 flex-col justify-between p-12">
        <div>
          <span className="font-display text-2xl text-amber-500 italic">Schedully</span>
        </div>
        <div>
          <p className="font-display text-5xl text-ink-100 leading-tight mb-6">
            Every booking,<br />
            <em className="text-amber-500">perfectly timed.</em>
          </p>
          <p className="text-ink-400 text-sm leading-relaxed max-w-sm">
            Manage your business, services, and clients from one clean dashboard. No spreadsheets. No back-and-forth.
          </p>
        </div>
        <div className="flex gap-8 text-xs text-ink-500 font-mono">
          <span>2,400+ bookings/day</span>
          <span>340+ businesses</span>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-fade-up">

          {/* Language selector */}
          <div className="flex justify-end mb-6" ref={langRef}>
            <div className="relative">
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
          </div>

          <div className="mb-8">
            <span className="lg:hidden font-display text-2xl text-amber-500 italic block mb-8">Schedully</span>
            <h1 className="font-display text-3xl text-ink-100 mb-2">{t.login.title}</h1>
            <p className="text-ink-400 text-sm">{t.login.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">{t.login.emailLabel}</label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="input-field"
                autoComplete="email"
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">{t.login.passwordLabel}</label>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="input-field"
                autoComplete="current-password"
              />
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            {serverError && (
              <div className="bg-red-950/50 border border-red-800 rounded-lg px-4 py-3 text-sm text-red-400">
                {serverError}
              </div>
            )}

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-2">
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Spinner /> {t.login.submitting}
                </span>
              ) : t.login.submit}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-ink-700 text-center space-y-2">
            <p className="text-ink-400 text-sm">
              {t.login.ownBusiness}{' '}
              <Link to="/register/owner" className="text-amber-500 hover:text-amber-400 transition-colors">
                {t.login.createAccount}
              </Link>
            </p>
            <p className="text-ink-400 text-sm">
              {t.login.lookingToBook}{' '}
              <Link to="/register/client" className="text-amber-500 hover:text-amber-400 transition-colors">
                {t.login.signUpClient}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}
