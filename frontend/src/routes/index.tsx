import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import TasksPage from '../pages/TasksPage';
import AuthGuard from '../components/auth/AuthGuard';

/**
 * Root route component
 * Handles navigation based on authentication state
 */
const RootRedirect: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paypros-dark">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return <Navigate to={isAuthenticated ? '/tasks' : '/login'} replace />;
};

/**
 * App routes configuration
 */
const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/tasks"
          element={
            <AuthGuard>
              <TasksPage />
            </AuthGuard>
          }
        />
        <Route path="/" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

