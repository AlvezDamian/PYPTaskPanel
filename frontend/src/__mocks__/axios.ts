/**
 * Manual mock for axios
 * This resolves Jest ES module issues with axios
 */

// Create a mock instance that can be accessed in tests
export const mockAxiosInstance = {
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  patch: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  request: jest.fn(() => Promise.resolve({ data: {} })),
  interceptors: {
    request: {
      use: jest.fn(),
      eject: jest.fn(),
    },
    response: {
      use: jest.fn(),
      eject: jest.fn(),
    },
  },
  defaults: {
    headers: {
      common: {},
    },
  },
};

// Create axios mock that returns the mock instance
const axios = {
  create: jest.fn(() => mockAxiosInstance),
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  patch: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  request: jest.fn(() => Promise.resolve({ data: {} })),
  interceptors: {
    request: {
      use: jest.fn(),
      eject: jest.fn(),
    },
    response: {
      use: jest.fn(),
      eject: jest.fn(),
    },
  },
  defaults: {
    headers: {
      common: {},
    },
  },
  CancelToken: {
    source: jest.fn(() => ({
      token: {},
      cancel: jest.fn(),
    })),
  },
  isCancel: jest.fn(() => false),
};

// Mock AxiosError class
export class AxiosError extends Error {
  response?: {
    data?: any;
    status?: number;
    statusText?: string;
    headers?: any;
    config?: any;
  };
  request?: any;
  config?: any;
  code?: string;
  isAxiosError = true;

  constructor(message?: string) {
    super(message);
    this.name = 'AxiosError';
  }
}

export default axios;
export { axios };

