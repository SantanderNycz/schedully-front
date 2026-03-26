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
});

type FormData = z.infer<typeof schema>;

export function RegisterClientPage() {
  const navigate = useNavigate();
  const { loginClient } = useAuthStore();
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError('');
    try {
      await loginClient(data);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })
        ?.response?.data?.error || 'Something went wrong';
      setServerError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm animate-fade-up">

        <div className="mb-8">
          <Link to="/" className="font-display text-xl text-amber-500 italic block mb-8">Schedully</Link>
          <h1 className="font-display text-3xl text-ink-100 mb-2">Create your account</h1>
          <p className="text-ink-400 text-sm">Start booking appointments with your favourite businesses.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Full name</label>
            <input
              {...register('name')}
              placeholder="João Ferreira"
              className="input-field"
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>

          <div>
            <label className="label">Email</label>
            <input
              {...register('email')}
              type="email"
              placeholder="joao@example.com"
              className="input-field"
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>

          <div>
            <label className="label">Password</label>
            <input
              {...register('password')}
              type="password"
              placeholder="At least 8 characters"
              className="input-field"
            />
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
          </div>

          {serverError && (
            <div className="bg-red-950/50 border border-red-800 rounded-lg px-4 py-3 text-sm text-red-400">
              {serverError}
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Creating account…' : 'Get started →'}
          </button>
        </form>

        <p className="mt-6 text-center text-ink-400 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-amber-500 hover:text-amber-400 transition-colors">
            Sign in
          </Link>
        </p>

        <p className="mt-2 text-center text-ink-500 text-sm">
          Own a business?{' '}
          <Link to="/register/owner" className="text-ink-400 hover:text-ink-200 transition-colors">
            Create a business account
          </Link>
        </p>
      </div>
    </div>
  );
}
