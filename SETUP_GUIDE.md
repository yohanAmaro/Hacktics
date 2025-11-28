# 🚀 GUÍA RÁPIDA DE SETUP

## 1️⃣ CONFIGURAR SUPABASE

### Paso 1: Crear Proyecto
```
1. Ir a supabase.com
2. Hacer clic en "Start your project"
3. Crear nuevo proyecto (nombre: "itp-tramites")
4. Copiar URL y claves de API
```

### Paso 2: Crear Base de Datos
```
1. En Supabase Dashboard → SQL Editor
2. Crear nueva query
3. Copiar TODO el contenido de: 001_database_schema.sql
4. Ejecutar (Execute)
5. Esperar a que se creen todas las tablas
```

### Paso 3: Crear Buckets
```
1. En Supabase Dashboard → Storage
2. Crear bucket: "documents" (Public)
3. Crear bucket: "signatures" (Public)
```

### Paso 4: Obtener Credenciales
```
Settings → API → Copiar:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY
```

---

## 2️⃣ CONFIGURAR BACKEND

```bash
# 1. Ir a carpeta backend
cd backend

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env.local
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

# 4. Ejecutar en desarrollo
npm run dev
# El backend estará en http://localhost:3000
```

---

## 3️⃣ CONFIGURAR FRONTEND

```bash
# 1. Abrir NUEVA terminal, ir a carpeta frontend
cd frontend

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env.local
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
NEXT_PUBLIC_API_URL=http://localhost:3000/api
EOF

# 4. Ejecutar en desarrollo
npm run dev
# El frontend estará en http://localhost:3001
```

---

## 4️⃣ PROBAR EL SISTEMA

### En Frontend (http://localhost:3001)

1. **Página de Login**
   - Haz clic en "Regístrate"
   - Usa: `usuario@test.com` / `password123`
   - Confirma tu email en Supabase

2. **Dashboard**
   - Verás estadísticas
   - Botón "Iniciar nuevo trámite"

3. **Formatos**
   - Ve a "Formatos"
   - Selecciona "Solicitud de Transporte"

4. **Formulario Dinámico**
   - Completa los campos
   - Haz clic "Guardar"
   - Luego "Enviar Solicitud"

5. **Ver Solicitud**
   - Desde "Mis Solicitudes"
   - Haz clic en tu solicitud
   - Botón "Descargar PDF" para generar documento

6. **Aprobaciones**
   - Crea otro usuario para aprobador
   - Accede como aprobador
   - Ve a "/aprobaciones"
   - Revisa y aprueba con firma

---

## 📝 DATOS DE PRUEBA

### Crear Usuarios en Supabase

1. En Supabase Dashboard → Authentication → Users
2. Crear usuarios manualmente:
   ```
   Email: usuario1@test.com
   Password: password123
   
   Email: aprobador1@test.com
   Password: password123
   ```

### O Usar API de Auth

```bash
# Desde cualquier terminal (con curl)
curl -X POST https://tu-proyecto.supabase.co/auth/v1/signup \
  -H "apikey: tu_anon_key" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@test.com",
    "password": "password123"
  }'
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

- [ ] Supabase proyecto creado
- [ ] Base de datos SQL ejecutada
- [ ] Buckets creados (documents, signatures)
- [ ] Variables de entorno backend OK
- [ ] Backend corriendo en http://localhost:3000
- [ ] Variables de entorno frontend OK
- [ ] Frontend corriendo en http://localhost:3001
- [ ] Login/Registro funcionando
- [ ] Formulario dinamico cargando
- [ ] PDF generando correctamente
- [ ] Flujo de aprobación funcionando

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "CORS" en frontend
**Solución:** Asegúrate que NEXT_PUBLIC_API_URL en frontend es http://localhost:3000/api

### Error: "Invalid API key"
**Solución:** Verifica que las claves en .env.local sean correctas desde Supabase

### Error: "Table not found"
**Solución:** Ejecuta nuevamente el SQL en Supabase. Verifica que todas las tablas estén creadas

### Error: "Auth error"
**Solución:** 
- Confirma tu email en Supabase
- Verifica que el usuario existe en Authentication
- Prueba con un nuevo usuario

### Frontend en blanco
**Solución:**
- Abre la consola (F12)
- Busca errores en Console y Network
- Verifica que backend esté corriendo

---

## 🔄 COMANDOS ÚTILES

```bash
# Backend
cd backend
npm run dev      # Desarrollo
npm run build    # Compilar
npm start        # Producción

# Frontend
cd frontend
npm run dev      # Desarrollo
npm run build    # Compilar
npm start        # Producción

# Limpiar cache
rm -rf node_modules
npm install

# Ver logs
tail -f .next/server.log
```

---

## 📊 INFORMACIÓN IMPORTANTE

### Puertos Necesarios
- Backend: **3000** (API)
- Frontend: **3001** (App web)

### Navegadores Soportados
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Requisitos del Sistema
- Node.js 18 o superior
- npm 8 o superior
- 2GB RAM mínimo

---

## 🎯 PRÓXIMOS PASOS DESPUÉS DE SETUP

1. **Crear más formatos**
   - Administrador accede a backend
   - POST /api/formats con nuevo JSON schema

2. **Asignar aprobadores**
   - En tabla approvals, actualizar approver_id

3. **Configurar roles**
   - En tabla users_roles (crear si es necesario)

4. **Enviar notificaciones**
   - Integrar Sendgrid o Firebase para emails

5. **Desplegar a producción**
   - Usar Vercel, Railway o servidor propio
   - Actualizar URLs de Supabase
   - Configurar dominios personalizados

---

## 📞 CONTACTO Y SOPORTE

Para problemas:
1. Revisa README.md en carpeta root
2. Consulta la documentación en backend/README.md
3. Consulta la documentación en frontend/README.md
4. Verifica logs en consola del navegador (F12)
5. Revisa logs del backend en terminal

---

**¡Sistema listo para usar! 🎉**

Accede a: http://localhost:3001
