# Backend - ITP Sistema de Gestión de Trámites

## Estructura del Proyecto

```
backend/
├── pages/
│   └── api/
│       ├── health.ts                    # Health check
│       ├── formats/
│       │   ├── index.ts                 # CRUD de formatos
│       │   └── [id].ts                  # GET, PUT, DELETE formato
│       ├── requests/
│       │   ├── index.ts                 # Listar y crear solicitudes
│       │   ├── [id].ts                  # GET y PUT solicitud
│       │   └── [id]/
│       │       ├── submit.ts            # Enviar/aceptar solicitud
│       │       ├── approvals.ts         # Ver aprobaciones
│       │       ├── review.ts            # Aprobar/rechazar
│       │       └── documents.ts         # Generar y listar PDFs
│       ├── signatures/
│       │   └── index.ts                 # Guardar y obtener firma
│       └── approvals/
│           └── pending.ts               # Aprobaciones pendientes
├── lib/
│   ├── auth.ts                          # Autenticación y utilities
│   ├── approvals.ts                     # Lógica de aprobaciones
│   ├── audit.ts                         # Logging de auditoría
│   ├── storage.ts                       # Uploads a Supabase Storage
│   ├── pdf.ts                           # Generación de PDFs
│   └── signatures.ts                    # Gestión de firmas
├── package.json
├── tsconfig.json
└── next.config.js
```

## Variables de Entorno

Crear archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Crear buckets en Supabase (ejecutar una sola vez)
npm run init:storage

# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

## Endpoints API

### Formatos
- `GET /api/formats` - Listar formatos activos
- `GET /api/formats/:id` - Obtener detalles de formato
- `POST /api/formats` - Crear nuevo formato
- `PUT /api/formats/:id` - Actualizar formato
- `DELETE /api/formats/:id` - Eliminar formato

### Solicitudes
- `GET /api/requests` - Listar solicitudes del usuario (con filtros)
- `POST /api/requests` - Crear nueva solicitud
- `GET /api/requests/:id` - Ver detalles de solicitud
- `PUT /api/requests/:id` - Editar solicitud (solo en draft)
- `POST /api/requests/:id/submit` - Enviar solicitud
- `GET /api/requests/:id/approvals` - Ver aprobaciones
- `POST /api/requests/:id/review` - Aprobar solicitud
- `PUT /api/requests/:id/review` - Rechazar solicitud
- `GET /api/requests/:id/documents` - Listar documentos
- `POST /api/requests/:id/documents` - Generar PDF

### Firmas
- `GET /api/signatures` - Obtener firma del usuario
- `POST /api/signatures` - Guardar firma

### Aprobaciones
- `GET /api/approvals/pending` - Aprobaciones pendientes del usuario

## Seguridad

- ✅ Autenticación JWT via Supabase Auth
- ✅ Row Level Security (RLS) en BD
- ✅ Validación de permisos en endpoints
- ✅ Logging automático de auditoría
- ✅ Encriptación de datos sensibles

## Tecnologías

- Next.js 14 (App Router)
- Supabase (Auth + Database + Storage)
- TypeScript
- PDFKit (Generación de PDFs)
- UUID (Identificadores únicos)
