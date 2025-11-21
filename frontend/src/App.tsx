import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import AppRoutes from './routes';
import './App.css';

/**
 * Root App component
 * Wraps the app with AuthProvider, ErrorBoundary, and sets up routing
 */
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
