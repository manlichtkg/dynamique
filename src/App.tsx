import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';


// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Lazy Loading for ALL pages
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const VerifyEmail = React.lazy(() => import('./pages/VerifyEmail'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Features = React.lazy(() => import('./pages/Features'));
const Pricing = React.lazy(() => import('./pages/Pricing'));
const About = React.lazy(() => import('./pages/About'));
const CommunityPage = React.lazy(() => import('./pages/CommunityPage'));
const Rewards = React.lazy(() => import('./pages/Rewards'));
const Formation = React.lazy(() => import('./pages/Formation'));
const CourseDetails = React.lazy(() => import('./pages/CourseDetails'));
const Lesson = React.lazy(() => import('./pages/Lesson'));
const Settings = React.lazy(() => import('./pages/Settings'));

// Components (for Suspense fallback)
import { Loader2 } from 'lucide-react';

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

// Context

import { ToastProvider } from './context/ToastContext';
import NetworkStatus from './components/NetworkStatus';
import { Confetti } from './components/ui/Confetti';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './components/ui/ErrorFallback';

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <ToastProvider>
        <NetworkStatus />
        <Confetti />

        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="features" element={<Features />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="about" element={<About />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            {/* Protected Dashboard Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/formation" element={<Formation />} />
              <Route path="/course/:id" element={<CourseDetails />} />
              <Route path="/item/:id" element={<CourseDetails />} /> {/* Fallback for older links */}
              <Route path="/lesson/:courseId" element={<Lesson />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Fallback to Home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </ToastProvider>
    </ErrorBoundary>
  );
}
