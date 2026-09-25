import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import AppLayout from './layouts/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AgentsPage from './pages/AgentsPage';
import GuestRequestsPage from './pages/GuestRequestsPage';
import OperationsPage from './pages/OperationsPage';
import RevenuePage from './pages/RevenuePage';
import DemoCenterPage from './pages/DemoCenterPage';
import GuestPortalPage from './pages/GuestPortalPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="guest-portal" element={<GuestPortalPage />} />
        <Route path="agents" element={<AgentsPage />} />
        <Route path="guest-requests" element={<GuestRequestsPage />} />
        <Route path="operations" element={<OperationsPage />} />
        <Route path="revenue" element={<RevenuePage />} />
        <Route path="demo" element={<DemoCenterPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
