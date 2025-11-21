# 🔧 Configurar MySQL en Render

## ⚠️ Importante

Render **NO ofrece MySQL nativamente**, solo PostgreSQL. Para usar MySQL necesitas un servicio externo.

## ✅ Opciones para MySQL

### Opción 1: PlanetScale (Recomendado - MySQL Serverless)

1. **Crea una cuenta en PlanetScale:**
   - Ve a [planetscale.com](https://planetscale.com)
   - Crea una cuenta gratuita

2. **Crea una base de datos:**
   - Click en "Create database"
   - **Name:** `pyp-taskpanel`
   - Selecciona la región más cercana
   - Click en "Create database"

3. **Obtén la connection string:**
   - Ve a tu base de datos
   - Click en "Connect"
   - Copia la connection string (formato: `mysql://...`)

4. **Configura en Render:**
   - Ve a tu servicio: https://dashboard.render.com/web/srv-d4getdqdbo4c73852f60
   - Settings → Environment
   - Agrega la variable:
     ```
     DATABASE_URL=<pega la connection string de PlanetScale>
     ```

5. **Ejecuta migraciones:**
   - En el Shell de Render:
     ```bash
     cd backend
     npx prisma migrate deploy
     npx prisma generate
     ```

### Opción 2: Railway (MySQL)

1. **Crea una cuenta en Railway:**
   - Ve a [railway.app](https://railway.app)

2. **Crea un nuevo proyecto:**
   - Click en "New Project"
   - Selecciona "Provision MySQL"

3. **Obtén la connection string:**
   - Ve a la base de datos
   - Copia la "MySQL Connection URL"

4. **Configura en Render:**
   - Igual que en Opción 1, agrega `DATABASE_URL` en Render

### Opción 3: Aiven (MySQL)

1. **Crea una cuenta en Aiven:**
   - Ve a [aiven.io](https://aiven.io)

2. **Crea un servicio MySQL:**
   - Selecciona MySQL
   - Plan gratuito disponible

3. **Obtén la connection string y configura en Render**

## 📋 Formato de DATABASE_URL para MySQL

```
mysql://usuario:password@host:puerto/nombre_base_de_datos?sslaccept=strict
```

Ejemplo:
```
mysql://root:password@mysql.planetscale.com:3306/pyp-taskpanel?sslaccept=strict
```

## ✅ Checklist

- [ ] Base de datos MySQL creada (PlanetScale/Railway/Aiven)
- [ ] Connection string copiada
- [ ] `DATABASE_URL` configurada en Render
- [ ] Migraciones ejecutadas en Render Shell

## 🚀 Pasos Rápidos (PlanetScale)

1. Crear cuenta en PlanetScale
2. Crear base de datos `pyp-taskpanel`
3. Copiar connection string
4. Agregar `DATABASE_URL` en Render con la connection string
5. Ejecutar migraciones en Render Shell

## 🔍 Verificar Connection String

La connection string debe:
- Empezar con `mysql://`
- Incluir usuario, password, host, puerto y nombre de BD
- Tener SSL configurado (para servicios externos)

