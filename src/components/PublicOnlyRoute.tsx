import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuthStore';

// Keeps authenticated users out of public-only pages (landing, login).
export function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  if (token) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
