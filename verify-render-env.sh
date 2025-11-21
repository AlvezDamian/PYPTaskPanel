#!/bin/bash

# Script para verificar variables de entorno en Render
# Basado en el análisis del código del backend

echo "🔍 Verificando variables de entorno necesarias para Render..."
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "📋 Variables REQUERIDAS (deben estar configuradas):"
echo ""

# Verificar que el backend responda
echo "1. Verificando que el backend esté corriendo..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://pyptaskpanel.onrender.com 2>/dev/null)

if [ "$BACKEND_STATUS" = "000" ]; then
    echo -e "${RED}❌ Backend no responde${NC}"
    echo "   El servicio puede estar apagado o las variables básicas no están configuradas"
elif [ "$BACKEND_STATUS" = "404" ] || [ "$BACKEND_STATUS" = "200" ] || [ "$BACKEND_STATUS" = "401" ]; then
    echo -e "${GREEN}✅ Backend está respondiendo (HTTP $BACKEND_STATUS)${NC}"
    echo "   Esto indica que PORT y NODE_ENV están configurados"
else
    echo -e "${YELLOW}⚠️  Backend responde con código: $BACKEND_STATUS${NC}"
fi

echo ""
echo "2. Variables que DEBES verificar manualmente en Render Dashboard:"
echo ""
echo -e "${YELLOW}   a) JWT_SECRET${NC}"
echo "      - Debe estar presente"
echo "      - Mínimo 32 caracteres"
echo "      - Ubicación: Settings → Environment → JWT_SECRET"
echo ""
echo -e "${YELLOW}   b) FRONTEND_URL${NC}"
echo "      - Debe ser: https://pyp-task-panel.vercel.app"
echo "      - Sin barra final"
echo "      - Ubicación: Settings → Environment → FRONTEND_URL"
echo ""
echo -e "${YELLOW}   c) DATABASE_URL${NC}"
echo "      - Se configura automáticamente al conectar la BD"
echo "      - Debe estar presente"
echo "      - Ubicación: Settings → Environment → DATABASE_URL"
echo ""
echo "3. Variables que ya están configuradas (en render.yaml):"
echo -e "${GREEN}   ✅ NODE_ENV=production${NC}"
echo -e "${GREEN}   ✅ PORT=10000${NC}"
echo -e "${GREEN}   ✅ JWT_EXPIRES_IN=7d${NC}"
echo ""
echo "📝 Para verificar manualmente:"
echo "   1. Ve a: https://dashboard.render.com/web/srv-d4getdqdbo4c73852f60"
echo "   2. Click en 'Settings' → 'Environment'"
echo "   3. Verifica que estén todas las variables listadas arriba"
echo ""

