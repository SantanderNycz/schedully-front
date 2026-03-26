import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuthStore';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  businessName: z.string().min(2, 'Business name is required'),
  businessSlug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens'),
});

type FormData = z.infer<typeof schema>;

export function RegisterOwnerPage() {
  const navigate = useNavigate();
  const { loginOwner } = useAuthStore();
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Auto-generate slug from business name
  const handleBusinessNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    setValue('businessSlug', slug);
  };

  const slug = watch('businessSlug') || '';

  const onSubmit = async (data: FormData) => {
    setServerError('');
    try {
      await loginOwner(data);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })
        ?.response?.data?.error || 'Something went wrong';
      setServerError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md animate-fade-up">

        <div className="mb-8">
          <Link to="/" className="font-display text-xl text-amber-500 italic block mb-8">Schedully</Link>
          <h1 className="font-display text-3xl text-ink-100 mb-2">Set up your business</h1>
          <p className="text-ink-400 text-sm">Create your account and start accepting bookings today.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Your name</label>
              <input
                {...register('name')}
                placeholder="Ana Silva"
                className="input-field"
              />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
            </div>

            <div className="col-span-2">
              <label className="label">Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="ana@example.com"
                className="input-field"
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div className="col-span-2">
              <label className="label">Password</label>
              <input
                {...register('password')}
                type="password"
                placeholder="At least 8 characters"
                className="input-field"
              />
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>
          </div>

          <div className="border-t border-ink-700 pt-4 space-y-4">
            <p className="text-xs text-ink-500 uppercase tracking-widest font-mono">Business details</p>

            <div>
              <label className="label">Business name</label>
              <input
                {...register('businessName')}
                placeholder="Barbearia Central"
                className="input-field"
                onChange={(e) => {
                  register('businessName').onChange(e);
                  handleBusinessNameChange(e);
                }}
              />
              {errors.businessName && <p className="mt-1 text-xs text-red-400">{errors.businessName.message}</p>}
            </div>

            <div>
              <label className="label">Public URL</label>
              <div className="flex items-center">
                <span className="bg-ink-700 border border-r-0 border-ink-600 rounded-l-lg px-3 py-3 text-sm text-ink-400 font-mono whitespace-nowrap">
                  schedully.app/
                </span>
                <input
                  {...register('businessSlug')}
                  placeholder="barbearia-central"
                  className="input-field rounded-l-none"
                />
              </div>
              {slug && !errors.businessSlug && (
                <p className="mt-1 text-xs text-ink-500 font-mono">schedully.app/{slug}</p>
              )}
              {errors.businessSlug && <p className="mt-1 text-xs text-red-400">{errors.businessSlug.message}</p>}
            </div>
          </div>

          {serverError && (
            <div className="bg-red-950/50 border border-red-800 rounded-lg px-4 py-3 text-sm text-red-400">
              {serverError}
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Creating account…' : 'Create business account →'}
          </button>
        </form>

        <p className="mt-6 text-center text-ink-400 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-amber-500 hover:text-amber-400 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
