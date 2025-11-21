# Backend Tests Documentation

This directory contains all unit tests for the backend API. The tests verify that the code is functioning correctly and document expected results and justifications for each test case.

## Structure

```
test/
├── unit/           # Unit tests for services and controllers
│   ├── auth/       # Authentication module tests
│   ├── tasks/      # Tasks module tests
│   └── common/     # Shared utilities tests
├── e2e/            # End-to-end tests (optional)
├── fixtures/       # Test data fixtures
├── utils/          # Test utilities and helpers
└── README.md       # This file
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- auth.service.spec.ts
```

## Test Coverage Goals

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## Test Suites

### Auth Module Tests

#### auth.service.spec.ts

**Purpose**: Tests authentication service logic including registration, login, and user validation.

**Test Cases**:

##### register() - Usuario nuevo exitoso
- **Resultado esperado**: Devuelve objeto con `accessToken` y `user` sin password
- **Justificación**: Verifica el flujo completo de registro: validación de email único, hash de password, creación de usuario y generación de JWT
- **Casos de prueba**:
  - Email único
  - Password hash correcto (verificado con bcrypt.compare)
  - Token JWT válido
  - Password no incluido en respuesta

##### register() - Email duplicado (ConflictException)
- **Resultado esperado**: Lanza `ConflictException` con mensaje "User with this email already exists"
- **Justificación**: Previene registros duplicados y asegura unicidad de emails
- **Casos de prueba**:
  - Usuario con email existente
  - No se crea nuevo usuario
  - Se lanza excepción antes de intentar crear

##### login() - Credenciales válidas
- **Resultado esperado**: Devuelve `accessToken` y `user` data sin password
- **Justificación**: Verifica autenticación exitosa con credenciales correctas
- **Casos de prueba**:
  - Email existe en base de datos
  - Password coincide con hash almacenado
  - Token JWT generado correctamente
  - Password no incluido en respuesta

##### login() - Email inexistente (UnauthorizedException)
- **Resultado esperado**: Lanza `UnauthorizedException` con mensaje "Invalid credentials"
- **Justificación**: Previene enumeración de usuarios y asegura mensaje de error consistente
- **Casos de prueba**:
  - Usuario no existe
  - Se lanza excepción antes de verificar password

##### login() - Password incorrecto (UnauthorizedException)
- **Resultado esperado**: Lanza `UnauthorizedException` con mensaje "Invalid credentials"
- **Justificación**: Asegura que solo usuarios con credenciales correctas puedan autenticarse
- **Casos de prueba**:
  - Email existe pero password no coincide
  - Se lanza excepción después de verificar password

##### validateUser() - Usuario válido
- **Resultado esperado**: Devuelve `user` data sin password
- **Justificación**: Verifica validación de usuario por ID para JWT strategy
- **Casos de prueba**:
  - Usuario existe
  - Password no incluido en respuesta
  - Campos correctos incluidos

##### validateUser() - Usuario inexistente
- **Resultado esperado**: Devuelve `null`
- **Justificación**: Maneja casos donde el usuario fue eliminado después de emitir el token
- **Casos de prueba**:
  - Usuario no existe
  - Retorna null sin lanzar excepción

#### auth.controller.spec.ts

**Purpose**: Tests HTTP endpoints for authentication including request validation.

**Test Cases**:

##### POST /auth/register - Request válido (201)
- **Resultado esperado**: Devuelve 201 con `accessToken` y `user` data
- **Justificación**: Verifica endpoint de registro exitoso
- **Casos de prueba**:
  - Request válido
  - Response contiene token y usuario
  - Status code 201 (CREATED)

##### POST /auth/register - Email duplicado (409)
- **Resultado esperado**: Lanza `ConflictException` con código 409
- **Justificación**: Verifica manejo de errores de email duplicado
- **Casos de prueba**:
  - Email ya existe
  - Status code 409 (CONFLICT)

##### POST /auth/register - Validación DTO fallida (400)
- **Resultado esperado**: Lanza `BadRequestException` con código 400
- **Justificación**: Verifica validación de DTOs (debe ser manejado por ValidationPipe global)
- **Nota**: La validación real se prueba en e2e tests

##### POST /auth/login - Credenciales válidas (200)
- **Resultado esperado**: Devuelve 200 con `accessToken` y `user` data
- **Justificación**: Verifica endpoint de login exitoso
- **Casos de prueba**:
  - Credenciales válidas
  - Response contiene token y usuario
  - Status code 200 (OK)

##### POST /auth/login - Credenciales inválidas (401)
- **Resultado esperado**: Lanza `UnauthorizedException` con código 401
- **Justificación**: Verifica manejo de errores de autenticación
- **Casos de prueba**:
  - Credenciales inválidas
  - Status code 401 (UNAUTHORIZED)

### Tasks Module Tests

#### tasks.service.spec.ts

**Purpose**: Tests task CRUD operations including authorization checks.

**Test Cases**:

##### create() - Tarea creada exitosamente
- **Resultado esperado**: Devuelve task creada con `userId` correcto
- **Justificación**: Verifica creación de tareas con usuario autenticado
- **Casos de prueba**:
  - Task creada con datos correctos
  - userId asignado automáticamente
  - Fechas y status correctos

##### findAll() - Obtener todas las tareas del usuario
- **Resultado esperado**: Devuelve array de tasks del usuario
- **Justificación**: Verifica filtrado por userId para asegurar aislamiento de datos
- **Casos de prueba**:
  - Solo retorna tasks del usuario autenticado
  - Ordenado por fecha de creación descendente

##### findAll() - Filtrar por status
- **Resultado esperado**: Devuelve solo tasks con el status especificado
- **Justificación**: Verifica filtrado adicional por status manteniendo aislamiento de usuario
- **Casos de prueba**:
  - Filtro por status aplicado
  - Aislamiento de usuario mantenido

##### findOne() - Tarea encontrada
- **Resultado esperado**: Devuelve task si pertenece al usuario
- **Justificación**: Verifica acceso a tarea propia
- **Casos de prueba**:
  - Task existe
  - Task pertenece al usuario
  - Task retornada correctamente

##### findOne() - Tarea no encontrada (NotFoundException)
- **Resultado esperado**: Lanza `NotFoundException`
- **Justificación**: Maneja casos de tarea inexistente
- **Casos de prueba**:
  - Task no existe
  - Excepción lanzada correctamente

##### findOne() - Tarea de otro usuario (ForbiddenException)
- **Resultado esperado**: Lanza `ForbiddenException`
- **Justificación**: Previene acceso no autorizado a tareas de otros usuarios
- **Casos de prueba**:
  - Task existe pero pertenece a otro usuario
  - Excepción lanzada antes de retornar datos

##### update() - Actualización exitosa
- **Resultado esperado**: Devuelve task actualizada
- **Justificación**: Verifica actualización de tareas propias
- **Casos de prueba**:
  - Task actualizada correctamente
  - Solo campos especificados actualizados
  - Validación de propiedad ejecutada

##### remove() - Eliminación exitosa
- **Resultado esperado**: Devuelve task eliminada
- **Justificación**: Verifica eliminación de tareas propias
- **Casos de prueba**:
  - Task eliminada correctamente
  - Validación de propiedad ejecutada

#### tasks.controller.spec.ts

**Purpose**: Tests HTTP endpoints for task CRUD operations including authorization.

**Test Cases**:

##### POST /tasks - Crear tarea exitosa
- **Resultado esperado**: Devuelve task creada con código 201
- **Justificación**: Verifica creación de tareas autenticadas
- **Casos de prueba**:
  - Usuario autenticado
  - Task creada correctamente

##### GET /tasks - Obtener todas las tareas
- **Resultado esperado**: Devuelve array de tasks del usuario
- **Justificación**: Verifica listado de tareas con filtrado por usuario
- **Casos de prueba**:
  - Solo tasks del usuario autenticado
  - Orden correcto

##### GET /tasks?status=COMPLETED - Filtrar por status
- **Resultado esperado**: Devuelve solo tasks con el status especificado
- **Justificación**: Verifica filtrado opcional por status
- **Casos de prueba**:
  - Filtro aplicado correctamente
  - Aislamiento de usuario mantenido

##### GET /tasks/:id - Obtener tarea por ID
- **Resultado esperado**: Devuelve task si pertenece al usuario
- **Justificación**: Verifica acceso a tarea específica
- **Casos de prueba**:
  - Task retornada si pertenece al usuario
  - 404 si no existe
  - 403 si pertenece a otro usuario

##### PATCH /tasks/:id - Actualizar tarea exitosa
- **Resultado esperado**: Devuelve task actualizada
- **Justificación**: Verifica actualización de tareas propias
- **Casos de prueba**:
  - Task actualizada correctamente
  - Validación de propiedad ejecutada

##### DELETE /tasks/:id - Eliminar tarea exitosa
- **Resultado esperado**: Devuelve task eliminada
- **Justificación**: Verifica eliminación de tareas propias
- **Casos de prueba**:
  - Task eliminada correctamente
  - Validación de propiedad ejecutada

## Test Fixtures

### fixtures/test-data.ts

Contains mock data for tests:
- `mockUser`, `mockUser2`: Mock user objects
- `mockTask`, `mockTask2`: Mock task objects
- `mockRegisterDto`, `mockLoginDto`: Mock DTOs
- `mockCreateTaskDto`: Mock task creation DTO
- `mockJwtToken`, `mockJwtPayload`: Mock JWT data

## Test Utilities

### utils/test-helpers.ts

Contains utility functions for tests:
- `createMockPrismaService()`: Creates a mock PrismaService
- `getPrismaServiceMock()`: Gets PrismaService mock from TestingModule
- `resetPrismaServiceMock()`: Resets all mocks in PrismaService
- `wait()`: Helper for async operations

## Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Mocks**: Use mocks for external dependencies (Prisma, JWT, etc.)
3. **Clear naming**: Test names should clearly describe what is being tested
4. **Documentation**: Each test should have a comment explaining its purpose
5. **Edge cases**: Test both success and failure scenarios
6. **Authorization**: Always verify that authorization checks are working

## Notes

- Tests use Jest as the testing framework
- Tests use `@nestjs/testing` for dependency injection
- PrismaService is always mocked to avoid database dependencies
- Tests should be fast and deterministic
- Temporary tests should not be committed (as per project rules)

