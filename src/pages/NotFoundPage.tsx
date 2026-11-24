import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md animate-fade-up">
        <p className="font-mono text-sm text-amber-500 mb-4">404</p>
        <h1 className="font-display text-4xl text-ink-100 mb-3">Page not found</h1>
        <p className="text-ink-400 text-sm mb-8">
          The page you're looking for doesn't exist or has moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn-primary">Back to home</Link>
          <Link to="/login" className="btn-ghost">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
