# Guía de Deploy - PYPTaskPanel

Esta guía explica cómo hacer deploy del frontend y backend en producción.

## 📋 Prerequisitos

- Cuenta en [Vercel](https://vercel.com) (para frontend)
- Cuenta en [Railway](https://railway.app) o [Render](https://render.com) (para backend)
- Base de datos MySQL/PostgreSQL en producción
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
     - Ejemplo: `https://your-backend.railway.app` o `https://api.yourdomain.com`
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

## 🔧 Deploy del Backend

### Opción 1: Railway (Recomendado para NestJS)

1. **Crea una cuenta en Railway:**
   - Ve a [railway.app](https://railway.app)
   - Conecta tu cuenta de GitHub

2. **Crea un nuevo proyecto:**
   - Click en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Selecciona `PYPTaskPanel`
   - Selecciona la rama `main`

3. **Configura el servicio:**
   - **Root Directory:** `backend`
   - **Build Command:** `npm ci && npm run build`
   - **Start Command:** `npm run start:prod`

4. **Configura Variables de Entorno:**
   ```
   DATABASE_URL=tu_database_url_de_produccion
   JWT_SECRET=tu_jwt_secret_super_seguro_min_32_chars
   JWT_EXPIRES_IN=7d
   PORT=3001
   FRONTEND_URL=https://tu-frontend.vercel.app
   NODE_ENV=production
   ```

5. **Configura la base de datos:**
   - Railway puede crear una base de datos PostgreSQL automáticamente
   - O conecta tu propia base de datos MySQL/PostgreSQL
   - Ejecuta las migraciones: `npx prisma migrate deploy`

### Opción 2: Render

1. **Crea un nuevo Web Service:**
   - Ve a [render.com](https://render.com)
   - Click en "New +" → "Web Service"
   - Conecta tu repositorio de GitHub

2. **Configura el servicio:**
   - **Name:** `pyp-taskpanel-backend`
   - **Environment:** `Node`
   - **Build Command:** `cd backend && npm ci && npm run build`
   - **Start Command:** `cd backend && npm run start:prod`
   - **Root Directory:** `backend`

3. **Variables de Entorno:** (igual que Railway)

### Opción 3: Fly.io

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

### Opciones recomendadas:

1. **Railway PostgreSQL** (gratis para empezar)
2. **Supabase** (gratis tier generoso)
3. **PlanetScale** (MySQL serverless)
4. **Neon** (PostgreSQL serverless)

### Migraciones en Producción

Después de configurar la base de datos:

```bash
# En Railway/Render, ejecuta en el terminal del servicio:
cd backend
npx prisma migrate deploy
npx prisma generate
```

## 🔐 Variables de Entorno en Producción

### Backend (Railway/Render)

```env
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=genera-una-clave-super-segura-de-minimo-32-caracteres
JWT_EXPIRES_IN=7d
PORT=3001
FRONTEND_URL=https://tu-frontend.vercel.app
NODE_ENV=production
```

### Frontend (Vercel)

```env
REACT_APP_API_URL=https://tu-backend.railway.app
REACT_APP_API_TIMEOUT=10000
```

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
- Verifica que la base de datos esté accesible
- Revisa los logs en Railway/Render

### Errores de migración

- Asegúrate de ejecutar `prisma migrate deploy` en producción
- No uses `prisma migrate dev` en producción
- Verifica que `DATABASE_URL` sea correcta

## 📚 Recursos

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Prisma Deploy Guide](https://www.prisma.io/docs/guides/deployment)

