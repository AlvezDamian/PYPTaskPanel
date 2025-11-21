# Frontend - TaskPanel

React frontend for the TaskPanel task management application.

## Overview

TaskPanel is a full-stack task management application built with React, TypeScript, and Tailwind CSS. The frontend provides a responsive interface for managing tasks with role-based access control.

## Features

- User Authentication: Register and login with JWT-based authentication
- Task Management: Full CRUD operations for tasks with role-based permissions
- Task Status Management: Three status states (TODO, DOING, DONE) with status transitions
- Task Assignment: Assign tasks to specific users during creation
- User Roles: Admin and User roles with different permissions
- Responsive Design: Mobile-first design with separate mobile and desktop layouts
- Task Information: Display creator and assignee information for each task

## Tech Stack

**Core Framework**:
- **React 19.2.0**: UI library with hooks-based architecture
- **TypeScript 4.9.5**: Type safety and developer experience
- **React Router 7.9.6**: Client-side routing (updated from v6.20.0 in docs)

**Styling**:
- **Tailwind CSS 3.4.18**: Utility-first CSS framework
  - **Why Tailwind**: Rapid development, consistent design system
  - **Configuration**: Custom colors and breakpoints in `tailwind.config.js`
  - **Approach**: Utility classes, minimal custom CSS

**HTTP Client**:
- **Axios 1.13.2**: HTTP client library (updated from v1.6.0 in docs)
  - **Why Axios**: Interceptors, better error handling than fetch
  - **Configuration**: Singleton instance with interceptors

**Testing**:
- **Jest**: Test runner
- **React Testing Library**: Component testing utilities
- **@testing-library/user-event**: User interaction simulation

**Build Tool**:
- **react-scripts 5.0.1**: Create React App (CRA) build configuration
  - **Why CRA**: Zero configuration, standard React setup
  - **Note**: No eject performed, using default configuration

## Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- Backend API running on port 3001 (see backend README)

## Setup Instructions

1. Install Dependencies

   ```bash
   npm install
   ```

2. Configure Environment Variables

   Create a `.env` file in the `frontend/` directory:

   ```env
   REACT_APP_API_URL=http://localhost:3001
   REACT_APP_API_TIMEOUT=10000
   ```

3. Start Development Server

   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Project Structure

```
frontend/
├── public/              # Static assets (logos, favicon, manifest)
├── src/
│   ├── components/      # React components
│   │   ├── auth/        # Authentication components
│   │   └── ...          # Task, layout, and UI components
│   ├── contexts/        # React contexts (AuthContext)
│   ├── hooks/           # Custom hooks (useTasks, useAuth, useTaskForm)
│   ├── lib/             # Utilities (errors, validation)
│   ├── pages/           # Page components (LoginPage, RegisterPage, TasksPage)
│   ├── routes/          # Route configuration
│   ├── services/        # API services (api, auth, tasks, users)
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Root component
│   └── index.tsx        # Entry point
├── package.json
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## Architecture

### API Integration

**Decision**: Service layer pattern with singleton API client

The frontend communicates with the backend API through a service layer:

- `api.ts`: **Singleton Axios instance** with interceptors for JWT token management
  - **Why singleton**: Ensures single instance with consistent interceptors across the app
  - **Request interceptor**: Automatically adds `Authorization: Bearer <token>` header from localStorage
  - **Response interceptor**: 
    - Extracts data from backend's standardized format `{ data: T, statusCode: number }`
    - Handles 401 errors by clearing token and redirecting to login
  - **Error handling**: Centralized error transformation using `getErrorMessage` utility
- `auth.service.ts`: Authentication operations (register, login, logout, token management)
- `tasks.service.ts`: CRUD operations for tasks with proper TypeScript typing
- `users.service.ts`: User listing for task assignment dropdowns

**Technical Decision**: Manual mocks in `src/__mocks__/` for Jest testing (axios, react-router-dom)

### State Management

**Decision**: React Context API + Custom Hooks (no Redux)

- **AuthContext**: Manages global authentication state (user, token, isAuthenticated, role)
  - **Why Context API**: Simple state needs, no complex middleware required
  - **Persistence**: State initialized from localStorage on app mount
  - **Scope**: Global authentication state only
- **useTasks Hook**: Manages tasks state and operations (CRUD, status transitions)
  - **Why custom hook**: Encapsulates task logic, reusable across components
  - **State**: Local to components using the hook
- **useAuth Hook**: Consumes AuthContext for easy access to auth state
  - **Why wrapper hook**: Provides type-safe access and throws error if used outside provider
- **useTaskForm Hook**: Manages task form state and validation
  - **Why custom hook**: Separates form logic from UI components

**Technical Decision**: No global state management library (Redux/Zustand) - Context API sufficient for current needs

### Component Organization

**Decision**: Single Responsibility Principle with feature-based grouping

Components follow the Single Responsibility Principle:

- **Auth Components** (`components/auth/`): LoginForm, RegisterForm, AuthGuard
  - **AuthGuard**: HOC that protects routes, redirects unauthenticated users
- **Task Components**: TaskCard, TaskForm, TaskSection
  - **TaskCard**: Displays task with status, creator, assignee information
  - **TaskForm**: Reusable form for create/edit operations
- **Layout Components**: MobileLayout, DesktopLayout, Header
  - **Why separate layouts**: Different UX patterns for mobile vs desktop
  - **Responsive breakpoint**: 768px (detected via window.innerWidth)
- **UI Components**: LoadingSpinner, ErrorBoundary, NewTaskButton
  - **ErrorBoundary**: Catches React errors, displays fallback UI

### Routing

**Decision**: React Router v7 with programmatic navigation

- **Route protection**: `AuthGuard` component wraps protected routes
- **Public routes**: `/login`, `/register`
- **Protected routes**: `/tasks` (requires authentication)
- **Navigation**: Programmatic navigation via `useNavigate` hook
- **404 handling**: Default route redirects to `/tasks` if authenticated, `/login` otherwise

### Responsive Design

**Decision**: Mobile-first approach with separate layout components

- **Breakpoint**: 768px (tablet/desktop threshold)
- **Mobile Layout**: Bottom navigation, full-screen forms, simplified UI
- **Desktop Layout**: Side navigation, modal forms, richer information display
- **Detection**: `window.innerWidth` with resize listener (no CSS-only approach)
- **Why separate components**: Significantly different UX patterns justify separate implementations

### Error Handling Strategy

**Decision**: Multi-layer error handling

1. **React ErrorBoundary**: Catches component errors, prevents full app crash
2. **API Error Handling**: Centralized in `api.ts` interceptors
   - Transforms Axios errors to user-friendly messages
   - Handles network errors (ERR_CONNECTION_REFUSED)
   - Handles HTTP errors (4xx, 5xx) with appropriate status codes
3. **Form Validation**: Client-side validation before API calls
4. **Error Messages**: Transformed via `getErrorMessage` utility for consistency

## User Roles and Permissions

### Admin Users
- Can create tasks
- Can delete tasks
- Can update all task fields (title, description, dueDate, assignedTo, status)
- Can view all tasks

### Regular Users
- Cannot create tasks
- Cannot delete tasks
- Can update task status only
- Can view tasks assigned to them or created by them

## Task Status

Tasks have three possible statuses:

- TODO: Initial state, task not started
- DOING: Task in progress
- DONE: Task completed

Status transitions are cyclic: TODO → DOING → DONE → TODO

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Tasks
- `GET /tasks` - Get all user tasks (optional status filter)
- `POST /tasks` - Create new task (Admin only)
- `GET /tasks/:id` - Get single task
- `PATCH /tasks/:id` - Update task (status: any user, other fields: Admin only)
- `DELETE /tasks/:id` - Delete task (Admin only)

### Users
- `GET /users` - Get all users (for task assignment)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:3001` |
| `REACT_APP_API_TIMEOUT` | API request timeout (ms) | `10000` |

## Type Safety

**Decision**: Strict TypeScript with backend schema alignment

All components, hooks, and services are fully typed with TypeScript:

- **Type Definitions**: Centralized in `src/types/` directory
  - `Task.ts`: Task entity with all fields and relations
  - `User.ts`: User entity with role enum
  - `Auth.ts`: Authentication types (RegisterDto, LoginDto, AuthResponse)
- **Type Alignment**: Frontend types match backend Prisma schema
  - **Why**: Ensures type safety across full stack
  - **Maintenance**: Types should be updated when backend schema changes
- **Key Types**:
  - `Task`: `id`, `title`, `description`, `dueDate`, `status` ('TODO' | 'DOING' | 'DONE'), `userId`, `createdBy`, `assignedTo`, timestamps
  - `User`: `id`, `email`, `firstName`, `lastName`, `role` ('ADMIN' | 'USER')
  - `AuthResponse`: `access_token`, `user`
- **DTOs**: Separate types for API requests/responses
  - `CreateTaskDto`: Fields required for task creation
  - `UpdateTaskDto`: Partial fields for task updates
  - `RegisterDto`, `LoginDto`: Authentication payloads

**Technical Decision**: No code generation from backend schema (manual type maintenance)

## Error Handling

**Decision**: Centralized error handling with user-friendly messages

- **ErrorBoundary**: Catches React component errors and displays a fallback UI
  - **Implementation**: Class component with `componentDidCatch`
  - **Scope**: Catches errors in component tree, prevents full app crash
- **API Error Handling**: Centralized in `api.ts` interceptors
  - **Error Transformation**: `getErrorMessage` utility extracts user-friendly messages
  - **Network Errors**: Handles `ERR_CONNECTION_REFUSED` with appropriate message
  - **HTTP Errors**: Extracts status codes and messages from backend responses
  - **Error Format**: Backend uses NestJS format `{ message: string | string[] }`
- **Form Validation**: Client-side validation for all forms
  - **HTML5 Validation**: Native browser validation for basic checks
  - **Custom Validation**: Additional checks in form components
  - **Error Display**: Inline error messages below form fields
- **User-Friendly Messages**: Error messages transformed via `getErrorMessage`
  - **Why**: Backend errors may be technical, frontend shows user-friendly versions
  - **Implementation**: Handles arrays, nested objects, and various error formats

## Security Considerations

**Decision**: Client-side security with backend validation

- **JWT Storage**: Tokens stored in `localStorage`
  - **Why localStorage**: Simple, persists across sessions
  - **Security note**: XSS vulnerability if malicious scripts injected (mitigated by React's escaping)
  - **Alternative considered**: httpOnly cookies (requires backend changes)
- **Token Management**: 
  - Automatically added to requests via Axios interceptor
  - Cleared on 401 errors (token expired/invalid)
  - Cleared on explicit logout
- **Route Protection**: `AuthGuard` component protects routes
  - **Implementation**: Checks `isAuthenticated` from AuthContext
  - **Redirect**: Unauthenticated users redirected to `/login`
- **Input Validation**: Client-side validation on all forms
  - **Why client-side**: Better UX (immediate feedback)
  - **Important**: Backend validates all inputs (never trust client)
- **XSS Protection**: React's built-in escaping prevents XSS
  - All user input is escaped by default
  - No `dangerouslySetInnerHTML` used
- **CORS**: Handled by backend (configured in NestJS)
- **Role-Based Access Control (RBAC)**:
  - **UI Level**: Buttons and actions hidden for non-admin users
  - **API Level**: Backend enforces permissions (UI hiding is UX only)
  - **Roles**: `ADMIN` (full access), `USER` (limited access)

## Build and Deployment

1. Build for Production

   ```bash
   npm run build
   ```

   This creates an optimized production build in the `build/` directory.

2. Serve Production Build

   ```bash
   npm install -g serve
   serve -s build
   ```

## Troubleshooting

### Common Issues

1. API Connection Errors
   - Verify backend is running on port 3001
   - Check `REACT_APP_API_URL` in `.env` file
   - Check CORS settings in backend

2. Authentication Issues
   - Clear localStorage and try again
   - Check token expiration
   - Verify backend JWT configuration

3. Build Errors
   - Run `npm install` to ensure all dependencies are installed
   - Clear `node_modules` and reinstall if needed
   - Check TypeScript errors with `npm run build`

## Key Technical Decisions

### Why These Decisions Were Made

1. **Singleton API Client**
   - **Decision**: Single Axios instance with interceptors
   - **Rationale**: Ensures consistent token management and error handling across all API calls
   - **Alternative considered**: Multiple instances (rejected - unnecessary complexity)

2. **Context API over Redux**
   - **Decision**: React Context API for global state
   - **Rationale**: Simple state needs, no complex middleware, easier to understand
   - **Alternative considered**: Redux (rejected - overkill for current scope)

3. **Custom Hooks for Business Logic**
   - **Decision**: Encapsulate logic in custom hooks (useTasks, useAuth, useTaskForm)
   - **Rationale**: Reusable, testable, separates concerns from UI components
   - **Alternative considered**: Logic in components (rejected - harder to test and reuse)

4. **Separate Mobile/Desktop Layouts**
   - **Decision**: Different components for mobile vs desktop
   - **Rationale**: Significantly different UX patterns justify separate implementations
   - **Alternative considered**: Single responsive component (rejected - too complex conditionals)

5. **localStorage for Token Storage**
   - **Decision**: Store JWT tokens in localStorage
   - **Rationale**: Simple, persists across sessions, works with SPA architecture
   - **Security trade-off**: Vulnerable to XSS (mitigated by React's escaping)
   - **Alternative considered**: httpOnly cookies (rejected - requires backend changes)

6. **Manual Type Definitions**
   - **Decision**: Manually maintain TypeScript types aligned with backend
   - **Rationale**: Full control, no build-time dependencies
   - **Alternative considered**: Code generation from Prisma schema (rejected - added complexity)

7. **Tailwind CSS Utility-First**
   - **Decision**: Tailwind CSS for styling
   - **Rationale**: Rapid development, consistent design system, minimal custom CSS
   - **Alternative considered**: CSS Modules, Styled Components (rejected - Tailwind faster for this project)

8. **Axios over Fetch**
   - **Decision**: Axios for HTTP requests
   - **Rationale**: Built-in interceptors, better error handling, request/response transformation
   - **Alternative considered**: Fetch API (rejected - requires manual interceptor implementation)

9. **React Router v7**
   - **Decision**: React Router for client-side routing
   - **Rationale**: Industry standard, excellent TypeScript support, programmatic navigation
   - **Note**: Using latest version (v7.9.6) with modern API

10. **ErrorBoundary for Error Handling**
    - **Decision**: React ErrorBoundary component
    - **Rationale**: Prevents full app crash, provides fallback UI
    - **Scope**: Catches component errors, not async errors (handled separately)

## Development Guidelines

- **SOLID Principles**: Follow Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **TypeScript**: Use TypeScript for all new code, avoid `any` type
- **Component Design**: Write components with single responsibility
- **Custom Hooks**: Use custom hooks for reusable logic and business rules
- **React Hooks Rules**: Follow Rules of Hooks (no conditional hooks, only at top level)
- **Documentation**: Write JSDoc comments for public APIs and complex functions
- **Styling**: Use PayPros colors consistently (defined in `tailwind.config.js`)
- **Code Organization**: Group by feature, not by type (components, hooks, services together)
- **Error Handling**: Always handle errors, never silently fail
- **Performance**: Avoid premature optimization, use React.memo/useMemo/useCallback only when needed
