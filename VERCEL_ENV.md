# Variables de Entorno para Vercel

## ✅ Variables Requeridas

Configura estas variables en tu proyecto de Vercel:

### 1. REACT_APP_API_URL (Requerida)

**Valor:**
```
https://pyptaskpanel.onrender.com
```

**Descripción:** URL base del backend API en Render.

**Cómo configurar en Vercel:**
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Click en "Add New"
4. Key: `REACT_APP_API_URL`
5. Value: `https://pyptaskpanel.onrender.com`
6. Environments: Selecciona Production, Preview y Development
7. Click en "Save"

---

## 🔧 Variables Opcionales

### 2. REACT_APP_API_TIMEOUT (Opcional)

**Valor por defecto:** `10000` (10 segundos)

**Descripción:** Tiempo máximo de espera para requests HTTP en milisegundos.

**Solo agrega esta variable si quieres cambiar el timeout por defecto.**

---

## 📋 Resumen Rápido

Copia y pega esto en Vercel:

```
REACT_APP_API_URL=https://pyptaskpanel.onrender.com
REACT_APP_API_TIMEOUT=10000
```

---

## ⚠️ Notas Importantes

1. **Solo variables con prefijo `REACT_APP_`** son accesibles en el código del frontend
2. **Después de agregar variables**, necesitas hacer un **redeploy** para que surtan efecto
3. **Verifica la URL del backend** - Asegúrate de que `https://pyptaskpanel.onrender.com` esté funcionando antes de configurar el frontend
4. **CORS:** El backend debe tener configurado `FRONTEND_URL` con la URL de Vercel para permitir las peticiones

---

## 🔍 Verificación

Después de configurar las variables y hacer deploy:

1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Network"
3. Intenta hacer login o cualquier acción que llame al backend
4. Verifica que las peticiones vayan a `https://pyptaskpanel.onrender.com`
5. Si hay errores de CORS, verifica que en Render tengas configurado:
   ```
   FRONTEND_URL=https://pyp-task-panel.vercel.app
   ```

