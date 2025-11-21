/**
 * Validation utilities for forms
 */

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns true if valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate password length
 * @param password - Password to validate
 * @param minLength - Minimum password length (default: 6)
 * @returns true if valid, false otherwise
 */
export function isValidPassword(password: string, minLength: number = 6): boolean {
  return password.trim().length >= minLength;
}

/**
 * Validate that passwords match
 * @param password - Password
 * @param confirmPassword - Password confirmation
 * @returns true if passwords match, false otherwise
 */
export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password.trim() === confirmPassword.trim();
}

/**
 * Get email validation error message
 * @param email - Email address to validate
 * @returns Error message or empty string if valid
 */
export function getEmailError(email: string): string {
  if (!email.trim()) {
    return 'Email is required';
  }
  if (!isValidEmail(email)) {
    return 'Please enter a valid email address';
  }
  return '';
}

/**
 * Get password validation error message
 * @param password - Password to validate
 * @param minLength - Minimum password length (default: 6)
 * @returns Error message or empty string if valid
 */
export function getPasswordError(password: string, minLength: number = 6): string {
  if (!password.trim()) {
    return 'Password is required';
  }
  if (!isValidPassword(password, minLength)) {
    return `Password must be at least ${minLength} characters`;
  }
  return '';
}

/**
 * Get password confirmation error message
 * @param password - Password
 * @param confirmPassword - Password confirmation
 * @returns Error message or empty string if valid
 */
export function getConfirmPasswordError(password: string, confirmPassword: string): string {
  if (!confirmPassword.trim()) {
    return 'Please confirm your password';
  }
  if (!passwordsMatch(password, confirmPassword)) {
    return 'Passwords do not match';
  }
  return '';
}

