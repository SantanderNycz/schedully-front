import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuthStore';

interface Props {
  children: React.ReactNode;
  requireRole?: 'owner' | 'client';
}

export function ProtectedRoute({ children, requireRole }: Props) {
  const { user, token, fetchMe, isLoading } = useAuthStore();

  useEffect(() => {
    if (token && !user) {
      fetchMe();
    }
  }, [token]);

  if (!token) return <Navigate to="/login" replace />;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-ink-400 font-mono text-sm">Loading…</div>
      </div>
    );
  }

  if (requireRole && user?.role !== requireRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
