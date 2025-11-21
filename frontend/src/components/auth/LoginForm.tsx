import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getEmailError, getPasswordError } from '../../lib/validation';
import { getErrorMessage } from '../../lib/errors';

/**
 * Login form component
 * Handles user authentication with email and password
 */
const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    // Client-side validation
    const emailError = getEmailError(email);
    const passwordError = getPasswordError(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      setIsSubmitting(false);
      return;
    }

    try {
      await login(email, password);
      // Redirect to tasks page on success
      navigate('/tasks');
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle input change and clear error for that field
   */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const isDisabled = isSubmitting || isLoading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-paypros-dark via-paypros-secondary to-paypros-dark px-4">
      <div className="max-w-md w-full space-y-8 bg-black p-8 rounded-lg shadow-xl">
        <div className="flex flex-col items-center">
          <img
            src="/PayProsWhiteLogo-DiCM9YYA.png"
            alt="PayPros Logo"
            className="h-16 w-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-white mb-2">TaskPanel</h1>
          <h2 className="text-center text-xl font-semibold text-paypros-primary">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-paypros-primary hover:text-paypros-accent"
            >
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="rounded-md bg-red-900 bg-opacity-50 p-4 border border-red-500">
              <div className="text-sm text-red-200">{errors.general}</div>
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={handleEmailChange}
                className={`appearance-none rounded-t-md relative block w-full px-3 py-2 border bg-gray-800 ${
                  errors.email ? 'border-red-500' : 'border-gray-600'
                } placeholder-gray-400 text-white focus:outline-none focus:ring-paypros-primary focus:border-paypros-primary focus:z-10 sm:text-sm`}
                placeholder="Email address"
                disabled={isDisabled}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={handlePasswordChange}
                className={`appearance-none rounded-b-md relative block w-full px-3 py-2 border bg-gray-800 ${
                  errors.password ? 'border-red-500' : 'border-gray-600'
                } placeholder-gray-400 text-white focus:outline-none focus:ring-paypros-primary focus:border-paypros-primary focus:z-10 sm:text-sm`}
                placeholder="Password"
                disabled={isDisabled}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isDisabled}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isDisabled
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-paypros-primary hover:bg-paypros-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-paypros-primary'
              }`}
            >
              {isDisabled ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;

