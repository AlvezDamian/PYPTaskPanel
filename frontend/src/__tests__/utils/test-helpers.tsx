import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import { User } from '../../types/Auth';

/**
 * Test utilities for React components
 * Provides helpers for rendering components with necessary providers
 */

/**
 * Mock user for tests
 */
export const mockUser: User = {
  id: 'test-user-id',
  email: 'test@example.com',
};

/**
 * Mock token for tests
 */
export const mockToken = 'mock-jwt-token';

/**
 * Custom render function that includes all necessary providers
 * @param ui - Component to render
 * @param options - Render options including initial auth state
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options?: {
    initialAuthState?: {
      user?: User | null;
      token?: string | null;
    };
    renderOptions?: Omit<RenderOptions, 'wrapper'>;
  },
) {
  const { initialAuthState, renderOptions } = options || {};

  // Mock localStorage for auth state
  if (initialAuthState?.token) {
    localStorage.setItem('auth_token', initialAuthState.token);
  }
  if (initialAuthState?.user) {
    localStorage.setItem('auth_user', JSON.stringify(initialAuthState.user));
  }

  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    // Try to use BrowserRouter from react-router-dom, fallback to mock if not available
    let Router: React.ComponentType<{ children: React.ReactNode }>;
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { BrowserRouter: BR } = require('react-router-dom');
      Router = BR;
    } catch {
      Router = BrowserRouter;
    }
    
    return (
      <Router>
        <AuthProvider>{children}</AuthProvider>
      </Router>
    );
  };

  return render(ui, { wrapper: AllTheProviders, ...renderOptions });
}

/**
 * Render with auth context only (no router)
 */
export function renderWithAuth(
  ui: React.ReactElement,
  options?: {
    initialAuthState?: {
      user?: User | null;
      token?: string | null;
    };
    renderOptions?: Omit<RenderOptions, 'wrapper'>;
  },
) {
  const { initialAuthState, renderOptions } = options || {};

  if (initialAuthState?.token) {
    localStorage.setItem('auth_token', initialAuthState.token);
  }
  if (initialAuthState?.user) {
    localStorage.setItem('auth_user', JSON.stringify(initialAuthState.user));
  }

  const AuthProviderWrapper = ({ children }: { children: React.ReactNode }) => {
    return <AuthProvider>{children}</AuthProvider>;
  };

  return render(ui, { wrapper: AuthProviderWrapper, ...renderOptions });
}

/**
 * Clean up localStorage after tests
 */
export function cleanupLocalStorage() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}

/**
 * Wait for async operations
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wait for element to appear
 */
export async function waitForElement(
  callback: () => HTMLElement | null,
  timeout = 1000,
): Promise<HTMLElement> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const element = callback();
    if (element) {
      return element;
    }
    await wait(50);
  }
  throw new Error('Element not found within timeout');
}

// Re-export everything from testing-library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

