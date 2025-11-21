import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getErrorMessage } from '../lib/errors';

/**
 * API client with interceptors for JWT token management
 * Base URL is configured via environment variable REACT_APP_API_URL
 */
class ApiClient {
      private client: AxiosInstance;

      constructor() {
            // Base URL configuration
            // Default: http://localhost:3001 (matches backend default port)
            // Error: ERR_CONNECTION_REFUSED indicates backend is not running
            // Fix: Ensure backend is running on the configured port
            const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            const timeout = parseInt(process.env.REACT_APP_API_TIMEOUT || '10000', 10);

            this.client = axios.create({
                  baseURL,
                  timeout,
                  headers: {
                        'Content-Type': 'application/json',
                  },
            });

            this.setupInterceptors();
      }

      /**
       * Setup request and response interceptors
       */
      private setupInterceptors(): void {
            // Request interceptor: Add JWT token to headers
            this.client.interceptors.request.use(
                  (config: InternalAxiosRequestConfig) => {
                        const token = this.getToken();
                        if (token && config.headers) {
                              config.headers.Authorization = `Bearer ${token}`;
                        }
                        return config;
                  },
                  (error: AxiosError) => {
                        return Promise.reject(error);
                  }
            );

            // Response interceptor: 
            // 1. Extract data from standardized format { data: T, statusCode: number }
            // 2. Handle 401 errors (unauthorized)
            this.client.interceptors.response.use(
                  (response) => {
                        // Check if response has standardized format from TransformInterceptor
                        // Format: { data: T, statusCode: number }
                        // This format is applied by backend/src/common/interceptors/transform.interceptor.ts
                        if (
                              response.data &&
                              typeof response.data === 'object' &&
                              response.data !== null &&
                              !Array.isArray(response.data) &&
                              'data' in response.data &&
                              'statusCode' in response.data &&
                              typeof (response.data as any).statusCode === 'number'
                        ) {
                              // Extract and return only the data property
                              response.data = (response.data as any).data;
                        }
                        return response;
                  },
                  (error: AxiosError) => {
                        if (error.response?.status === 401) {
                              // Token expired or invalid - clear token and redirect to login
                              this.clearToken();

                              // Only redirect if not already on login/register page
                              if (!window.location.pathname.includes('/login') &&
                                    !window.location.pathname.includes('/register')) {
                                    window.location.href = '/login';
                              }
                        }
                        return Promise.reject(error);
                  }
            );
      }

      /**
       * Get JWT token from localStorage
       */
      private getToken(): string | null {
            return localStorage.getItem('auth_token');
      }

      /**
       * Clear JWT token from localStorage
       */
      public clearToken(): void {
            localStorage.removeItem('auth_token');
      }

      /**
       * Set JWT token in localStorage and update interceptor
       * @param token - JWT token to store
       */
      public setToken(token: string): void {
            if (token) {
                  localStorage.setItem('auth_token', token);
            } else {
                  this.clearToken();
            }
      }

      /**
       * GET request
       */
      public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
            try {
                  const response = await this.client.get<T>(url, config);
                  return response.data;
            } catch (error) {
                  throw this.handleError(error);
            }
      }

      /**
       * POST request
       */
      public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
            try {
                  const response = await this.client.post<T>(url, data, config);
                  return response.data;
            } catch (error) {
                  throw this.handleError(error);
            }
      }

      /**
       * PATCH request
       */
      public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
            try {
                  const response = await this.client.patch<T>(url, data, config);
                  return response.data;
            } catch (error) {
                  throw this.handleError(error);
            }
      }

      /**
       * DELETE request
       */
      public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
            try {
                  const response = await this.client.delete<T>(url, config);
                  return response.data;
            } catch (error) {
                  throw this.handleError(error);
            }
      }

      /**
       * Handle and transform errors
       */
      private handleError(error: unknown): Error {
            const message = getErrorMessage(error);
            const apiError = new Error(message);

            // Attach status code if available
            if (error && typeof error === 'object') {
                  const axiosError = error as any;
                  if (axiosError.response?.status) {
                        (apiError as any).statusCode = axiosError.response.status;
                  }
            }

            return apiError;
      }
}

// Export singleton instance
export const apiClient = new ApiClient();

