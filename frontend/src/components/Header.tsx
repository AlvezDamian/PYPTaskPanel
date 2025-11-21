import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onBackClick?: () => void;
  showBackButton?: boolean;
}

/**
 * Header component
 * Displays app header with title, back button (optional), and logout button
 */
const Header: React.FC<HeaderProps> = ({
  onBackClick,
  showBackButton = false,
}) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {showBackButton && (
          <button
            onClick={onBackClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <svg
              className="h-5 w-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
        <img
          src="/short-black-logo-KlOLxQxG.png"
          alt="PayPros Logo"
          className="h-8 w-auto"
        />
        <h1 className="text-xl font-bold text-paypros-primary">Dashboard</h1>
      </div>

      <div className="flex items-center space-x-3">
        {user && (
          <span className="text-sm text-gray-600 hidden sm:inline">
            {user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.email}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 text-sm font-medium text-white bg-paypros-primary hover:bg-paypros-accent rounded-md transition-colors"
          aria-label="Logout"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
