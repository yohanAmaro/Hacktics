#!/bin/bash
# Script de prueba del sistema ITP

echo "═══════════════════════════════════════════════════════════════"
echo "🧪 INICIANDO PRUEBAS DEL SISTEMA"
echo "═══════════════════════════════════════════════════════════════"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Verificar Node.js
echo -e "\n${YELLOW}[1/5]${NC} Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✅ Node.js instalado: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js NO está instalado${NC}"
    exit 1
fi

# Test 2: Verificar estructura de carpetas
echo -e "\n${YELLOW}[2/5]${NC} Verificando estructura..."
if [ -d "backend" ] && [ -d "frontend" ]; then
    echo -e "${GREEN}✅ Carpetas encontradas (backend, frontend)${NC}"
else
    echo -e "${RED}❌ Faltan carpetas${NC}"
    exit 1
fi

# Test 3: Verificar SQL
echo -e "\n${YELLOW}[3/5]${NC} Verificando SQL..."
if [ -f "001_database_schema.sql" ]; then
    LINES=$(wc -l < 001_database_schema.sql)
    echo -e "${GREEN}✅ SQL encontrado ($LINES líneas)${NC}"
else
    echo -e "${RED}❌ Archivo SQL NO encontrado${NC}"
    exit 1
fi

# Test 4: Verificar dependencias Backend
echo -e "\n${YELLOW}[4/5]${NC} Verificando Backend..."
if [ -f "backend/package.json" ]; then
    echo -e "${GREEN}✅ Backend package.json encontrado${NC}"
else
    echo -e "${RED}❌ Backend package.json NO encontrado${NC}"
    exit 1
fi

# Test 5: Verificar dependencias Frontend
echo -e "\n${YELLOW}[5/5]${NC} Verificando Frontend..."
if [ -f "frontend/package.json" ]; then
    echo -e "${GREEN}✅ Frontend package.json encontrado${NC}"
else
    echo -e "${RED}❌ Frontend package.json NO encontrado${NC}"
    exit 1
fi

echo -e "\n═══════════════════════════════════════════════════════════════"
echo -e "${GREEN}✨ TODAS LAS PRUEBAS PASARON ✨${NC}"
echo "═══════════════════════════════════════════════════════════════"

echo -e "\n${YELLOW}📝 PRÓXIMOS PASOS:${NC}"
echo "1. Configura Supabase:"
echo "   - Copia el SQL de: 001_database_schema.sql"
echo "   - Ejecuta en Supabase Dashboard → SQL Editor"
echo ""
echo "2. Configura Backend:"
echo "   cd backend"
echo "   npm install"
echo "   cat > .env.local << EOF"
echo "NEXT_PUBLIC_SUPABASE_URL=tu_url"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key"
echo "SUPABASE_SERVICE_ROLE_KEY=tu_service_key"
echo "NEXT_PUBLIC_APP_URL=http://localhost:3000"
echo "EOF"
echo "   npm run dev"
echo ""
echo "3. Configura Frontend (nueva terminal):"
echo "   cd frontend"
echo "   npm install"
echo "   cat > .env.local << EOF"
echo "NEXT_PUBLIC_SUPABASE_URL=tu_url"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key"
echo "NEXT_PUBLIC_API_URL=http://localhost:3000/api"
echo "EOF"
echo "   npm run dev"
echo ""
echo "4. Abre: http://localhost:3001"
echo ""
echo -e "${GREEN}¡Listo para usar!${NC}"
