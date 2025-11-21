# 🚂 Deploy del Backend en Railway

Railway soporta MySQL nativamente, por lo que es perfecto para este proyecto.

## 📋 Prerequisitos

- Cuenta en [Railway](https://railway.app)
- Conecta tu cuenta de GitHub

## 🚀 Pasos para Deploy

### 1. Crear Proyecto en Railway

1. Ve a [railway.app](https://railway.app)
2. Click en "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Selecciona el repositorio `PYPTaskPanel`
5. Selecciona la rama `main`

### 2. Crear Base de Datos MySQL

1. En tu proyecto de Railway, click en "New +"
2. Selecciona "Database" → "MySQL"
3. Railway creará automáticamente una base de datos MySQL
4. **Copia la connection string** (MySQL Connection URL) - la necesitarás después

### 3. Configurar el Servicio Backend

1. Railway debería detectar automáticamente el servicio
2. Si no, click en "New +" → "GitHub Repo"
3. Selecciona `PYPTaskPanel` y la rama `main`

### 4. Configurar Variables de Entorno

1. Selecciona el servicio del backend
2. Ve a la pestaña "Variables"
3. Agrega las siguientes variables:

```
NODE_ENV=production
PORT=3001
DATABASE_URL=<pega la MySQL Connection URL de Railway>
JWT_SECRET=<genera-una-clave-segura-de-32-caracteres-minimo>
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://pyp-task-panel.vercel.app
```

**Nota:** `DATABASE_URL` se puede configurar automáticamente:
- En la pestaña "Variables", busca "Add Reference"
- Selecciona la base de datos MySQL
- Railway agregará `DATABASE_URL` automáticamente

### 5. Configurar Root Directory y Comandos

1. En el servicio del backend, ve a "Settings"
2. Configura:
   - **Root Directory:** `backend`
   - **Build Command:** `npm ci && npm run build && npx prisma generate`
   - **Start Command:** `npm run start:prod`

### 6. Ejecutar Migraciones

1. Ve al servicio del backend
2. Abre la pestaña "Deployments"
3. Click en el deployment más reciente
4. Abre el "Shell" o "Logs"
5. Ejecuta:
   ```bash
   cd backend
   npx prisma migrate deploy
   npx prisma generate
   ```

O desde la terminal local con Railway CLI:
```bash
railway run --service <service-name> npx prisma migrate deploy
```

## 🔐 Variables de Entorno Requeridas

```
NODE_ENV=production
PORT=3001
DATABASE_URL=<automático al conectar MySQL>
JWT_SECRET=<tu-clave-secreta-de-32-caracteres>
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://pyp-task-panel.vercel.app
```

## ✅ Checklist

- [ ] Proyecto creado en Railway
- [ ] Base de datos MySQL creada
- [ ] Servicio backend configurado
- [ ] Root Directory: `backend`
- [ ] Variables de entorno configuradas
- [ ] `DATABASE_URL` conectada (automática o manual)
- [ ] Migraciones ejecutadas
- [ ] Backend funcionando

## 🔗 URLs

Después del deploy, Railway te dará una URL como:
- `https://tu-servicio.up.railway.app`

Actualiza `REACT_APP_API_URL` en Vercel con esta URL.

## 🐛 Troubleshooting

### Error: Can't reach database
- Verifica que `DATABASE_URL` esté configurada
- Verifica que la base de datos esté conectada al servicio

### Error: Build failed
- Verifica que Root Directory sea `backend`
- Verifica que los comandos de build sean correctos

### Error: Port already in use
- Railway asigna el puerto automáticamente
- Usa `process.env.PORT` en el código (ya está configurado)

## 📚 Recursos

- [Railway Documentation](https://docs.railway.app)
- [Railway MySQL Guide](https://docs.railway.app/databases/mysql)

