# Guía de Deploy - PYPTaskPanel

Esta guía explica cómo hacer deploy del frontend y backend en producción.

## 📋 Prerequisitos

- Cuenta en [Vercel](https://vercel.com) (para frontend)
- Cuenta en [Render](https://render.com) (para backend)
- Base de datos PostgreSQL en producción (Render puede crear una automáticamente)
- Variables de entorno configuradas

## 🚀 Deploy del Frontend (Vercel)

### Opción 1: Deploy desde GitHub (Recomendado)

1. **Conecta tu repositorio en Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Click en "Add New Project"
   - Importa el repositorio `PYPTaskPanel`
   - Selecciona la rama `main`

2. **Configura el proyecto:**
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm ci`

3. **Configura Variables de Entorno:**
   - `REACT_APP_API_URL`: URL de tu backend en producción
     - **URL del backend:** `https://pyptaskpanel.onrender.com`
   - `REACT_APP_API_TIMEOUT`: `10000` (opcional)

4. **Deploy:**
   - Click en "Deploy"
   - Vercel automáticamente hará deploy en cada push a `main`

### Opción 2: Deploy con Vercel CLI

```bash
# Instala Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy desde el directorio frontend
cd frontend
vercel

# Para producción
vercel --prod
```

## 🔧 Deploy del Backend (Render)

### Opción 1: Deploy con render.yaml (Recomendado - Más fácil)

1. **Crea una cuenta en Render:**
   - Ve a [render.com](https://render.com)
   - Conecta tu cuenta de GitHub

2. **Crea un nuevo Blueprint:**
   - Click en "New +" → "Blueprint"
   - Conecta tu repositorio `PYPTaskPanel`
   - Render detectará automáticamente el archivo `render.yaml`
   - Click en "Apply"

3. **Render creará automáticamente:**
   - Un Web Service para el backend
   - Una base de datos PostgreSQL
   - Las conexiones necesarias

4. **Configura las Variables de Entorno faltantes:**
   - Ve al servicio `pyp-taskpanel-backend`
   - En la sección "Environment", agrega:
     ```
     JWT_SECRET=genera-una-clave-super-segura-de-minimo-32-caracteres
     FRONTEND_URL=https://tu-frontend.vercel.app
     ```
   - **Nota:** `DATABASE_URL` se configura automáticamente cuando conectas la base de datos

5. **Ejecuta las migraciones:**
   - Ve al servicio `pyp-taskpanel-backend`
   - Abre el "Shell" (terminal)
   - Ejecuta:
     ```bash
     cd backend
     npx prisma migrate deploy
     ```

### Opción 2: Deploy Manual (Sin render.yaml)

1. **Crea la Base de Datos:**
   - Ve a [render.com](https://render.com)
   - Click en "New +" → "PostgreSQL"
   - **Name:** `pyp-taskpanel-db`
   - **Database:** `tasks_db`
   - **User:** `tasks_user`
   - Selecciona el plan (Free para empezar)
   - Click en "Create Database"
   - **Copia la "Internal Database URL"** (la necesitarás después)

2. **Crea el Web Service:**
   - Click en "New +" → "Web Service"
   - Conecta tu repositorio de GitHub
   - Selecciona `PYPTaskPanel` y la rama `main`

3. **Configura el servicio:**
   - **Name:** `pyp-taskpanel-backend`
   - **Environment:** `Node`
   - **Region:** `Oregon` (o la más cercana a ti)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Build Command:** `npm ci && npm run build && npx prisma generate`
   - **Start Command:** `npm run start:prod`

4. **Configura Variables de Entorno:**
   - En la sección "Environment", agrega:
     ```
     NODE_ENV=production
     PORT=10000
     DATABASE_URL=<pega la Internal Database URL que copiaste>
     JWT_SECRET=genera-una-clave-super-segura-de-minimo-32-caracteres
     JWT_EXPIRES_IN=7d
     FRONTEND_URL=https://tu-frontend.vercel.app
     ```
   - **Importante:** Render usa el puerto `10000` por defecto, no `3001`

5. **Conecta la Base de Datos:**
   - En la sección "Connections", conecta la base de datos `pyp-taskpanel-db`
   - Esto actualizará automáticamente `DATABASE_URL`

6. **Ejecuta las migraciones:**
   - Después del primer deploy, abre el "Shell" del servicio
   - Ejecuta:
     ```bash
     npx prisma migrate deploy
     ```

### Opción 3: Otras plataformas (Fly.io, Railway, etc.)

```bash
# Instala flyctl
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Inicializa el proyecto (desde la raíz)
fly launch --name pyp-taskpanel-backend

# Configura el Dockerfile o usa el buildpack de Node
# Agrega las variables de entorno en fly.toml o dashboard
```

## 🗄️ Base de Datos en Producción

### Render PostgreSQL (Recomendado)

Render puede crear automáticamente una base de datos PostgreSQL cuando usas el `render.yaml`, o puedes crearla manualmente:

1. **Si usas render.yaml:** La base de datos se crea automáticamente
2. **Si creas manualmente:** Ve a "New +" → "PostgreSQL" y sigue los pasos

### Otras opciones (si prefieres):

1. **Supabase** (gratis tier generoso)
2. **Neon** (PostgreSQL serverless)
3. **PlanetScale** (MySQL serverless)

### Migraciones en Producción

Después de configurar la base de datos en Render:

1. Ve al servicio `pyp-taskpanel-backend`
2. Abre el "Shell" (terminal)
3. Ejecuta:
   ```bash
   cd backend
   npx prisma migrate deploy
   ```

**Nota:** No uses `prisma migrate dev` en producción, solo `prisma migrate deploy`

## 🔐 Variables de Entorno en Producción

### Backend (Render)

```env
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=genera-una-clave-super-segura-de-minimo-32-caracteres
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://tu-frontend.vercel.app
```

**Importante:**
- `PORT` debe ser `10000` en Render (no `3001`)
- `DATABASE_URL` se configura automáticamente si conectas la base de datos desde el dashboard
- `JWT_SECRET` debe tener mínimo 32 caracteres

### Frontend (Vercel)

```env
REACT_APP_API_URL=https://pyp-taskpanel-backend.onrender.com
REACT_APP_API_TIMEOUT=10000
```

**Nota:** La URL del backend será `https://pyp-taskpanel-backend.onrender.com` (o el nombre que le hayas dado)

## ✅ Checklist de Deploy

### Antes del Deploy

- [ ] Variables de entorno configuradas en ambas plataformas
- [ ] Base de datos creada y migraciones ejecutadas
- [ ] `JWT_SECRET` generado y seguro (mínimo 32 caracteres)
- [ ] `FRONTEND_URL` en backend apunta a la URL de Vercel
- [ ] `REACT_APP_API_URL` en frontend apunta a la URL del backend
- [ ] CORS configurado correctamente en el backend

### Después del Deploy

- [ ] Backend responde en `/health` o `/api`
- [ ] Frontend puede hacer requests al backend
- [ ] Autenticación funciona (login/register)
- [ ] CRUD de tareas funciona
- [ ] Logs sin errores críticos

## 🔄 CI/CD Automático

### GitHub Actions (Opcional)

Puedes configurar GitHub Actions para:
- Tests automáticos en cada PR
- Linting y type checking
- Deploy automático a staging

Ejemplo básico en `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: |
          cd backend && npm ci && npm test
          cd ../frontend && npm ci && npm test
```

## 🐛 Troubleshooting

### Frontend no se conecta al backend

- Verifica que `REACT_APP_API_URL` esté correctamente configurada
- Verifica CORS en el backend (`FRONTEND_URL`)
- Revisa la consola del navegador para errores

### Backend no inicia

- Verifica que todas las variables de entorno estén configuradas
- Verifica que `PORT=10000` (Render usa este puerto por defecto)
- Verifica que la base de datos esté accesible y conectada
- Revisa los logs en Render (sección "Logs" del servicio)
- Verifica que el build se completó correctamente

### Errores de migración

- Asegúrate de ejecutar `prisma migrate deploy` en producción
- No uses `prisma migrate dev` en producción
- Verifica que `DATABASE_URL` sea correcta

## 📚 Recursos

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Render Blueprint Spec](https://render.com/docs/blueprint-spec)
- [Prisma Deploy Guide](https://www.prisma.io/docs/guides/deployment)
- [NestJS Production Deployment](https://docs.nestjs.com/recipes/deployment)

