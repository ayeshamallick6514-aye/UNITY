import React, { Suspense, useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { API_BASE } from './utils/constants';

// Shared core items
import ProtectedRoute      from './components/shared/ProtectedRoute';
import Loader              from './components/shared/Loader';
import SessionTimeoutModal from './components/shared/SessionTimeoutModal';
import ErrorBoundary       from './components/shared/ErrorBoundary';
import { ToastProvider }   from './components/ui/Toast';

// Layouts (Statically imported to preserve shell foundations)
import AuthLayout       from './layouts/AuthLayout';
import AuthorityLayout  from './layouts/AuthorityLayout';
import CommandLayout    from './layouts/CommandLayout';
import CitizenLayout    from './layouts/CitizenLayout';

// Error Views (Statically imported for reliable fallback)
import NotFoundPage     from './pages/error/NotFoundPage';
import UnauthorizedPage from './pages/error/UnauthorizedPage';
import ForbiddenPage    from './pages/error/ForbiddenPage';

// Lazy Loaded Page Views
const RoleSelectionPage = React.lazy(() => import('./pages/RoleSelectionPage'));

// Auth Pages
const LoginPage          = React.lazy(() => import('./pages/auth/LoginPage'));
const OtpVerifyPage      = React.lazy(() => import('./pages/auth/OtpVerifyPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/auth/ForgotPasswordPage'));

// Authority Portal Pages
const Dashboard      = React.lazy(() => import('./pages/authority/Dashboard'));
const Projects       = React.lazy(() => import('./pages/authority/Projects'));
const ProjectDetail  = React.lazy(() => import('./pages/authority/ProjectDetail'));
const LiveMap        = React.lazy(() => import('./pages/authority/LiveMap'));
const Departments    = React.lazy(() => import('./pages/authority/Departments'));
const Coordination   = React.lazy(() => import('./pages/authority/Coordination'));
const Approvals      = React.lazy(() => import('./pages/authority/Approvals'));
const ExecutiveBrief = React.lazy(() => import('./pages/authority/ExecutiveBrief'));

// Command Portal Pages
const MissionOverview   = React.lazy(() => import('./pages/command/MissionOverview'));
const Escalations       = React.lazy(() => import('./pages/command/Escalations'));
const DeptMatrix        = React.lazy(() => import('./pages/command/DeptMatrix'));
const ProjectMonitoring = React.lazy(() => import('./pages/command/ProjectMonitoring'));
const CitizenAlerts     = React.lazy(() => import('./pages/command/CitizenAlerts'));
const FundingRisks      = React.lazy(() => import('./pages/command/FundingRisks'));
const ExecutiveReports  = React.lazy(() => import('./pages/command/ExecutiveReports'));
const PerformanceKPIs   = React.lazy(() => import('./pages/command/PerformanceKPIs'));
const SystemHealth      = React.lazy(() => import('./pages/command/SystemHealth'));
const AIRecommendations = React.lazy(() => import('./pages/command/AIRecommendations'));

// Citizen Portal Pages
const CitizenPortalHub   = React.lazy(() => import('./pages/citizen/CitizenPortalHub'));
const CitizenHome        = React.lazy(() => import('./pages/citizen/CitizenHome'));
const ReportIssue        = React.lazy(() => import('./pages/citizen/ReportIssue'));
const NearbyProjects     = React.lazy(() => import('./pages/citizen/NearbyProjects'));
const GovSchemes         = React.lazy(() => import('./pages/citizen/GovSchemes'));
const TrackComplaint     = React.lazy(() => import('./pages/citizen/TrackComplaint'));
const CitizenNotifications = React.lazy(() => import('./pages/citizen/CitizenNotifications'));
const CitizenProfile     = React.lazy(() => import('./pages/citizen/CitizenProfile'));

// Placeholder views for not-yet-implemented routes
const PlaceholderPage = ({ title }) => (
  <div className="p-6">
    <div className="bg-white border border-gray-100 rounded-lg px-6 py-8 text-center max-w-lg mx-auto mt-8">
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
        <span className="text-gray-400 text-lg">⚙</span>
      </div>
      <h2 className="text-base font-semibold text-gray-900 mb-1">{title}</h2>
      <p className="text-sm text-gray-400">
        This view is registered in the architecture and routing configuration. Layout rendering is fully active.
      </p>
    </div>
  </div>
);

const AUTHORITY_ROLES = ['collector', 'commissioner', 'executive_engineer', 'dept_officer'];
const COMMAND_ROLES   = ['nodal_officer', 'chief_secretary'];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30_000,
    },
  },
});

export default function App() {
  // Silent pre-warm ping to wake up cloud backend immediately on site visit
  useEffect(() => {
    try {
      const healthUrl = API_BASE ? API_BASE.replace('/api/v1', '') + '/health' : 'https://unity-backend-0i2e.onrender.com/health';
      fetch(healthUrl, { method: 'GET', mode: 'cors' }).catch(() => {});
    } catch (_) {}
  }, []);

  const [booting, setBooting] = useState(() => {
    try {
      return !sessionStorage.getItem('unity_booted');
    } catch {
      return false;
    }
  });

  const handleBootComplete = () => {
    try {
      sessionStorage.setItem('unity_booted', '1');
    } catch (_) {}
    setBooting(false);
  };

  if (booting) {
    return <Loader onComplete={handleBootComplete} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <ErrorBoundary>
          <Router>
            <SessionTimeoutModal />

            <Suspense fallback={
              <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-md" />
                  <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase">Loading System Workspace...</span>
                </div>
              </div>
            }>
              <Routes>
                {/* Root Gateway Redirect */}
                <Route path="/" element={<Navigate to="/select-role" replace />} />
                <Route path="/select-role" element={<RoleSelectionPage />} />

                {/* Authentication Routes */}
                <Route element={<AuthLayout />}>
                  <Route path="/auth/login"  element={<LoginPage />} />
                  <Route path="/auth/verify" element={<OtpVerifyPage />} />
                  <Route path="/auth/forgot" element={<ForgotPasswordPage />} />
                </Route>

                {/* Secure Error Views */}
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="/forbidden"    element={<ForbiddenPage />} />

                {/* Authority Workspace */}
                <Route
                  path="/authority"
                  element={
                    <ProtectedRoute allowedRoles={AUTHORITY_ROLES}>
                      <AuthorityLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index                element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard"     element={<Dashboard />} />
                  <Route path="projects"      element={<Projects />} />
                  <Route path="projects/:id"  element={<ProjectDetail />} />
                  <Route path="map"           element={<LiveMap />} />
                  <Route path="departments"   element={<Departments />} />
                  <Route path="departments/:id" element={<PlaceholderPage title="Department Detail" />} />
                  <Route path="coordination"  element={<Coordination />} />
                  <Route path="approvals"     element={<Approvals />} />
                  <Route path="brief"         element={<ExecutiveBrief />} />
                  <Route path="analytics"     element={<PlaceholderPage title="Analytics Console" />} />
                  <Route path="settings"      element={<PlaceholderPage title="System Settings" />} />
                </Route>

                {/* Command Centre Workspace */}
                <Route
                  path="/command"
                  element={
                    <ProtectedRoute allowedRoles={COMMAND_ROLES}>
                      <CommandLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index                element={<Navigate to="overview" replace />} />
                  <Route path="overview"      element={<MissionOverview />} />
                  <Route path="escalations"   element={<Escalations />} />
                  <Route path="matrix"        element={<DeptMatrix />} />
                  <Route path="projects"      element={<ProjectMonitoring />} />
                  <Route path="citizens"      element={<CitizenAlerts />} />
                  <Route path="funding"       element={<FundingRisks />} />
                  <Route path="reports"       element={<ExecutiveReports />} />
                  <Route path="kpis"          element={<PerformanceKPIs />} />
                  <Route path="health"        element={<SystemHealth />} />
                  <Route path="ai"            element={<AIRecommendations />} />
                </Route>

                {/* Citizen Portal (Guest Allowed) */}
                <Route path="/citizen" element={<CitizenLayout />}>
                  <Route index                element={<Navigate to="home" replace />} />
                  <Route path="home"          element={<CitizenPortalHub />} />
                  <Route path="portal"        element={<CitizenPortalHub />} />
                  <Route path="report"        element={<ReportIssue />} />
                  <Route path="projects"      element={<NearbyProjects />} />
                  <Route path="schemes"       element={<GovSchemes />} />
                  <Route path="track"         element={<TrackComplaint />} />
                  <Route path="notifications" element={<CitizenNotifications />} />
                  <Route path="profile"       element={<CitizenProfile />} />
                </Route>

                {/* Fallback 404 Handler */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </Router>
        </ErrorBoundary>
      </ToastProvider>
    </QueryClientProvider>
  );
}
