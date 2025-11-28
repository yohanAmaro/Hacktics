# 📋 ITP - Sistema Digital de Gestión de Trámites

Sistema completo y profesional para la gestión digital de trámites institucionales del Instituto Tecnológico de Puebla.

## 📚 Contenido

1. **Base de Datos SQL** - Schema completo para Supabase
2. **Backend API** - Endpoints REST con Node.js/Next.js
3. **Frontend Moderno** - Interfaz responsive con React
4. **Componentes Reutilizables** - Form Builder, Timeline, etc.
5. **Seguridad** - Autenticación JWT, RLS, validaciones
6. **Auditoría** - Historial completo de acciones
7. **Generación de Documentos** - PDFs automáticos

---

## 🗄️ 1. BASE DE DATOS (Supabase)

### Archivo: `001_database_schema.sql`

Ejecutar en el SQL Editor de Supabase para crear:

#### Tablas Principales
```
📊 formats              - Definiciones de formatos dinámicos
📋 requests            - Solicitudes/trámites
✅ approvals           - Flujo de aprobaciones multinivel
🔏 signatures          - Firmas digitales
📝 audit_logs          - Registro de auditoría
📄 generated_documents - PDFs generados
```

#### Características
- ✅ Row Level Security (RLS) habilitado
- ✅ Índices optimizados para búsquedas rápidas
- ✅ Relaciones con ON DELETE CASCADE
- ✅ Campos JSONB para datos dinámicos
- ✅ Timestamps automáticos

### Pasos de Instalación
1. Abre Supabase Dashboard
2. Vete a SQL Editor
3. Copia todo el contenido de `001_database_schema.sql`
4. Ejecuta el script
5. Crea buckets en Storage: `documents`, `signatures`

---

## 🔧 2. BACKEND API

### Directorio: `backend/`

#### Stack Tecnológico
- **Next.js 14** - Framework Node.js con API routes
- **TypeScript** - Type safety
- **Supabase** - Auth + Database + Storage
- **PDFKit** - Generación de PDFs
- **UUID** - Identificadores únicos

#### Estructura de Carpetas
```
backend/
├── pages/api/
│   ├── health.ts                      # Health check
│   ├── formats/
│   │   ├── index.ts                   # GET, POST
│   │   └── [id].ts                    # GET, PUT, DELETE
│   ├── requests/
│   │   ├── index.ts                   # GET, POST
│   │   ├── [id].ts                    # GET, PUT
│   │   └── [id]/
│   │       ├── submit.ts              # POST submit
│   │       ├── approvals.ts           # GET approvals
│   │       ├── review.ts              # POST approve, PUT reject
│   │       └── documents.ts           # GET, POST PDF
│   ├── signatures/
│   │   └── index.ts                   # GET, POST
│   └── approvals/
│       └── pending.ts                 # GET pending approvals
├── lib/
│   ├── auth.ts                        # JWT verification
│   ├── approvals.ts                   # Approval workflow logic
│   ├── audit.ts                       # Audit logging
│   ├── storage.ts                     # File uploads
│   ├── pdf.ts                         # PDF generation
│   └── signatures.ts                  # Digital signatures
├── package.json
├── tsconfig.json
└── next.config.js
```

### Endpoints API

#### Formatos
```
GET    /api/formats               # Listar todos (filtrados por activos)
GET    /api/formats/:id           # Obtener uno
POST   /api/formats               # Crear (admin)
PUT    /api/formats/:id           # Actualizar (admin)
DELETE /api/formats/:id           # Eliminar (admin)
```

#### Solicitudes
```
GET    /api/requests              # Mis solicitudes (con filtros)
POST   /api/requests              # Crear solicitud
GET    /api/requests/:id          # Ver detalle
PUT    /api/requests/:id          # Editar (solo draft)
POST   /api/requests/:id/submit   # Enviar solicitud
```

#### Aprobaciones
```
GET    /api/requests/:id/approvals         # Ver aprobaciones
POST   /api/requests/:id/review            # Aprobar
PUT    /api/requests/:id/review            # Rechazar
GET    /api/approvals/pending              # Mis pendientes
```

#### Documentos
```
POST   /api/requests/:id/documents         # Generar PDF
GET    /api/requests/:id/documents         # Listar PDFs
```

#### Firmas
```
GET    /api/signatures                     # Mi firma
POST   /api/signatures                     # Guardar firma
```

### Instalación y Ejecución

```bash
cd backend

# 1. Instalar dependencias
npm install

# 2. Crear .env.local
echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key" >> .env.local
echo "SUPABASE_SERVICE_ROLE_KEY=your_service_role_key" >> .env.local

# 3. Desarrollo (puerto 3000)
npm run dev

# 4. Producción
npm run build
npm start
```

### Autenticación
- Usa JWT tokens de Supabase Auth
- Header: `Authorization: Bearer <token>`
- Verifica automáticamente en cada endpoint

### Logging de Auditoría
- Cada acción se registra automáticamente
- Tabla: `audit_logs`
- Campos: action, user_id, request_id, details, timestamp

---

## 🎨 3. FRONTEND

### Directorio: `frontend/`

#### Stack Tecnológico
- **Next.js 14 (App Router)** - Framework React
- **React 18** - UI framework
- **TailwindCSS** - Styling (utility-first)
- **SWR** - Data fetching + caching
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Lucide React** - Icons

#### Estructura de Carpetas
```
frontend/
├── app/
│   ├── page.tsx                        # Home (redirige a dashboard o login)
│   ├── layout.tsx                      # Root layout
│   ├── globals.css                     # Estilos globales
│   ├── login/page.tsx                  # Autenticación
│   ├── dashboard/page.tsx              # Dashboard principal
│   ├── formatos/page.tsx               # Listado de formatos
│   ├── formulario/[id]/page.tsx        # Formulario dinámico
│   ├── solicitud/[id]/page.tsx         # Detalle de solicitud
│   ├── mis-solicitudes/page.tsx        # Listado con filtros
│   └── aprobaciones/page.tsx           # Panel de aprobador
├── components/
│   ├── FormBuilder.tsx                 # Form dinámico JSON
│   ├── ApprovalTimeline.tsx            # Timeline visual
│   ├── SignaturePad.tsx                # Canvas para firma
│   ├── RequestDetail.tsx               # Accordion de detalles
│   ├── RequestTable.tsx                # Tabla de solicitudes
│   ├── Header.tsx                      # Nav + usuario
│   └── ui/
│       ├── Button.tsx                  # Botón genérico
│       └── Badge.tsx                   # Estado badge
├── hooks/
│   ├── useAuth.tsx                     # Context autenticación
│   └── useApi.ts                       # Hooks SWR para API
├── lib/
│   ├── supabase.ts                     # Cliente Supabase
│   └── api.ts                          # Funciones fetch
├── package.json
└── tsconfig.json
```

#### Páginas Disponibles

**Públicas:**
- `/login` - Login y registro con Supabase Auth

**Autenticado - Solicitante:**
- `/dashboard` - Overview con estadísticas
- `/formatos` - Listado de formatos disponibles
- `/formulario/:id` - Formulario dinámico
- `/solicitud/:id` - Detalle y seguimiento
- `/mis-solicitudes` - Mis trámites con filtros

**Autenticado - Aprobador:**
- `/aprobaciones` - Panel de revisión

#### Componentes Principales

**FormBuilder.tsx**
```tsx
- Genera formularios desde JSON schema
- Tipos soportados: text, textarea, number, date, repeater
- Validación en tiempo real
- Manejo de arreglos dinámicos (estudiantes, itinerarios)
```

**ApprovalTimeline.tsx**
```tsx
- Timeline visual del flujo
- Estados: pending, approved, rejected
- Muestra comentarios y firmas
- Iconos y colores por estado
```

**SignaturePad.tsx**
```tsx
- Canvas para dibujar firma
- Convierte a Base64
- Botones: Limpiar, Cancelar, Guardar
```

**RequestTable.tsx**
```tsx
- Tabla responsive de solicitudes
- Click para ver detalle
- Filtrado por estado
- Loading state
```

### Instalación y Ejecución

```bash
cd frontend

# 1. Instalar dependencias
npm install

# 2. Crear .env.local
echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key" >> .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3000/api" >> .env.local

# 3. Desarrollo (puerto 3001 o siguiente disponible)
npm run dev

# 4. Producción
npm run build
npm start
```

#### Features

✅ **Autenticación**
- Login/Signup con email y password
- Gestión de sesión automática
- Context API para estado global

✅ **Formularios Dinámicos**
- Generación desde JSON schema
- Validación en tiempo real
- Campos repeater (arrays dinámicos)

✅ **Flujo de Aprobación**
- Timeline visual
- Comentarios por aprobador
- Firmas digitales integradas

✅ **Diseño Responsive**
- Mobile-first
- Tailwind CSS utility-first
- Componentes adaptables

✅ **Data Fetching**
- SWR para caching automático
- Loading states
- Error handling

---

## 🔒 4. SEGURIDAD

### Autenticación
- **JWT Tokens** vía Supabase Auth
- **Session Management** automático
- **Password Hashing** en servidor

### Row Level Security (RLS)
```sql
✅ Usuarios ven solo sus solicitudes
✅ Aprobadores ven solicitudes asignadas
✅ Formatos solo activos son visibles
✅ Auditoría filtrada por usuario
```

### Validaciones
- **Server-side** en todos los endpoints
- **Type checking** con TypeScript
- **Schema validation** con Zod
- **Request sanitization**

### Logging
- **Auditoría completa** de todas las acciones
- **Timestamps** automáticos
- **User tracking** para compliance

---

## 📊 5. FLUJO DE APROBACIÓN

### Estados de una Solicitud
```
1. draft          → Editando (usuario)
2. in_review      → En aprobación (aprobadores)
3. approved       → Aprobada (finalizada)
4. rejected       → Rechazada (vuelve a draft)
5. cancelled      → Cancelada por usuario
```

### Proceso de Aprobación Multinivel
```
1. Usuario completa formulario y lo envía
2. Se crean automáticamente aprobaciones según schema
3. Aprobador 1 revisa y aprueba/rechaza
4. Si aprueba → Aprobador 2, etc.
5. Si rechaza → Solicitud vuelve a draft
6. Si todos aprueban → Status = approved
```

### API de Aprobación
```
POST /api/requests/:id/review
{
  "approval_id": "uuid",
  "comment": "Aprobado, procede",
  "signature_url": "data:image/png;base64,..."
}

PUT /api/requests/:id/review
{
  "approval_id": "uuid",
  "comment": "Falta documentación"
}
```

---

## 📄 6. GENERACIÓN DE PDF

### Características
```
✅ Generación automática de PDFs
✅ Datos dinámicos desde JSON
✅ Header con logo institucional
✅ Footer con metadata
✅ Almacenamiento en Supabase Storage
✅ URL pública para descargar
```

### Endpoint
```
POST /api/requests/:id/documents

Response:
{
  "pdf_url": "https://storage.supabase.co/..."
}
```

---

## 🚀 7. FLUJO COMPLETO (Ejemplo)

### Caso: Solicitud de Transporte

1. **Usuario accede**
   - `/login` → Inicia sesión

2. **Ve formatos**
   - `/formatos` → Listado de formatos
   - Selecciona "Solicitud de Transporte"

3. **Completa formulario**
   - `/formulario/format-id` → Formulario dinámico
   - Ingresa: motivo, fecha, destino, estudiantes
   - Guarda como borrador

4. **Envía solicitud**
   - Revisa datos
   - Hace clic "Enviar Solicitud"
   - Status cambia a `in_review`

5. **Aprobador revisa**
   - `/aprobaciones` → Ve solicitud pendiente
   - Revisa datos y aprobaciones
   - Ingresa comentario y firma digital
   - Hace clic "Aprobar"

6. **Generación de PDF**
   - `/solicitud/request-id` → Botón "Descargar PDF"
   - Sistema genera PDF con datos capturados
   - Usuario descarga documento oficial

7. **Auditoría**
   - Todas las acciones quedan registradas
   - Historial completo disponible

---

## 📋 8. FORMATOS PRECONFIGURADOS

### 1. Solicitud de Transporte
```json
{
  "title": "Solicitud de Transporte",
  "fields": [
    { "id": "motivo", "type": "textarea", ... },
    { "id": "fecha_viaje", "type": "date", ... },
    { "id": "estudiantes", "type": "repeater", ... }
  ]
}
```

### 2. Lista Autorizada de Estudiantes
```json
{
  "title": "Lista Autorizada de Estudiantes",
  "fields": [
    { "id": "actividad", "type": "text", ... },
    { "id": "fecha_actividad", "type": "date", ... },
    { "id": "lista_estudiantes", "type": "repeater", ... }
  ]
}
```

---

## 🔧 9. CONFIGURACIÓN Y DESPLIEGUE

### Requisitos Previos
- Node.js 18+
- Cuenta Supabase (gratis en supabase.com)
- Git

### Variables de Entorno

**Backend (.env.local)**
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Despliegue en Vercel

**Backend (Next.js API)**
```bash
# 1. Push a GitHub
git push origin main

# 2. En Vercel dashboard
# - Conectar repositorio
# - Seleccionar rama main
# - Agregar variables de entorno (SUPABASE_*)
# - Deploy automático
```

**Frontend (Next.js App)**
```bash
# Mismo proceso en otra aplicación Vercel
# O en el mismo proyecto en carpeta separada
```

### Despliegue en Producción

```bash
# Backend
npm run build
npm start

# Frontend
npm run build
npm start
```

---

## 📞 10. VARIABLES Y CREDENCIALES SUPABASE

### Obtener Credenciales

1. Entra en tu proyecto Supabase
2. Settings → API
3. Copia:
   - **NEXT_PUBLIC_SUPABASE_URL** (Project URL)
   - **NEXT_PUBLIC_SUPABASE_ANON_KEY** (anon key)
   - **SUPABASE_SERVICE_ROLE_KEY** (service_role key)

### Crear Buckets en Storage

```bash
# En Supabase Dashboard → Storage
# 1. Crear bucket: "documents"
# 2. Crear bucket: "signatures"
# 3. Hacer públicos (Public bucket)
```

---

## 🧪 11. TESTING Y VALIDACIÓN

### Usuarios de Prueba

```
Email: test@example.com
Contraseña: password123
Rol: Solicitante

Email: approver@example.com
Contraseña: password123
Rol: Aprobador
```

### Flujo de Prueba Completo

1. **Login** como solicitante
2. **Crear solicitud** desde formulario
3. **Guardar como borrador**
4. **Enviar solicitud**
5. **Login** como aprobador
6. **Revisar y aprobar** con firma
7. **Generar PDF** desde detalle
8. **Verificar auditoría** (logs)

---

## 📝 12. ESTRUCTURA FINAL DEL PROYECTO

```
HACK/
├── 001_database_schema.sql                    # SQL Supabase
├── backend/                                   # API Next.js
│   ├── pages/api/                            # Endpoints
│   ├── lib/                                  # Servicios
│   ├── package.json
│   └── tsconfig.json
├── frontend/                                  # App Next.js
│   ├── app/                                  # Páginas
│   ├── components/                           # Componentes
│   ├── hooks/                                # Custom hooks
│   ├── lib/                                  # Utilidades
│   ├── package.json
│   └── tsconfig.json
├── README.md                                 # Este archivo
└── SETUP_GUIDE.md                           # Guía de configuración
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [x] Base de datos SQL con todas las tablas
- [x] Row Level Security (RLS) configurado
- [x] API backend con todos los endpoints
- [x] Autenticación JWT integrada
- [x] Logging de auditoría automático
- [x] Frontend con todas las páginas
- [x] Form Builder dinámico
- [x] Flujo de aprobaciones
- [x] Generación de PDFs
- [x] Firmas digitales
- [x] Componentes reutilizables
- [x] Validaciones completas
- [x] Responsive design
- [x] Documentación completa

---

## 🎯 PRÓXIMAS MEJORAS

- [ ] Notificaciones por email
- [ ] Dark mode
- [ ] Exportación a Excel
- [ ] Búsqueda avanzada
- [ ] Descarga de auditoría
- [ ] Roles granulares
- [ ] Multi-idioma
- [ ] Estadísticas avanzadas

---

## 📧 SOPORTE

Para preguntas o problemas:
1. Revisa la documentación específica en cada carpeta
2. Verifica el archivo README en backend/ y frontend/
3. Consulta la base de datos en Supabase Dashboard

---

**Sistema completamente funcional y listo para producción** ✨
