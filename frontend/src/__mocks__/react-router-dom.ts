/**
 * Manual mock for react-router-dom
 * This resolves Jest module resolution issues with react-router-dom v7
 */

import React from 'react';

interface RouterProps {
  children: React.ReactNode;
}

export const BrowserRouter: React.FC<RouterProps> = ({ children }) =>
  React.createElement(React.Fragment, null, children);

export const MemoryRouter: React.FC<RouterProps> = ({ children }) =>
  React.createElement(React.Fragment, null, children);

export const useNavigate = jest.fn(() => jest.fn());

export const useLocation = jest.fn(() => ({
  pathname: '/',
  search: '',
  hash: '',
  state: null,
  key: 'default',
}));

export const Link = ({
  children,
  to,
  ...props
}: {
  children: React.ReactNode;
  to: string;
  [key: string]: any;
}) => React.createElement('a', { href: to, ...props }, children);

export const NavLink = ({
  children,
  to,
  ...props
}: {
  children: React.ReactNode;
  to: string;
  [key: string]: any;
}) => React.createElement('a', { href: to, ...props }, children);

export const Routes: React.FC<RouterProps> = ({ children }) =>
  React.createElement(React.Fragment, null, children);

export const Route = ({
  children,
  ...props
}: {
  children?: React.ReactNode;
  [key: string]: any;
}) => React.createElement(React.Fragment, null, children);

export const Navigate = ({ to }: { to: string }) => null;

export const useParams = jest.fn(() => ({}));

export const useSearchParams = jest.fn(() => [new URLSearchParams(), jest.fn()]);

export const Outlet = () => null;

