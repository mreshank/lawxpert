import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAuthStore } from './store/auth';
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Loading component
import { Skeleton } from '@/components/ui/skeleton'; 

// Lazy loaded components
const Index = lazy(() => import('./pages/Index'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Chat = lazy(() => import('./pages/Chat'));
const LawyerMarketplace = lazy(() => import('./pages/LawyerMarketplace'));
const LawyerProfilePage = lazy(() => import('./pages/LawyerProfilePage'));
const Admin = lazy(() => import('./pages/Admin'));
const Documents = lazy(() => import('./pages/Documents'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LegalDocumentation = lazy(() => import('./pages/LegalDocumentation'));
const AnalyzeDocument = lazy(() => import('./components/AnalyzeDocument'));
const NotFound = lazy(() => import('./pages/NotFound'));
const TestMarkdown = lazy(() => import('./test-markdown'));

// Loading fallback
const PageLoader = () => (
  <div className="w-full h-screen flex flex-col items-center justify-center p-4">
    <div className="w-full max-w-md space-y-4">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-64 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={
          <Suspense fallback={<PageLoader />}>
            <Index />
          </Suspense>
        } />
        <Route path="/login" element={
          <Suspense fallback={<PageLoader />}>
            <Login />
          </Suspense>
        } />
        <Route path="/register" element={
          <Suspense fallback={<PageLoader />}>
            <Register />
          </Suspense>
        } />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <Chat />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route path="/lawyers" element={
          <Suspense fallback={<PageLoader />}>
            <LawyerMarketplace />
          </Suspense>
        } />
        <Route path="/lawyers/:id" element={
          <Suspense fallback={<PageLoader />}>
            <LawyerProfilePage />
          </Suspense>
        } />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <Suspense fallback={<PageLoader />}>
                <Admin />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <Documents />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route path="/legal-documentation" element={
          <Suspense fallback={<PageLoader />}>
            <LegalDocumentation />
          </Suspense>
        } />
        <Route 
          path="/analyze" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <AnalyzeDocument />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        <Route path="/test-markdown" element={
          <Suspense fallback={<PageLoader />}>
            <TestMarkdown />
          </Suspense>
        } />
        <Route path="*" element={
          <Suspense fallback={<PageLoader />}>
            <NotFound />
          </Suspense>
        } />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 
