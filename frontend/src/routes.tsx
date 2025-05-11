import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import AppLayout from './layouts/AppLayout';

// Pages
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import LawyerMarketplace from './pages/LawyerMarketplace';
import Admin from './pages/Admin';
import Documents from './pages/Documents';
import Dashboard from './pages/Dashboard';
import LegalDocumentation from './pages/LegalDocumentation';
import TestMarkdown from './test-markdown';
import NotFound from './pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/lawyers" element={<LawyerMarketplace />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/legal-documentation" element={<LegalDocumentation />} />
        <Route path="/test-markdown" element={<TestMarkdown />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 
