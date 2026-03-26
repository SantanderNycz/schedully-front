import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterOwnerPage } from './pages/RegisterOwnerPage';
import { RegisterClientPage } from './pages/RegisterClientPage';
import { DashboardPage } from './pages/DashboardPage';
import { BookingPage } from './pages/BookingPage';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/owner" element={<RegisterOwnerPage />} />
        <Route path="/register/client" element={<RegisterClientPage />} />
        <Route path="/book/:slug" element={<BookingPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
