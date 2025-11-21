# Configuración de Variables de Entorno

Este documento explica cómo configurar las variables de entorno para que la aplicación funcione correctamente.

## Backend (.env)

Crea un archivo `.env` en el directorio `backend/` con las siguientes variables:

```env
# Database Connection (MySQL)
DATABASE_URL="mysql://user:password@localhost:3306/tasks_db"

# JWT Configuration - AGREGAR ESTAS VARIABLES
JWT_SECRET="your-super-secret-jwt-key-change-in-production-min-32-chars"
JWT_EXPIRES_IN="7d"

# Server Configuration - AGREGAR ESTAS VARIABLES
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

### Variables a Agregar al .env del Backend:

1. **JWT_SECRET**: Clave secreta para firmar tokens JWT (mínimo 32 caracteres, cámbiala en producción)
2. **JWT_EXPIRES_IN**: Tiempo de expiración del token (por defecto: "7d")
3. **PORT**: Puerto donde correrá el backend (por defecto: 3001)
4. **FRONTEND_URL**: URL del frontend para CORS (por defecto: "http://localhost:3000")

### Ejemplo de JWT_SECRET segura:

```bash
# Genera una clave secreta segura (Linux/Mac)
openssl rand -base64 32

# O usa una clave personalizada (mínimo 32 caracteres)
JWT_SECRET="my-super-secret-jwt-key-12345678901234567890"
```

## Frontend (.env)

Crea un archivo `.env` en el directorio `frontend/` con las siguientes variables:

```env
# Backend API URL
REACT_APP_API_URL=http://localhost:3001
REACT_APP_API_TIMEOUT=10000
```

### Variables del Frontend:

1. **REACT_APP_API_URL**: URL base del backend API (debe coincidir con el PORT del backend)
2. **REACT_APP_API_TIMEOUT**: Tiempo máximo de espera para requests (en milisegundos)

## Pasos para Configurar

### 1. Backend

Edita el archivo `backend/.env` y agrega las variables faltantes:

```bash
cd backend
nano .env  # o usa tu editor preferido
```

Agrega al final del archivo:

```env
JWT_SECRET="your-super-secret-jwt-key-change-in-production-min-32-chars"
JWT_EXPIRES_IN="7d"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

### 2. Frontend

Crea el archivo `frontend/.env`:

```bash
cd frontend
cat > .env << 'EOF'
REACT_APP_API_URL=http://localhost:3001
REACT_APP_API_TIMEOUT=10000
EOF
```

O créalo manualmente con:

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_API_TIMEOUT=10000
```

## Verificación

### Backend

1. Verifica que el backend pueda leer las variables:
   ```bash
   cd backend
   npm run start:dev
   ```

   Deberías ver:
   ```
   Application is running on: http://localhost:3001
   ```

### Frontend

1. Verifica que el frontend pueda conectarse al backend:
   ```bash
   cd frontend
   npm start
   ```

   El frontend debería abrir en `http://localhost:3000` y poder conectarse al backend.

## Notas Importantes

- **JWT_SECRET**: Nunca commitees esta clave al repositorio. Debe ser diferente en producción.
- **REACT_APP_API_URL**: Asegúrate de que el puerto coincida con el PORT del backend.
- **Variables de React**: Solo las variables que empiezan con `REACT_APP_` son accesibles en el frontend.
- **CORS**: El backend está configurado para aceptar requests desde `FRONTEND_URL`.

## Solución de Problemas

### Error: "JWT_SECRET is not defined"
- Verifica que hayas agregado `JWT_SECRET` al `.env` del backend.
- Reinicia el servidor backend.

### Error: "Cannot connect to backend"
- Verifica que `REACT_APP_API_URL` en el frontend coincida con el `PORT` del backend.
- Verifica que el backend esté corriendo.
- Verifica la configuración de CORS en el backend.

### Error: "CORS policy blocked"
- Verifica que `FRONTEND_URL` en el backend coincida con la URL del frontend.
- Verifica que el backend esté corriendo en el puerto correcto.

