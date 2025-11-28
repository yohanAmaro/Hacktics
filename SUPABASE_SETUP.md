# ⚙️ CONFIGURACIÓN RÁPIDA SUPABASE

## 1️⃣ Crear Cuenta y Proyecto (3 minutos)

### Paso 1: Ir a Supabase
- Abre: https://supabase.com
- Haz clic en **"Start your project"** o **"Sign Up"**
- Usa email y contraseña

### Paso 2: Crear Proyecto
- Haz clic en **"New Project"**
- **Nombre**: `itp-puebla` (o el que prefieras)
- **Database Password**: Genera una fuerte (Supabase lo hace)
- **Region**: Elige cercana (ej: `us-east-1` o `sa-america`)
- Espera 1-2 minutos a que se cree

---

## 2️⃣ Obtener Credenciales (1 minuto)

Una vez creado el proyecto:

### Paso 1: Ve a Settings > API
1. Click en **engranaje** (Settings) abajo a la izquierda
2. Ve a la pestaña **API**
3. Verás:
   - **Project URL** (empieza con `https://xxxxx.supabase.co`)
   - **anon public** (empieza con `eyJhb...`)
   - **service_role** (empieza con `eyJhb...`)

### Paso 2: Copiar valores
Copia estas 3 cosas:
```
URL = https://xxxxx.supabase.co
ANON_KEY = eyJhbGc...
ROLE_KEY = eyJhbGc...
```

---

## 3️⃣ Actualizar Archivos de Configuración

### Frontend (.env.local)
Reemplaza en `frontend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-url-aqui.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Backend (.env.local)
Reemplaza en `backend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-url-aqui.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

---

## 4️⃣ Crear Base de Datos (2 minutos)

### Paso 1: Ve a SQL Editor
1. En Supabase, haz clic en **SQL Editor** (izquierda)
2. Haz clic en **"New Query"**

### Paso 2: Copiar SQL
1. Abre el archivo: `001_database_schema.sql` (en la raíz del proyecto)
2. Copia TODO el contenido (Ctrl+A, Ctrl+C)

### Paso 3: Ejecutar
1. Pega en Supabase SQL Editor
2. Haz clic en **"Run"** (arriba a la derecha)
3. Verás confirmación ✓

---

## 5️⃣ Crear Usuario de Prueba (1 minuto)

### Opción A: En Supabase Dashboard
1. Ve a **Authentication** → **Users**
2. Haz clic en **"Invite"**
3. Ingresa:
   - Email: `test@example.com`
   - Password: `Test123!@`
4. Click en **"Send invite"**

### Opción B: Con el Signup del App
1. Abre http://localhost:3002 (o 3001)
2. Haz clic en **Login**
3. Ingresa email y password
4. Click **"Sign Up"**

---

## 6️⃣ Verificar que Funciona

### Paso 1: Reinicia los servidores
```bash
# En terminal 1 - Backend
cd backend
npm run dev

# En terminal 2 - Frontend
cd frontend
npm run dev
```

### Paso 2: Accede a la aplicación
- Frontend: http://localhost:3002 (o 3001)
- Backend API: http://localhost:3001/api

### Paso 3: Login
- Email: `test@example.com`
- Password: `Test123!@`

### Paso 4: Prueba
- ✓ Crear formato
- ✓ Iniciar trámite
- ✓ Guardar formulario
- ✓ Enviar solicitud

---

## ❌ Si Hay Errores

### Error: "Invalid credentials"
→ Verifica que las credenciales estén bien copiadas en `.env.local`

### Error: "Connection refused"
→ Verifica que los servidores estén corriendo (npm run dev)

### Error: "Tables not found"
→ Ejecuta el SQL schema en Supabase (paso 4)

### Error: CORS
→ Ve a Supabase → Authentication → Providers → Add a redirect URL:
   - `http://localhost:3002`
   - `http://localhost:3001`

---

## ✅ LISTO!

Tu sistema debe estar 100% funcional ahora.

**Próximos pasos:**
- Crear varios usuarios de prueba
- Crear formatos dinámicos
- Probar flujos de aprobación
- Generar PDFs
- Agregar firmas digitales

¿Necesitas ayuda con algo específico?
