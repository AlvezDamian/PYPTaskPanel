# Backend API - TaskPanel

NestJS backend application for TaskPanel with JWT authentication, role-based access control, and MySQL database using Prisma ORM.

## Architecture

The backend follows a modular architecture following SOLID principles:

- **Auth Module**: Handles user registration, login, and JWT token management
- **Tasks Module**: Provides CRUD operations for tasks with role-based permissions
- **Users Module**: Provides user listing for task assignment
- **Prisma Module**: Database service and connection management
- **Common Module**: Shared utilities (decorators, interceptors, filters, guards)

## Technology Stack

- **NestJS**: Progressive Node.js framework
- **Prisma**: Next-generation ORM for type-safe database access
- **MySQL**: Relational database
- **JWT**: Stateless authentication
- **bcrypt**: Password hashing
- **class-validator**: DTO validation

## Prerequisites

- **Node.js 20.19.0+ (LTS)** - Required. See main README for version requirements.
- MySQL database (v8.0 or higher)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/tasks_db"

# JWT
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

**Important**: Replace `user`, `password`, and `tasks_db` with your actual MySQL credentials and database name.

### 3. Database Setup

Create the MySQL database:

```sql
CREATE DATABASE tasks_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Run Migrations

```bash
npm run prisma:migrate
```

This will:
- Create the database schema (User and Task tables)
- Generate the Prisma Client

### 5. Generate Prisma Client

If you need to regenerate the Prisma Client:

```bash
npm run prisma:generate
```

### 6. Start the Development Server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "accessToken": "jwt-token-here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as register

### Tasks (Protected - Requires JWT)

All task endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

#### Get All Tasks
```
GET /tasks?status=TODO
```

Query parameters:
- `status` (optional): Filter by status (`TODO`, `DOING`, or `DONE`)

#### Get Single Task
```
GET /tasks/:id
```

#### Create Task (Admin only)
```
POST /tasks
Content-Type: application/json

{
  "title": "Task title",
  "description": "Task description",
  "dueDate": "2024-12-31T23:59:59.000Z",
  "status": "TODO",
  "assignedTo": "user-uuid"
}
```

#### Update Task
```
PATCH /tasks/:id
Content-Type: application/json

{
  "title": "Updated title", // optional, Admin only
  "description": "Updated description", // optional, Admin only
  "dueDate": "2024-12-31T23:59:59.000Z", // optional, Admin only
  "status": "DOING", // optional, any user can update
  "assignedTo": "user-uuid" // optional, Admin only
}
```

**Note**: Regular users can only update the `status` field. Admin users can update all fields.

#### Delete Task (Admin only)
```
DELETE /tasks/:id
```

### Users (Protected - Requires JWT)

#### Get All Users
```
GET /users
```

Returns list of users (id, email, firstName, lastName, role) for task assignment.

#### Get Single User
```
GET /users/:id
```

## Database Schema

### User Model
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `password`: String (Hashed)
- `firstName`: String (Optional)
- `lastName`: String (Optional)
- `role`: Enum (`ADMIN` | `USER`, Default: `USER`)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Task Model
- `id`: UUID (Primary Key)
- `title`: String
- `description`: String
- `dueDate`: DateTime
- `status`: Enum (`TODO` | `DOING` | `DONE`, Default: `TODO`)
- `userId`: UUID (Foreign Key to User - task owner)
- `createdById`: UUID (Foreign Key to User - task creator)
- `assignedToId`: UUID (Foreign Key to User, Optional - task assignee)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## Security Features

1. **Password Hashing**: Passwords are hashed using bcrypt (10 rounds)
2. **JWT Authentication**: Stateless authentication with configurable expiration
3. **Role-Based Access Control**: Admin and User roles with different permissions
4. **User Scoping**: Users can only access their own tasks
5. **Input Validation**: All inputs are validated using DTOs with class-validator
6. **CORS**: Configured to allow requests from frontend origin only
7. **Guards**: Role-based route protection using RolesGuard and JwtAuthGuard

## Available Scripts

- `npm run build`: Build the application
- `npm run start`: Start the production server
- `npm run start:dev`: Start the development server with hot reload
- `npm run start:debug`: Start in debug mode
- `npm run lint`: Run ESLint
- `npm run prisma:generate`: Generate Prisma Client
- `npm run prisma:migrate`: Run database migrations
- `npm run prisma:studio`: Open Prisma Studio (database GUI)

## Error Handling

The API uses a global exception filter that returns consistent error responses:

```json
{
  "statusCode": 400,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "message": "Error message"
}
```

## Role-Based Permissions

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

## Development Notes

- The application uses Prisma 6.19.0 with `schema.prisma` configuration
- All routes except `/auth/register` and `/auth/login` are protected by JWT authentication
- Task creation and deletion require Admin role
- Task updates have role-based field restrictions
- Tasks are automatically scoped to the authenticated user
- The Prisma Client is generated automatically on `npm install` via a postinstall script

