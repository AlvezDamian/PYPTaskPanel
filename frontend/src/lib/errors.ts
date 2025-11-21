/**
 * Error handling utilities for API responses
 */

export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
}

/**
 * Extract error message from API error response
 * @param error - Error object from axios or API
 * @returns User-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  // Handle AxiosError (can be Error instance or plain object)
  if (error && typeof error === 'object') {
    const axiosError = error as any;
    
    // Check if it's an axios error with response data
    if (axiosError.response?.data) {
      const data = axiosError.response.data;
      
      // Handle NestJS error format
      if (data.message) {
        if (Array.isArray(data.message)) {
          return data.message.join(', ');
        }
        return data.message;
      }
      
      // Handle error field
      if (data.error) {
        return data.error;
      }
    }
    
    // Handle AxiosError without response (network errors)
    if (axiosError.message && !axiosError.response) {
      return axiosError.message;
    }
  }

  // Handle standard Error instances
  if (error instanceof Error) {
    return error.message || 'An unexpected error occurred';
  }

  return 'An unexpected error occurred';
}

/**
 * Extract status code from API error
 * @param error - Error object from axios or API
 * @returns HTTP status code or undefined
 */
export function getErrorStatus(error: unknown): number | undefined {
  if (error && typeof error === 'object') {
    const axiosError = error as any;
    if (axiosError.response?.status) {
      return axiosError.response.status;
    }
  }
  return undefined;
}

