# TaskPanel - Full-Stack Task Management Application

A full-stack task management application built with React (frontend) and NestJS (backend), featuring JWT authentication, role-based access control, and MySQL database with Prisma ORM.

## Project Structure

```
tasks-app/
├── backend/          # NestJS backend API
│   ├── src/
│   │   ├── auth/     # Authentication module (JWT)
│   │   ├── tasks/    # Tasks CRUD module
│   │   ├── prisma/   # Prisma service
│   │   └── common/   # Shared utilities
│   ├── prisma/
│   │   └── schema.prisma
│   └── README.md     # Backend documentation
├── frontend/         # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── hooks/       # Custom hooks
│   │   ├── services/    # API services
│   │   ├── contexts/    # React contexts
│   │   ├── pages/       # Page components
│   │   ├── routes/      # Route configuration
│   │   └── types/       # TypeScript types
│   └── README.md        # Frontend documentation
└── README.md         # This file
```

## Architecture Overview

### Backend (NestJS)
- **Modular Architecture**: Each feature in its own module (Auth, Tasks, Users)
- **SOLID Principles**: Single responsibility, dependency injection, interface segregation
- **JWT Authentication**: Stateless authentication with secure token management
- **Role-Based Access Control**: Admin and User roles with different permissions
- **Prisma ORM**: Type-safe database access with MySQL
- **DTO Validation**: Request validation using class-validator
- **User Scoping**: Tasks are automatically scoped to authenticated users

### Frontend (React + TypeScript)
- **Component-Based**: Reusable UI components following SOLID principles
- **Type Safety**: Full TypeScript implementation aligned with backend schema
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **State Management**: React hooks and context API (AuthContext)
- **API Integration**: Type-safe API services with Axios
- **PayPros Colors**: Custom brand color scheme integrated throughout

## Technology Stack

### Backend
- Node.js 20.19.5 (LTS) - See [Version Requirements](#version-requirements) below
- NestJS 11.1.9
- Prisma ORM 6.19.0 - See [Version Requirements](#version-requirements) below
- MySQL 8.0+
- JWT (passport-jwt)
- bcrypt
- class-validator

### Frontend
- React 19.2.0
- TypeScript 4.9.5
- Tailwind CSS 3.4.18
- React Router 6.20.0
- Axios 1.6.0

## Version Requirements

### Node.js Version Decision

**Current Version: Node.js 20.19.5 (LTS)**

This project uses **Node.js 20 LTS** (minimum 20.19.0) instead of Node.js 24 for the following reasons:

1. **Prisma Compatibility**: Prisma 6.x officially supports Node.js 18.18.0+, 20.x, and 22.x. Node.js 24 is not yet officially supported in Prisma's compatibility matrix.

2. **Stability**: Node.js 20 LTS provides long-term support and is the recommended version for production environments.

3. **Known Issues**: Node.js 24 with Prisma 7.0.0 exhibits a `__internal` initialization error (`TypeError: Cannot read properties of undefined (reading '__internal')`), which was resolved by using Node.js 20 with Prisma 6.19.0.

**Recommendation**: Use Node.js 20.x LTS for development and production. If you need to switch Node versions, use `nvm`:
```bash
nvm install 20
nvm use 20
```

Or on macOS with Homebrew:
```bash
brew install node@20
export PATH="/opt/homebrew/opt/node@20/bin:$PATH"
```

### Prisma Version Decision

**Current Version: Prisma 6.19.0**

This project uses **Prisma 6.19.0** (latest stable 6.x) instead of Prisma 7.0.0 for the following reasons:

1. **Node.js Compatibility**: Prisma 7.0.0 requires Node.js 20.19.0+ (recommended Node.js 22.x), but has known compatibility issues with Node.js 24.

2. **Stability**: Prisma 6.19.0 is a mature, battle-tested version with full support for Node.js 20 LTS.

3. **Production Readiness**: Prisma 6.x is widely used in production environments and has extensive community support.

4. **Migration Path**: When Prisma officially supports Node.js 24, we can upgrade to Prisma 7.x following the official migration guide.

**Prisma 6 vs 7 Differences**:
- Prisma 6 uses `schema.prisma` with `url = env("DATABASE_URL")` directly in the datasource block
- Prisma 7 introduced `prisma.config.ts` (not used in this project for compatibility)

**To verify Prisma version**:
```bash
cd backend
npx prisma -v
```

**To regenerate Prisma Client** (after schema changes):
```bash
cd backend
npx prisma generate
```

## Quick Start

### Prerequisites

- **Node.js 20.19.0+ (LTS)** - Required. See [Version Requirements](#version-requirements) for details.
- MySQL 8.0 or higher
- npm or yarn

**Important**: This project requires Node.js 20 LTS. Node.js 24 is not supported due to Prisma compatibility issues.

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in `backend/` directory:
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/tasks_db"
   JWT_SECRET="your-secret-key-change-in-production"
   JWT_EXPIRES_IN="7d"
   PORT=3001
   FRONTEND_URL="http://localhost:3000"
   ```

4. Create MySQL database:
   ```sql
   CREATE DATABASE tasks_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

5. Run migrations:
   ```bash
   npm run prisma:migrate
   ```

6. Start development server:
   ```bash
   # Ensure you're using Node.js 20
   node -v  # Should show v20.x.x
   
   npm run start:dev
   ```

   The backend API will be available at `http://localhost:3001`

   **Note**: If you see Prisma `__internal` errors, ensure you're using Node.js 20 LTS. See [Version Requirements](#version-requirements) for troubleshooting.

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in `frontend/` directory:
   ```env
   REACT_APP_API_URL=http://localhost:3001
   REACT_APP_API_TIMEOUT=10000
   ```

   Use `.env.example` as a template.

4. Start development server:
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## Running Both Services

To run both backend and frontend simultaneously:

### Terminal 1 - Backend:
```bash
cd backend
npm run start:dev
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

## API Documentation

See [backend/README.md](./backend/README.md) for complete API documentation.

### Key Endpoints

#### Authentication (Public)
- `POST /auth/register` - Register new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- `POST /auth/login` - Login user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

#### Tasks (Protected - Requires JWT Token)
- `GET /tasks` - Get all tasks (optional `?status=TODO` or `?status=DOING` or `?status=DONE` filter)
- `POST /tasks` - Create task (Admin only)
  ```json
  {
    "title": "Task title",
    "description": "Task description",
    "dueDate": "2024-12-31T00:00:00.000Z",
    "status": "TODO",
    "assignedTo": "user-uuid"
  }
  ```
- `GET /tasks/:id` - Get single task
- `PATCH /tasks/:id` - Update task (status: any user, other fields: Admin only)
- `DELETE /tasks/:id` - Delete task (Admin only)

#### Users (Protected - Requires JWT Token)
- `GET /users` - Get all users (for task assignment)
- `GET /users/:id` - Get single user

## Database Schema

### User
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password` (String, Hashed with bcrypt)
- `firstName` (String, Optional)
- `lastName` (String, Optional)
- `role` (Enum: ADMIN | USER, Default: USER)
- `createdAt`, `updatedAt` (DateTime)

### Task
- `id` (UUID, Primary Key)
- `title` (String)
- `description` (String)
- `dueDate` (DateTime)
- `status` (Enum: TODO | DOING | DONE, Default: TODO)
- `userId` (UUID, Foreign Key to User - task owner)
- `createdById` (UUID, Foreign Key to User - task creator)
- `assignedToId` (UUID, Foreign Key to User, Optional - task assignee)
- `createdAt`, `updatedAt` (DateTime)

## Security Features

### Backend
- Password hashing with bcrypt (10 rounds)
- JWT token-based authentication
- Role-based access control (Admin and User roles)
- User-scoped data access (users can only access their own tasks)
- Input validation and sanitization (class-validator)
- CORS configuration
- SQL injection prevention (Prisma prepared statements)
- Error handling with exception filters
- Guards for role-based route protection

### Frontend
- JWT token storage in localStorage
- Protected routes using AuthGuard component
- Role-based UI elements (buttons and actions hidden for non-admin users)
- Input validation on all forms
- XSS protection via React's built-in escaping
- Error boundaries for graceful error handling
- Type-safe API calls

## Development

### Backend Scripts
- `npm run start:dev` - Start with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:generate` - Generate Prisma Client
- `npm run lint` - Run ESLint

### Frontend Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint (via react-scripts)

## PayPros Color Scheme

The frontend uses PayPros brand colors:

- **Primary**: `#7F25D9` - Main purple
- **Secondary**: `#340F59` - Dark purple
- **Dark**: `#160726` - Very dark purple
- **Accent**: `#401C8C` - Accent purple

Colors are integrated throughout the UI via Tailwind CSS classes.

## Project Architecture Principles

This project follows SOLID principles:

1. **Single Responsibility Principle (SRP)**: Each service, component, and hook has a single responsibility
2. **Open/Closed Principle (OCP)**: Components are open for extension, closed for modification
3. **Liskov Substitution Principle (LSP)**: Consistent interfaces across components
4. **Interface Segregation Principle (ISP)**: Separate interfaces for auth, tasks, API
5. **Dependency Inversion Principle (DIP)**: Dependencies on abstractions, services injectable via Context API

## Testing

### Backend Testing
Run backend tests:
```bash
cd backend
npm test
```

### Frontend Testing
Run frontend tests:
```bash
cd frontend
npm test
```

## Build and Deployment

### Backend Production Build
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend Production Build
```bash
cd frontend
npm run build
```

The production build will be in `frontend/build/` directory and can be served with any static file server.

## Documentation

- [Backend Documentation](./backend/README.md) - Detailed backend API documentation
- [Frontend Documentation](./frontend/README.md) - Frontend architecture and setup

## Troubleshooting

### Backend Issues
- **Database Connection Error**: Verify MySQL is running and DATABASE_URL is correct
- **Port Already in Use**: Change PORT in `.env` or stop the process using port 3001
- **Migration Errors**: Run `npm run prisma:generate` before migrations

### Frontend Issues
- **API Connection Error (ERR_CONNECTION_REFUSED)**: 
  - **Causa**: El backend no está corriendo o no es accesible en el puerto configurado
  - **Solución**: 
    1. Verificar que el backend esté corriendo: `cd backend && npm run start:dev`
    2. Verificar que el backend esté escuchando en el puerto correcto (por defecto 3001)
    3. Verificar la variable de entorno `REACT_APP_API_URL` en el frontend (por defecto `http://localhost:3001`)
    4. Asegurar que no haya firewall bloqueando la conexión
  - **Archivos afectados**: 
    - `frontend/src/services/api.ts` - Cliente API (línea 12: baseURL por defecto)
    - `backend/src/main.ts` - Configuración del servidor (línea 29: puerto por defecto)
- **Authentication Issues**: Clear localStorage and try again
- **Build Errors**: Ensure all dependencies are installed with `npm install`

## Development Notes

### Learning Journey

This project challenge my to hands-on experience with several key technologies that i dont use often like: Prisma ORM , NestJS, and Jest. While this learning curve presented its challenges, it also provided valuable insights into modern full-stack development practices.

One of the most significant challenges encountered was finding a stable version combination between **Node.js** and **Prisma**. Initially, we attempted to use Node.js 24 with Prisma 7.0.0, which resulted in a persistent `__internal` initialization error. Through careful research and testing, we discovered that Prisma 7.0.0 requires Node.js 20.19.0+ (with Node.js 22.x being recommended), and Node.js 24 is not yet officially supported in Prisma's compatibility matrix.

The solution was to adopt a more conservative, production-ready approach: **Node.js 20.19.5 (LTS)** with **Prisma 6.19.0** (latest stable 6.x). This combination provides excellent stability, full compatibility, and aligns with industry best practices for production deployments. While it meant stepping back from the latest versions, it ensured a reliable foundation for the application.

This experience reinforced the importance of version compatibility research and choosing stability over cutting-edge features when building production applications. The detailed version requirements and rationale are documented in the [Version Requirements](#version-requirements) section above.

### Features Considered but Not Implemented (Time Constraints)

During the development process, several valuable features were identified and designed but ultimately not implemented due to time constraints. These represent good ideas that would enhance the application's functionality and user experience:

1. **Overdue Task Alerts**: Visual indicators and notifications when tasks pass their due dates, helping users stay on top of deadlines.

2. **Past Date Validation**: Prevent users from creating tasks with dates in the past, ensuring data integrity and logical task management.

3. **Multi-Admin User Management**: Allow admin users to create new users and assign roles/permissions, rather than having a single hardcoded admin user. This would enable proper user lifecycle management.

4. **Task Projects/Grouping**: Organize tasks into projects or categories, allowing users to group related tasks together and manage them as cohesive units.

5. **Calendar View**: Display tasks in a calendar format, showing tasks organized by their due dates for better visual planning and scheduling.

6. **User Profile Section**: A dedicated profile page where users can update their information, change passwords, and view their activity history.

7. **Task Metrics & Analytics**: 
   - Track task completion rates and quantities
   - Quality metrics for task resolutions
   - Difficulty ratings for tasks
   - Performance dashboards for users and teams

These features remain on the roadmap for future iterations and would significantly enhance the application's value proposition.

## Future Enhancements

- Task search and filtering
- Task categories/tags
- Drag-and-drop task reordering
- Task reminders/notifications
- Task sharing between users
- Offline support with service workers
- Real-time updates with WebSockets
- Task attachments
- Task comments

## License

This project is created for demonstration purposes.
