# 🏗️ ARQUITECTURA DEL SISTEMA

## Diagrama General

```
┌─────────────────────────────────────────────────────────────┐
│                     USUARIO FINAL                           │
│                   (Web o Móvil)                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│               FRONTEND (Next.js App Router)                 │
│                  http://localhost:3001                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Pages:                                              │   │
│  │  - /login          (Auth)                           │   │
│  │  - /dashboard      (Overview)                       │   │
│  │  - /formatos       (Formato list)                   │   │
│  │  - /formulario/:id (Dynamic form)                   │   │
│  │  - /solicitud/:id  (Detail + Timeline)             │   │
│  │  - /mis-solicitudes (My requests)                   │   │
│  │  - /aprobaciones   (Approver panel)                │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Components:                                         │   │
│  │  - FormBuilder      (Dynamic forms from JSON)       │   │
│  │  - ApprovalTimeline (Visual workflow)               │   │
│  │  - SignaturePad     (Digital signature)             │   │
│  │  - RequestTable     (Searchable list)               │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Technologies:                                       │   │
│  │  - React 18                                         │   │
│  │  - TailwindCSS                                      │   │
│  │  - SWR (Data fetching)                              │   │
│  │  - Supabase Client                                  │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS / REST API
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│               BACKEND (Next.js API Routes)                  │
│                  http://localhost:3000/api                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Endpoints:                                          │   │
│  │  - /formats          (CRUD)                         │   │
│  │  - /requests         (CRUD)                         │   │
│  │  - /requests/:id/submit                            │   │
│  │  - /requests/:id/approvals                         │   │
│  │  - /requests/:id/review    (Approve/Reject)        │   │
│  │  - /requests/:id/documents (PDF gen)               │   │
│  │  - /signatures       (Digital sig)                  │   │
│  │  - /approvals/pending                              │   │
│  │  - /health           (Health check)                │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Services:                                           │   │
│  │  - auth.ts          (JWT verification)              │   │
│  │  - approvals.ts     (Workflow logic)                │   │
│  │  - audit.ts         (Logging)                       │   │
│  │  - storage.ts       (File uploads)                  │   │
│  │  - pdf.ts           (PDF generation)                │   │
│  │  - signatures.ts    (Digital signatures)            │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Technologies:                                       │   │
│  │  - Next.js 14                                       │   │
│  │  - TypeScript                                       │   │
│  │  - Supabase JS SDK                                  │   │
│  │  - PDFKit                                           │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ SDK / REST API
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE CLOUD                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Authentication (Auth)                              │   │
│  │  - JWT Token generation                            │   │
│  │  - User sessions                                   │   │
│  │  - Email verification                              │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Database (PostgreSQL)                              │   │
│  │  - formats            (Form definitions)            │   │
│  │  - requests           (Submitted requests)          │   │
│  │  - approvals          (Approval workflow)           │   │
│  │  - signatures         (Digital signatures)          │   │
│  │  - audit_logs         (Action history)              │   │
│  │  - generated_documents (PDF files)                  │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Storage (S3-compatible)                            │   │
│  │  - documents/         (Generated PDFs)              │   │
│  │  - signatures/        (Signature images)            │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Row Level Security (RLS)                           │   │
│  │  - User isolation                                   │   │
│  │  - Role-based access                               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Flujo de Datos

### 1. Crear Solicitud

```
Usuario
   │
   ▼ POST /formulario
FormBuilder (Frontend)
   │
   ▼ POST /api/requests
Backend API
   │
   ├─→ Validar datos
   ├─→ Crear request en DB
   ├─→ Crear approvals iniciales
   └─→ Registrar en audit_logs
   │
   ▼
Supabase DB
   │
   ├─→ requests.INSERT
   ├─→ approvals.INSERT
   └─→ audit_logs.INSERT
```

### 2. Flujo de Aprobación

```
Aprobador
   │
   ▼ GET /aprobaciones
Backend: /api/approvals/pending
   │
   ├─→ SELECT approvals WHERE approver_id = user
   └─→ JOIN requests, formats
   │
   ▼
Approval Timeline (Frontend)
   │
   ▼ POST /api/requests/:id/review
Backend API
   │
   ├─→ Verificar aprobador
   ├─→ Actualizar approval status
   ├─→ Registrar firma digital
   ├─→ Verificar si hay más aprobaciones
   └─→ Actualizar status de request si completo
   │
   ▼
Supabase DB (Transactions)
   │
   ├─→ approvals.UPDATE
   ├─→ requests.UPDATE
   ├─→ audit_logs.INSERT
   └─→ signatures.INSERT
```

### 3. Generar PDF

```
Usuario
   │
   ▼ POST /api/requests/:id/documents
Backend API
   │
   ├─→ GET request + data
   ├─→ Renderizar con PDFKit
   │  ├─→ Header institucional
   │  ├─→ Datos dinámicos
   │  └─→ Footer
   ├─→ Subir a Storage
   └─→ Guardar URL en DB
   │
   ▼
Supabase Storage
   │
   ├─→ documents/request-id/uuid.pdf
   └─→ Generar URL pública
   │
   ▼
Frontend: user downloads
```

---

## 🔐 Seguridad

### Capas de Seguridad

```
1. Frontend
   ├─→ Validación de inputs
   ├─→ HTTPS only
   └─→ Token en localStorage

2. Backend
   ├─→ JWT verification
   ├─→ Request validation
   ├─→ Type checking (TypeScript)
   └─→ Input sanitization

3. Database
   ├─→ Row Level Security (RLS)
   ├─→ Encrypted passwords
   ├─→ Foreign key constraints
   └─→ Audit logging

4. Storage
   ├─→ Signed URLs
   ├─→ Time-limited access
   └─→ Private/Public buckets
```

### Row Level Security Policies

```sql
-- formats: Solo activos
SELECT active = true

-- requests: Usuario ve las suyas
SELECT requester_id = auth.uid()

-- approvals: Aprobador ve asignadas
SELECT approver_id = auth.uid()

-- audit_logs: Usuario ve sus acciones
SELECT user_id = auth.uid()
```

---

## 📦 Componentes Reutilizables

```
ui/
├── Button.tsx
│   ├── Props: variant, size, loading
│   └── Variants: primary, secondary, danger
│
├── Badge.tsx
│   ├── Props: status, variant
│   └── Statuses: draft, in_review, approved, rejected
│
├── Input.tsx
│   ├── Text input reutilizable
│   └── Con validación
│
└── Modal.tsx
    ├── Para firmas digitales
    └── Para confirmaciones

components/
├── FormBuilder.tsx
│   ├── Genera forms desde JSON
│   ├── Tipos: text, textarea, number, date, repeater
│   └── Manejo de arrays dinámicos
│
├── ApprovalTimeline.tsx
│   ├── Timeline visual
│   ├── Estados por paso
│   └── Comentarios y firmas
│
├── SignaturePad.tsx
│   ├── Canvas para dibujar
│   ├── Convierte a Base64
│   └── Guarda en DB
│
├── RequestTable.tsx
│   ├── Tabla responsive
│   ├── Con sorting y filtros
│   └── Click para detalles
│
└── RequestDetail.tsx
    ├── Accordion de datos
    ├── Renderiza JSON dinámicamente
    └── Maneja arrays anidados
```

---

## 🔄 Flujo de Estado (Frontend)

```
useAuth (AuthContext)
├── user
├── loading
└── logout()

useRequests (SWR Hook)
├── requests[] (data)
├── loading
├── error
└── mutate() (refresh)

useRequest (SWR Hook)
├── request (single)
├── loading
├── error
└── mutate()

useRequestApprovals (SWR Hook)
├── approvals[]
├── loading
└── error

usePendingApprovals (SWR Hook)
├── approvals[] (for current user)
├── loading
└── mutate()

useUserSignature (SWR Hook)
├── signature
├── loading
└── error
```

---

## 📱 Responsive Design

```
Frontend Strategy:
├── Mobile First
│   ├── Base: 320px
│   └── Stacked layout
│
├── Tablet (md: 768px)
│   ├── 2-column grid
│   └── Side navigation
│
└── Desktop (lg: 1024px)
    ├── 3-4 column grid
    └── Full-width tables

TailwindCSS Breakpoints:
├── sm: 640px
├── md: 768px
├── lg: 1024px
├── xl: 1280px
└── 2xl: 1536px
```

---

## 🎯 Patrones de Diseño Utilizados

### 1. Hook Pattern (React)
```tsx
// Custom hooks para lógica reutilizable
useAuth() - Gestión de autenticación
useApi() - Llamadas API con SWR
useFormBuilder() - Lógica de formularios
```

### 2. Service Layer Pattern
```tsx
// Servicios separados por dominio
lib/supabase.ts - Cliente Supabase
lib/api.ts - Llamadas HTTP
lib/auth.ts - Autenticación JWT
```

### 3. Context API Pattern
```tsx
// AuthProvider para estado global
AuthContext
├── user
├── loading
└── logout
```

### 4. Component Composition
```tsx
// Componentes pequeños y reutilizables
<Button /> - Genérico
<Badge /> - Solo presentación
<FormBuilder /> - Lógica + presentación
```

---

## 📊 Base de Datos - Relaciones

```
formats (1)
   │
   ├──→ (M) requests
   │         │
   │         ├──→ (M) approvals
   │         │         │
   │         │         └──→ (1) signatures
   │         │
   │         ├──→ (M) audit_logs
   │         │
   │         └──→ (M) generated_documents
   │
   └──→ (1) approval_flow (en schema JSONB)

users (Supabase Auth)
   │
   ├──→ (M) requests (requester_id)
   ├──→ (M) approvals (approver_id)
   ├──→ (M) signatures (user_id)
   └──→ (M) audit_logs (user_id)
```

---

## 🚀 Escalabilidad

### Base de Datos
- ✅ Índices en campos frequently queried
- ✅ JSONB para datos flexibles
- ✅ Particionamento automático en Supabase

### Backend
- ✅ Stateless (sin sesiones locales)
- ✅ API routes escalables
- ✅ Service workers para tasks async

### Frontend
- ✅ Code splitting automático Next.js
- ✅ SWR para caching inteligente
- ✅ Lazy loading de componentes

### Storage
- ✅ S3-compatible (infinito)
- ✅ CDN automático
- ✅ Signed URLs con expiración

---

## 🔍 Monitoreo y Debugging

### Backend Logging
```typescript
// Auditoría automática
audit_logs table
├── request_id
├── user_id
├── action (CREATE, UPDATE, APPROVE, etc.)
├── details (JSON)
└── created_at
```

### Frontend Debugging
```typescript
// Errores capturados
- Console errors
- API response errors
- Auth errors
- Validation errors
```

### Supabase Monitoring
```
Dashboard → Logs
├── API logs
├── Auth logs
├── Database query logs
└── Storage access logs
```

---

**Arquitectura moderna, escalable y segura** ✨
