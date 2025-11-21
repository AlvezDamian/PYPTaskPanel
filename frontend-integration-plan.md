# Frontend Integration Plan - Full-Stack Todo App

## Overview

This plan outlines the modular integration of the React frontend with the NestJS backend, following SOLID principles and best practices. The plan is structured in phases to ensure incremental, testable progress.

## Current State Analysis

### Backend (Ready)
- **API Endpoints:**
  - `POST /auth/register` - User registration
  - `POST /auth/login` - User authentication
  - `GET /tasks` - List user tasks (with optional status filter)
  - `POST /tasks` - Create task
  - `GET /tasks/:id` - Get single task
  - `PATCH /tasks/:id` - Update task
  - `DELETE /tasks/:id` - Delete task

- **Task Model (Backend):**
  - `id: string` (UUID)
  - `title: string`
  - `description: string`
  - `dueDate: DateTime`
  - `status: 'PENDING' | 'COMPLETED'`
  - `userId: string`
  - `createdAt: DateTime`
  - `updatedAt: DateTime`

### Frontend (Current)
- **Task Type (Frontend - Needs Update):**
  - `id: string`
  - `title: string`
  - `description: string`
  - `status: 'todo' | 'in-progress' | 'done'` ❌ Should be `'pending' | 'completed'`
  - `priority: 'low' | 'medium' | 'high'` ❌ Not in backend, must remove
  - `createdAt: Date`
  - `updatedAt: Date`
  - Missing: `dueDate: Date` ✅ Must add

- **Components (Reusable):**
  - `MobileLayout.tsx`
  - `DesktopLayout.tsx`
  - `TaskCard.tsx` (needs update for new Task type)
  - `TaskSection.tsx`
  - `Header.tsx`
  - `NavigationTabs.tsx`
  - `BottomNavigation.tsx`
  - `NewTaskButton.tsx`

## Architecture Principles

### SOLID Principles Application

1. **Single Responsibility Principle (SRP)**
   - Each service handles one domain (auth, tasks)
   - Each component has a single purpose
   - Separation: API layer → Services → Hooks → Components

2. **Open/Closed Principle (OCP)**
   - Interfaces for API clients (easily mockable for tests)
   - Configurable components via props
   - Extensible without modifying existing code

3. **Liskov Substitution Principle (LSP)**
   - Consistent interfaces across components
   - Replaceable implementations (e.g., API client vs mock)

4. **Interface Segregation Principle (ISP)**
   - Separate interfaces for auth, tasks, API
   - Components only depend on what they need

5. **Dependency Inversion Principle (DIP)**
   - Depend on abstractions (interfaces), not concrete implementations
   - Services injectable via Context API

## Implementation Plan

### Phase 1: Project Restructuring

**Goal:** Organize codebase into monorepo structure with clear separation.

#### 1.1 Directory Restructuring
```
tasks-app/
├── backend/              # NestJS (existing)
├── frontend/            # React (move from root src/)
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── services/    # API layer (new)
│   │   ├── hooks/       # Custom hooks
│   │   ├── contexts/    # React contexts (new)
│   │   ├── types/       # TypeScript types
│   │   ├── lib/         # Utilities (new)
│   │   └── routes/      # Route config (new)
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
└── package.json         # Root workspace (optional)
```

**Tasks:**
- [ ] Create `frontend/` directory
- [ ] Move `src/` to `frontend/src/`
- [ ] Move `public/` to `frontend/public/`
- [ ] Move `tailwind.config.js` to `frontend/`
- [ ] Move `postcss.config.js` to `frontend/`
- [ ] Update `package.json` paths and scripts
- [ ] Update import paths in all components

**Files to Modify:**
- Create new directory structure
- Move existing files
- Update `package.json` scripts
- Update `tsconfig.json` paths if needed

---

### Phase 2: API Service Layer (SOLID: SRP, DIP)

**Goal:** Create a robust, type-safe API layer with proper separation of concerns.

#### 2.1 Core API Client
**File:** `frontend/src/services/api.ts`

**Responsibilities:**
- Axios instance configuration
- Request/response interceptors
- JWT token management
- Error handling and transformation
- Base URL configuration

**Interface:**
```typescript
interface ApiClient {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
}
```

**Features:**
- Base URL from environment variable
- Request interceptor: Add JWT token to headers
- Response interceptor: Handle 401 (logout), transform errors
- Token storage in localStorage
- Automatic token refresh logic (if needed)

#### 2.2 Auth Service
**File:** `frontend/src/services/auth.service.ts`

**Responsibilities:**
- User registration
- User login
- Token management
- Logout functionality

**Interface:**
```typescript
interface AuthService {
  register(email: string, password: string): Promise<AuthResponse>;
  login(email: string, password: string): Promise<AuthResponse>;
  logout(): void;
  getToken(): string | null;
  isAuthenticated(): boolean;
}
```

**Types:**
```typescript
interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
  };
}

interface RegisterDto {
  email: string;
  password: string;
}

interface LoginDto {
  email: string;
  password: string;
}
```

#### 2.3 Tasks Service
**File:** `frontend/src/services/tasks.service.ts`

**Responsibilities:**
- CRUD operations for tasks
- Type-safe API calls
- Error handling

**Interface:**
```typescript
interface TasksService {
  getAll(status?: TaskStatus): Promise<Task[]>;
  getById(id: string): Promise<Task>;
  create(task: CreateTaskDto): Promise<Task>;
  update(id: string, task: UpdateTaskDto): Promise<Task>;
  delete(id: string): Promise<void>;
}
```

**Types:**
```typescript
type TaskStatus = 'PENDING' | 'COMPLETED';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO date string
  status: TaskStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateTaskDto {
  title: string;
  description: string;
  dueDate: string; // ISO date string
  status?: TaskStatus;
}

interface UpdateTaskDto {
  title?: string;
  description?: string;
  dueDate?: string;
  status?: TaskStatus;
}
```

**Tasks:**
- [ ] Create `services/api.ts` with Axios instance and interceptors
- [ ] Create `services/auth.service.ts` with auth operations
- [ ] Create `services/tasks.service.ts` with CRUD operations
- [ ] Create `services/index.ts` for barrel exports
- [ ] Add error handling utilities in `lib/errors.ts`

**Dependencies to Add:**
```json
{
  "axios": "^1.6.0"
}
```

---

### Phase 3: Type System Updates

**Goal:** Align frontend types with backend schema.

#### 3.1 Update Task Types
**File:** `frontend/src/types/Task.ts`

**Changes:**
- Remove `priority` field
- Change `status` from `'todo' | 'in-progress' | 'done'` to `'PENDING' | 'COMPLETED'`
- Add `dueDate: string` (ISO date string)
- Add `userId: string`
- Keep `createdAt` and `updatedAt` as strings (from API)

**New Task Interface:**
```typescript
export type TaskStatus = 'PENDING' | 'COMPLETED';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO date string from backend
  status: TaskStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// DTOs for API calls
export interface CreateTaskDto {
  title: string;
  description: string;
  dueDate: string; // ISO date string
  status?: TaskStatus;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  dueDate?: string;
  status?: TaskStatus;
}
```

#### 3.2 Create Auth Types
**File:** `frontend/src/types/Auth.ts`

```typescript
export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface RegisterDto {
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}
```

#### 3.3 Create User Types
**File:** `frontend/src/types/User.ts`

```typescript
export interface User {
  id: string;
  email: string;
}
```

**Tasks:**
- [ ] Update `types/Task.ts` with new schema
- [ ] Create `types/Auth.ts` with auth-related types
- [ ] Create `types/User.ts` with user types
- [ ] Create `types/index.ts` for barrel exports
- [ ] Update all components using old Task type

---

### Phase 4: State Management (SOLID: DIP, SRP)

**Goal:** Implement centralized state management for auth and tasks using React Context.

#### 4.1 Auth Context
**File:** `frontend/src/contexts/AuthContext.tsx`

**Responsibilities:**
- Authentication state (user, token, isAuthenticated)
- Auth operations (login, register, logout)
- Token persistence
- Initialization from localStorage

**Interface:**
```typescript
interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
```

**Features:**
- Initialize auth state from localStorage on mount
- Provide auth state to all components
- Handle auth errors gracefully

#### 4.2 Tasks Context (Optional - can use hooks instead)
**File:** `frontend/src/contexts/TasksContext.tsx`

**Alternative:** Use `useTasks` hook with API calls (simpler approach)

**Responsibilities:**
- Tasks list state
- Loading and error states
- Task operations (CRUD)

**Tasks:**
- [ ] Create `contexts/AuthContext.tsx` with auth state management
- [ ] Create `contexts/AuthProvider.tsx` component
- [ ] Create `hooks/useAuth.ts` for consuming auth context
- [ ] Update `App.tsx` to wrap with `AuthProvider`

---

### Phase 5: Custom Hooks (SOLID: SRP)

**Goal:** Create reusable hooks that encapsulate business logic.

#### 5.1 Update useTasks Hook
**File:** `frontend/src/hooks/useTasks.ts`

**Changes:**
- Replace local state with API calls
- Use `tasksService` for all operations
- Handle loading and error states
- Support status filtering

**New Interface:**
```typescript
interface UseTasksReturn {
  tasks: Task[];
  isLoading: boolean;
  error: Error | null;
  createTask: (task: CreateTaskDto) => Promise<void>;
  updateTask: (id: string, task: UpdateTaskDto) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
  getTasksByStatus: (status: TaskStatus) => Task[];
}
```

**Features:**
- Fetch tasks on mount
- Optimistic updates (optional)
- Error handling
- Loading states

#### 5.2 Create useAuth Hook
**File:** `frontend/src/hooks/useAuth.ts`

**Responsibilities:**
- Consume AuthContext
- Provide convenient auth methods
- Type-safe auth state access

#### 5.3 Create useTaskForm Hook
**File:** `frontend/src/hooks/useTaskForm.ts`

**Responsibilities:**
- Form state management for create/edit
- Validation
- Submit handling

**Tasks:**
- [ ] Refactor `hooks/useTasks.ts` to use API
- [ ] Create `hooks/useAuth.ts`
- [ ] Create `hooks/useTaskForm.ts` for form handling
- [ ] Create `hooks/index.ts` for barrel exports

---

### Phase 6: Authentication UI (SOLID: SRP, OCP)

**Goal:** Create authentication forms and protected route components.

#### 6.1 Login Form Component
**File:** `frontend/src/components/auth/LoginForm.tsx`

**Features:**
- Email and password inputs
- Form validation (email format, required fields)
- Error display
- Loading state during submission
- Submit calls `authService.login()`
- Redirect to tasks on success

#### 6.2 Register Form Component
**File:** `frontend/src/components/auth/RegisterForm.tsx`

**Features:**
- Email and password inputs
- Password confirmation
- Form validation (email, min password length, matching passwords)
- Error display
- Loading state
- Submit calls `authService.register()`
- Auto-login and redirect on success

#### 6.3 Auth Guard Component
**File:** `frontend/src/components/auth/AuthGuard.tsx`

**Features:**
- Protect routes requiring authentication
- Redirect to login if not authenticated
- Show loading spinner during auth check
- Accept children to render when authenticated

**Usage:**
```tsx
<AuthGuard>
  <ProtectedComponent />
</AuthGuard>
```

**Tasks:**
- [ ] Create `components/auth/LoginForm.tsx`
- [ ] Create `components/auth/RegisterForm.tsx`
- [ ] Create `components/auth/AuthGuard.tsx`
- [ ] Add form validation utilities in `lib/validation.ts`
- [ ] Style forms with Tailwind and PayPros colors

---

### Phase 7: Routing Setup

**Goal:** Implement client-side routing with protected routes.

#### 7.1 Install React Router
```bash
npm install react-router-dom
npm install --save-dev @types/react-router-dom
```

#### 7.2 Route Configuration
**File:** `frontend/src/routes/index.tsx`

**Routes:**
- `/login` - Login page (public)
- `/register` - Register page (public)
- `/tasks` - Tasks list (protected)
- `/` - Redirect to `/tasks` if authenticated, else `/login`

**Structure:**
```tsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/tasks" element={
    <AuthGuard>
      <TasksPage />
    </AuthGuard>
  } />
  <Route path="/" element={<Navigate to="/tasks" />} />
</Routes>
```

#### 7.3 Page Components
- `pages/LoginPage.tsx` - Wrapper for LoginForm
- `pages/RegisterPage.tsx` - Wrapper for RegisterForm
- `pages/TasksPage.tsx` - Main tasks page (reuses existing layouts)

**Tasks:**
- [ ] Install `react-router-dom`
- [ ] Create `routes/index.tsx` with route configuration
- [ ] Create `pages/LoginPage.tsx`
- [ ] Create `pages/RegisterPage.tsx`
- [ ] Create `pages/TasksPage.tsx`
- [ ] Update `App.tsx` to use Router
- [ ] Implement redirect logic after login/register

---

### Phase 8: Component Updates

**Goal:** Update existing components to work with new API and types.

#### 8.1 Update TaskCard Component
**File:** `frontend/src/components/TaskCard.tsx`

**Changes:**
- Remove `priority` field display
- Update `status` to use `'PENDING' | 'COMPLETED'`
- Add `dueDate` display
- Update checkbox to toggle between PENDING/COMPLETED
- Apply PayPros color scheme

**New Props:**
```typescript
interface TaskCardProps {
  task: Task; // Updated Task type
  onToggleComplete: (taskId: string) => Promise<void>; // Now async
  onTaskClick: (taskId: string) => void;
}
```

#### 8.2 Create TaskForm Component
**File:** `frontend/src/components/TaskForm.tsx`

**Features:**
- Modal/drawer form for creating/editing tasks
- Fields: title, description, dueDate (date picker)
- Validation
- Submit handler for create/update
- Close handler

**Usage:**
```tsx
<TaskForm
  isOpen={isOpen}
  onClose={handleClose}
  task={task} // undefined for create, Task for edit
  onSubmit={handleSubmit}
/>
```

#### 8.3 Update TaskSection Component
**File:** `frontend/src/components/TaskSection.tsx`

**Changes:**
- Filter by `'PENDING' | 'COMPLETED'` instead of old statuses
- Update to work with new Task type
- Apply PayPros colors

#### 8.4 Update Layout Components
**Files:** `MobileLayout.tsx`, `DesktopLayout.tsx`

**Changes:**
- Integrate with `useTasks` hook (now uses API)
- Update prop types
- Add logout button in header
- Apply PayPros color scheme

**Tasks:**
- [ ] Update `components/TaskCard.tsx` (remove priority, add dueDate, update status)
- [ ] Create `components/TaskForm.tsx` for create/edit
- [ ] Update `components/TaskSection.tsx` (status filter)
- [ ] Update `components/Header.tsx` (add logout button)
- [ ] Update `components/MobileLayout.tsx` and `DesktopLayout.tsx`
- [ ] Update `components/NewTaskButton.tsx` to open TaskForm

---

### Phase 9: PayPros Color Scheme Integration

**Goal:** Apply PayPros brand colors throughout the application.

#### 9.1 Update Tailwind Config
**File:** `frontend/tailwind.config.js`

**Colors:**
```javascript
colors: {
  paypros: {
    primary: '#7F25D9',    // Main purple
    secondary: '#340F59',  // Dark purple
    dark: '#160726',       // Very dark purple
    accent: '#401C8C',     // Accent purple
  }
}
```

#### 9.2 Update CSS Variables (Optional)
**File:** `frontend/src/index.css`

```css
:root {
  --paypros-primary: #7F25D9;
  --paypros-secondary: #340F59;
  --paypros-dark: #160726;
  --paypros-accent: #401C8C;
}
```

#### 9.3 Apply Colors to Components
- **Primary buttons:** `bg-paypros-primary`
- **Secondary buttons:** `bg-paypros-secondary`
- **Backgrounds:** `bg-paypros-dark` or `bg-paypros-secondary`
- **Accents/highlights:** `bg-paypros-accent`
- **Text on dark:** `text-white` or `text-gray-100`
- **Links:** `text-paypros-primary`

**Tasks:**
- [ ] Update `tailwind.config.js` with PayPros colors
- [ ] Update `index.css` with CSS variables (optional)
- [ ] Update all components to use PayPros colors
- [ ] Create color utility classes if needed

---

### Phase 10: Environment Configuration

**Goal:** Set up environment variables for API configuration.

#### 10.1 Create Environment Files
**Files:**
- `frontend/.env.example`
- `frontend/.env` (gitignored)

**Variables:**
```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_API_TIMEOUT=10000
```

#### 10.2 Update API Client
**File:** `frontend/src/services/api.ts`

- Use `process.env.REACT_APP_API_URL` for base URL
- Use environment variable for timeout

**Tasks:**
- [ ] Create `frontend/.env.example`
- [ ] Create `frontend/.env` (add to .gitignore)
- [ ] Update `services/api.ts` to use environment variables
- [ ] Document environment setup in README

---

### Phase 11: Error Handling & Loading States

**Goal:** Implement consistent error handling and loading indicators.

#### 11.1 Error Handling
- Create error boundary component
- Display user-friendly error messages
- Handle API errors gracefully (401, 404, 500)
- Log errors for debugging

#### 11.2 Loading States
- Show loading spinners during API calls
- Disable buttons during submission
- Skeleton loaders for task lists (optional)

**Tasks:**
- [ ] Create `components/ErrorBoundary.tsx`
- [ ] Create `components/LoadingSpinner.tsx`
- [ ] Add error handling to all API calls
- [ ] Add loading states to forms and lists
- [ ] Create error display component

---

### Phase 12: Testing & Quality Assurance

**Goal:** Ensure code quality and functionality.

#### 12.1 Type Safety
- Run TypeScript compiler
- Fix all type errors
- Ensure strict mode enabled

#### 12.2 Linting
- Run ESLint
- Fix all linting errors
- Ensure React Hooks rules are followed

#### 12.3 Manual Testing
- Test authentication flow (register, login, logout)
- Test CRUD operations for tasks
- Test protected routes
- Test error scenarios
- Test responsive design (mobile/desktop)

**Tasks:**
- [ ] Run `npm run build` and fix errors
- [ ] Run ESLint and fix issues
- [ ] Test all user flows
- [ ] Test on mobile and desktop
- [ ] Verify PayPros colors are applied correctly

---

### Phase 13: Documentation

**Goal:** Document the frontend implementation.

#### 13.1 Update README
**File:** `frontend/README.md`

**Sections:**
- Setup instructions
- Environment variables
- Available scripts
- Architecture overview
- API integration details
- Component structure

#### 13.2 Code Documentation
- Add JSDoc comments to services
- Document complex hooks
- Add inline comments where needed (in English)

**Tasks:**
- [ ] Create/update `frontend/README.md`
- [ ] Add JSDoc to service files
- [ ] Document hook usage
- [ ] Update root `README.md` with full-stack setup

---

## File Structure (Final)

```
tasks-app/
├── backend/                    # NestJS backend
│   └── ...
├── frontend/                   # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── AuthGuard.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   ├── TaskSection.tsx
│   │   │   ├── MobileLayout.tsx
│   │   │   ├── DesktopLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── NavigationTabs.tsx
│   │   │   ├── BottomNavigation.tsx
│   │   │   └── NewTaskButton.tsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx
│   │   │   └── AuthProvider.tsx
│   │   ├── hooks/
│   │   │   ├── useTasks.ts
│   │   │   ├── useAuth.ts
│   │   │   └── useTaskForm.ts
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── TasksPage.tsx
│   │   ├── routes/
│   │   │   └── index.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── auth.service.ts
│   │   │   └── tasks.service.ts
│   │   ├── types/
│   │   │   ├── Task.ts
│   │   │   ├── Auth.ts
│   │   │   └── User.ts
│   │   ├── lib/
│   │   │   ├── errors.ts
│   │   │   └── validation.ts
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
└── README.md
```

## Dependencies to Add

```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "react-router-dom": "^6.20.0"
  },
  "devDependencies": {
    "@types/react-router-dom": "^5.3.3"
  }
}
```

## Implementation Order

1. **Phase 1:** Project restructuring (move files, update paths)
2. **Phase 2:** API service layer (foundation for all API calls)
3. **Phase 3:** Type system updates (align with backend)
4. **Phase 4:** State management (auth context)
5. **Phase 5:** Custom hooks (useTasks, useAuth)
6. **Phase 6:** Authentication UI (forms, guards)
7. **Phase 7:** Routing setup (protected routes)
8. **Phase 8:** Component updates (TaskCard, TaskForm, etc.)
9. **Phase 9:** PayPros color scheme
10. **Phase 10:** Environment configuration
11. **Phase 11:** Error handling & loading states
12. **Phase 12:** Testing & QA
13. **Phase 13:** Documentation

## Success Criteria

✅ All backend endpoints are integrated
✅ Authentication flow works (register → login → protected routes)
✅ CRUD operations for tasks work correctly
✅ Type safety maintained throughout
✅ PayPros colors applied consistently
✅ Responsive design works on mobile and desktop
✅ Error handling is user-friendly
✅ Code follows SOLID principles
✅ All components are modular and reusable
✅ Documentation is complete

## Notes

- **SOLID Compliance:**
  - Services follow SRP (one responsibility each)
  - Components are open for extension, closed for modification
  - Interfaces allow substitution (mockable for tests)
  - Dependencies are inverted (components depend on abstractions)

- **Security Considerations:**
  - JWT tokens stored in localStorage (consider httpOnly cookies for production)
  - API calls include token in Authorization header
  - Protected routes check authentication
  - Input validation on forms

- **Performance:**
  - Consider optimistic updates for better UX
  - Implement pagination if task list grows large
  - Add caching for frequently accessed data (optional)

- **Future Enhancements:**
  - Task search/filter
  - Task categories/tags
  - Drag-and-drop task reordering
  - Task reminders/notifications
  - Task sharing between users

