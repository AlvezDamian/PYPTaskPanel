# 🔧 Solución al Error de Base de Datos en Render

## ❌ Problema

El backend está intentando conectarse a `localhost:3306` (MySQL local) en lugar de la base de datos de Render.

**Error:**
```
PrismaClientInitializationError: Can't reach database server at `localhost:3306`
```

## 🔍 Causa

1. **La variable `DATABASE_URL` no está configurada** en Render
2. **La base de datos no está conectada** al servicio
3. **Incompatibilidad:** El schema de Prisma está configurado para MySQL, pero Render crea PostgreSQL por defecto

## ✅ Solución

### Opción 1: Usar PostgreSQL (Recomendado - Más fácil)

Render crea PostgreSQL automáticamente. Necesitas cambiar el schema de Prisma:

1. **Actualiza el schema de Prisma:**

   Edita `backend/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"  // Cambiar de "mysql" a "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Crea la base de datos en Render:**
   - Ve a: https://dashboard.render.com
   - Click en "New +" → "PostgreSQL"
   - **Name:** `pyp-taskpanel-db`
   - Selecciona el plan (Free para empezar)
   - Click en "Create Database"

3. **Conecta la base de datos al servicio:**
   - Ve a tu servicio: https://dashboard.render.com/web/srv-d4getdqdbo4c73852f60
   - En la sección **Connections**, conecta la base de datos `pyp-taskpanel-db`
   - Esto configurará automáticamente `DATABASE_URL`

4. **Ejecuta las migraciones:**
   - Ve al servicio
   - Abre el "Shell"
   - Ejecuta:
     ```bash
     cd backend
     npx prisma migrate deploy
     npx prisma generate
     ```

### Opción 2: Usar MySQL (Requiere servicio externo)

Si prefieres mantener MySQL:

1. **Crea una base de datos MySQL externa** (ej: PlanetScale, Railway, etc.)
2. **Configura `DATABASE_URL` manualmente** en Render con la URL de MySQL
3. **Mantén el schema como está** (con `provider = "mysql"`)

## 📋 Checklist

- [ ] Base de datos creada en Render (PostgreSQL)
- [ ] Base de datos conectada al servicio (en la sección Connections)
- [ ] `DATABASE_URL` configurada automáticamente (se hace al conectar)
- [ ] Schema de Prisma actualizado a PostgreSQL (si usas Opción 1)
- [ ] Migraciones ejecutadas (`npx prisma migrate deploy`)

## 🚀 Pasos Rápidos (PostgreSQL)

1. Crear PostgreSQL en Render
2. Conectar al servicio (esto configura DATABASE_URL automáticamente)
3. Actualizar schema.prisma a `postgresql`
4. Hacer commit y push
5. Ejecutar migraciones en el Shell de Render

