import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

/**
 * Basic smoke test for App component
 * Verifies that the app renders without crashing
 */
test('renders app without crashing', () => {
  render(<App />);
  // App should render without errors
  expect(screen.getByRole('main') || document.body).toBeInTheDocument();
});
