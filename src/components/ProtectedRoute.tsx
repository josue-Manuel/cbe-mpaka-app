import { Navigate, useLocation } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { ReactNode } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { profile, isLoading } = useProfile();
  const location = useLocation();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!profile) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
