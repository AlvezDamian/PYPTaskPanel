# 🚀 Opciones de Deploy - Backend con MySQL

## 📊 Comparación de Opciones

### Opción 1: Railway (Plan Gratuito Limitado)

**Limitaciones del plan gratuito:**
- ❌ Bases de datos MySQL requieren plan de pago
- ✅ Servicios web gratuitos disponibles
- ✅ $5 de crédito gratis al mes

**Solución:** Usar MySQL externo (PlanetScale) + Railway para el servicio

### Opción 2: Render + PlanetScale (100% Gratis)

**Render:**
- ✅ Servicios web gratuitos
- ❌ Solo PostgreSQL nativo (no MySQL)

**PlanetScale:**
- ✅ MySQL serverless gratuito
- ✅ 5GB de almacenamiento gratis
- ✅ 1 billón de reads/mes gratis
- ✅ Connection pooling incluido

**Combinación:**
- Backend en Render (gratis)
- MySQL en PlanetScale (gratis)
- Configurar `DATABASE_URL` en Render con la connection string de PlanetScale

### Opción 3: Fly.io (Gratis con Limitaciones)

- ✅ MySQL disponible
- ✅ Plan gratuito con limitaciones
- ⚠️ Requiere configuración más compleja

### Opción 4: Render + Cambiar a PostgreSQL (Más Fácil)

- ✅ Todo gratis en Render
- ✅ PostgreSQL nativo
- ⚠️ Requiere cambiar el schema de Prisma

## 🎯 Recomendación: Render + PlanetScale

Esta es la mejor opción para mantener MySQL y usar servicios gratuitos:

1. **Backend en Render** (gratis)
2. **MySQL en PlanetScale** (gratis)
3. **Frontend en Vercel** (gratis)

### Pasos:

1. **Crear MySQL en PlanetScale:**
   - Ve a [planetscale.com](https://planetscale.com)
   - Crea cuenta gratuita
   - Crea base de datos `pyp-taskpanel`
   - Copia la connection string

2. **Deployar backend en Render:**
   - Ve a [render.com](https://render.com)
   - Crea Web Service desde GitHub
   - Root Directory: `backend`
   - Build Command: `npm ci && npm run build && npx prisma generate`
   - Start Command: `npm run start:prod`

3. **Configurar variables en Render:**
   ```
   DATABASE_URL=<connection string de PlanetScale>
   JWT_SECRET=<tu-clave-secreta>
   FRONTEND_URL=https://pyp-task-panel.vercel.app
   NODE_ENV=production
   PORT=10000
   ```

4. **Ejecutar migraciones:**
   - En el Shell de Render:
     ```bash
     cd backend
     npx prisma migrate deploy
     ```

## 💰 Costos

| Opción | Backend | Base de Datos | Total |
|--------|---------|--------------|-------|
| Railway + MySQL | Gratis* | $5/mes | $5/mes |
| Render + PlanetScale | Gratis | Gratis | **$0** |
| Render + PostgreSQL | Gratis | Gratis | **$0** |

*Railway da $5 gratis al mes, pero MySQL requiere plan de pago

## ✅ Decisión Recomendada

**Render + PlanetScale** es la mejor opción porque:
- ✅ 100% gratuito
- ✅ Mantiene MySQL (no necesitas cambiar código)
- ✅ Fácil de configurar
- ✅ Escalable cuando crezcas

