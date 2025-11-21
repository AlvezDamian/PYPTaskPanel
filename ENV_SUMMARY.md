# Resumen de Variables de Entorno - PYPTaskPanel

## 🔗 URLs del Proyecto

- **Backend (Render):** `https://pyptaskpanel.onrender.com`
- **Frontend (Vercel):** `https://pyp-task-panel.vercel.app`

---

## 📦 Variables para Vercel (Frontend)

### Requeridas

```
REACT_APP_API_URL=https://pyptaskpanel.onrender.com
```

### Opcionales

```
REACT_APP_API_TIMEOUT=10000
```

**Cómo configurar:**
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega `REACT_APP_API_URL` con el valor `https://pyptaskpanel.onrender.com`
4. Guarda y haz redeploy

---

## 🔧 Variables para Render (Backend)

### Requeridas

```
NODE_ENV=production
PORT=10000
DATABASE_URL=<se configura automáticamente al conectar la BD>
JWT_SECRET=<genera-una-clave-segura-de-32-caracteres-minimo>
FRONTEND_URL=https://pyp-task-panel.vercel.app
```

### Opcionales

```
JWT_EXPIRES_IN=7d
```

**Cómo configurar:**
1. Ve a tu servicio en Render (`pyptaskpanel`)
2. Settings → Environment
3. Agrega las variables faltantes:
   - `JWT_SECRET`: Genera una clave segura (mínimo 32 caracteres)
   - `FRONTEND_URL`: `https://pyp-task-panel.vercel.app`
4. Guarda los cambios (Render hará redeploy automáticamente)

---

## ✅ Checklist de Configuración

### Vercel
- [ ] `REACT_APP_API_URL` configurada con `https://pyptaskpanel.onrender.com`
- [ ] (Opcional) `REACT_APP_API_TIMEOUT` configurada
- [ ] Redeploy realizado después de agregar variables

### Render
- [ ] `JWT_SECRET` configurada (mínimo 32 caracteres)
- [ ] `FRONTEND_URL` configurada con `https://pyp-task-panel.vercel.app`
- [ ] `DATABASE_URL` configurada (automática al conectar BD)
- [ ] Migraciones ejecutadas: `npx prisma migrate deploy`

---

## 🔍 Verificación

1. **Backend funcionando:**
   - Visita: `https://pyptaskpanel.onrender.com`
   - Deberías ver una respuesta (puede ser un error 404, pero significa que el servidor está corriendo)

2. **Frontend conectado:**
   - Visita: `https://pyp-task-panel.vercel.app`
   - Abre la consola del navegador (F12)
   - Intenta hacer login
   - Verifica que las peticiones vayan a `https://pyptaskpanel.onrender.com`

3. **CORS funcionando:**
   - Si ves errores de CORS en la consola, verifica que `FRONTEND_URL` en Render sea exactamente `https://pyp-task-panel.vercel.app`

---

## 🐛 Troubleshooting

### Error: CORS policy blocked
- Verifica que `FRONTEND_URL` en Render sea exactamente `https://pyp-task-panel.vercel.app` (sin barra final)
- Asegúrate de que el backend esté corriendo

### Error: Cannot connect to backend
- Verifica que `REACT_APP_API_URL` en Vercel sea `https://pyptaskpanel.onrender.com`
- Verifica que el backend esté corriendo en Render
- Revisa los logs en Render

### Error: JWT_SECRET is not defined
- Agrega `JWT_SECRET` en Render con una clave de mínimo 32 caracteres
- Reinicia el servicio en Render

