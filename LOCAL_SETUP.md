# 🚀 Guía Rápida - Setup Local

Esta guía te ayudará a levantar el proyecto completo en tu máquina local.

## 📋 Prerequisitos

- **Node.js 20.19.0+** (LTS) - [Descargar Node.js](https://nodejs.org/)
- **MySQL 8.0+** - [Descargar MySQL](https://dev.mysql.com/downloads/mysql/)
- **npm** (viene con Node.js) o **yarn**

## ✅ Verificar Versiones

```bash
node -v  # Debe mostrar v20.x.x
npm -v   # Debe mostrar v10.x.x o superior
mysql --version  # Debe mostrar MySQL 8.0 o superior
```

## 🔧 Paso 1: Instalar MySQL

### macOS (Homebrew)
```bash
brew install mysql
brew services start mysql
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

### Windows
1. Descarga el instalador desde [MySQL Downloads](https://dev.mysql.com/downloads/mysql/)
2. Ejecuta el instalador y sigue las instrucciones
3. Asegúrate de que el servicio MySQL esté corriendo

## 🗄️ Paso 2: Crear Base de Datos

```bash
# Conectar a MySQL
mysql -u root -p

# Crear la base de datos
CREATE DATABASE tasks_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Salir
EXIT;
```

O desde la línea de comandos:
```bash
mysql -u root -p -e "CREATE DATABASE tasks_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

## 🔙 Paso 3: Configurar Backend

1. **Navegar al directorio:**
   ```bash
   cd backend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Crear archivo `.env`:**
   ```bash
   cp .env.example .env  # Si existe
   # O crear manualmente
   ```

4. **Editar `.env` con tus credenciales:**
   ```env
   DATABASE_URL="mysql://root:tu_password@localhost:3306/tasks_db"
   JWT_SECRET="tu-clave-secreta-de-minimo-32-caracteres"
   JWT_EXPIRES_IN="7d"
   PORT=3001
   FRONTEND_URL="http://localhost:3000"
   ```

   **Nota:** Reemplaza `root` y `tu_password` con tus credenciales de MySQL.

5. **Ejecutar migraciones:**
   ```bash
   npm run prisma:migrate
   ```

6. **Iniciar el servidor:**
   ```bash
   npm run start:dev
   ```

   El backend estará disponible en `http://localhost:3001`

## 🎨 Paso 4: Configurar Frontend

1. **Abrir una nueva terminal y navegar al directorio:**
   ```bash
   cd frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Crear archivo `.env`:**
   ```bash
   cp .env.example .env  # Si existe
   # O crear manualmente
   ```

4. **Editar `.env`:**
   ```env
   REACT_APP_API_URL=http://localhost:3001
   REACT_APP_API_TIMEOUT=10000
   ```

5. **Iniciar el servidor de desarrollo:**
   ```bash
   npm start
   ```

   El frontend se abrirá automáticamente en `http://localhost:3000`

## 🎯 Paso 5: Verificar que Todo Funciona

1. **Backend corriendo:**
   - Deberías ver: `Application is running on: http://localhost:3001`
   - Puedes probar: `curl http://localhost:3001` (debería responder)

2. **Frontend corriendo:**
   - El navegador debería abrirse en `http://localhost:3000`
   - Deberías ver la página de login

3. **Crear un usuario:**
   - Click en "Register"
   - Completa el formulario
   - Deberías ser redirigido a la página de tareas

## 🐛 Solución de Problemas

### Error: "Can't reach database server"
- Verifica que MySQL esté corriendo:
  ```bash
  # macOS
  brew services list
  
  # Linux
  sudo systemctl status mysql
  ```
- Verifica que `DATABASE_URL` tenga las credenciales correctas
- Verifica que la base de datos `tasks_db` exista

### Error: "Port 3001 already in use"
- Cambia el `PORT` en `backend/.env`
- O detén el proceso que está usando el puerto:
  ```bash
  # macOS/Linux
  lsof -ti:3001 | xargs kill
  ```

### Error: "ERR_CONNECTION_REFUSED" en el frontend
- Verifica que el backend esté corriendo
- Verifica que `REACT_APP_API_URL` sea `http://localhost:3001`
- Verifica que no haya firewall bloqueando la conexión

### Error: "JWT_SECRET is not defined"
- Verifica que hayas agregado `JWT_SECRET` en `backend/.env`
- Reinicia el servidor backend

## 📚 Documentación Adicional

- [README.md](./README.md) - Documentación completa del proyecto
- [SETUP_ENV.md](./SETUP_ENV.md) - Detalles sobre variables de entorno
- [backend/README.md](./backend/README.md) - Documentación del backend
- [frontend/README.md](./frontend/README.md) - Documentación del frontend

## ✅ Checklist Final

- [ ] Node.js 20.19.0+ instalado
- [ ] MySQL instalado y corriendo
- [ ] Base de datos `tasks_db` creada
- [ ] Backend `.env` configurado
- [ ] Frontend `.env` configurado
- [ ] Migraciones ejecutadas
- [ ] Backend corriendo en puerto 3001
- [ ] Frontend corriendo en puerto 3000
- [ ] Puedo crear un usuario y hacer login

