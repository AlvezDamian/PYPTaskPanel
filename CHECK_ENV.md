# Checklist de Variables de Entorno - Render

## Variables Requeridas (Críticas)

### ✅ DATABASE_URL
- **Requerida:** SÍ
- **Se configura:** Automáticamente al conectar la base de datos
- **Formato:** `postgresql://user:password@host:port/database`
- **Verificar:** Debe estar presente y ser válida

### ✅ JWT_SECRET
- **Requerida:** SÍ
- **Se configura:** Manualmente
- **Formato:** String de mínimo 32 caracteres
- **Verificar:** Debe estar presente y tener al menos 32 caracteres
- **Ubicación en código:** `backend/src/auth/auth.module.ts:17`

### ✅ FRONTEND_URL
- **Requerida:** SÍ
- **Se configura:** Manualmente
- **Valor:** `https://pyp-task-panel.vercel.app`
- **Verificar:** Debe coincidir exactamente con la URL de Vercel
- **Ubicación en código:** `backend/src/main.ts:13`

## Variables Opcionales (con defaults)

### ⚙️ PORT
- **Requerida:** NO (tiene default)
- **Valor en Render:** `10000` (ya configurado en render.yaml)
- **Default en código:** `3001`
- **Ubicación en código:** `backend/src/main.ts:34`

### ⚙️ JWT_EXPIRES_IN
- **Requerida:** NO (tiene default)
- **Valor:** `7d` (ya configurado en render.yaml)
- **Default en código:** `7d`
- **Ubicación en código:** `backend/src/auth/auth.module.ts:15`

### ⚙️ NODE_ENV
- **Requerida:** NO (recomendada)
- **Valor:** `production` (ya configurado en render.yaml)
- **Recomendada para producción**

---

## Comando para Verificar (después de login)

```bash
# 1. Autenticarse
render login

# 2. Listar servicios
render services list -o json

# 3. Ver variables de entorno (necesitas el service ID)
# El comando exacto depende de la versión del CLI
```

---

## Verificación Manual en Dashboard

1. Ve a [render.com](https://render.com)
2. Selecciona el servicio `pyptaskpanel`
3. Ve a **Settings** → **Environment**
4. Verifica que estén presentes:

### ✅ Debe estar:
- [ ] `DATABASE_URL` (automática)
- [ ] `JWT_SECRET` (manual - mínimo 32 caracteres)
- [ ] `FRONTEND_URL` = `https://pyp-task-panel.vercel.app` (manual)

### ⚙️ Ya configuradas (en render.yaml):
- [x] `NODE_ENV` = `production`
- [x] `PORT` = `10000`
- [x] `JWT_EXPIRES_IN` = `7d`

---

## Resumen de Variables Necesarias

### Variables que DEBES configurar manualmente:
```
JWT_SECRET=<tu-clave-de-32-caracteres-minimo>
FRONTEND_URL=https://pyp-task-panel.vercel.app
```

### Variables que se configuran automáticamente:
```
DATABASE_URL=<automática al conectar BD>
NODE_ENV=production
PORT=10000
JWT_EXPIRES_IN=7d
```

---

## Verificación Rápida

Ejecuta este comando para verificar que el backend esté funcionando:

```bash
curl https://pyptaskpanel.onrender.com
```

Si responde (aunque sea un 404), significa que el servidor está corriendo y las variables básicas están configuradas.

