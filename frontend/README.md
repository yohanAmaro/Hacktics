# Frontend - ITP Sistema de Gestión de Trámites

## Estructura del Proyecto

```
frontend/
├── app/
│   ├── layout.tsx                       # Layout raíz
│   ├── page.tsx                         # Home (redirige a dashboard o login)
│   ├── login/
│   │   └── page.tsx                     # Página de login/registro
│   ├── dashboard/
│   │   └── page.tsx                     # Dashboard principal
│   ├── formatos/
│   │   └── page.tsx                     # Listado de formatos
│   ├── formulario/
│   │   └── [id]/
│   │       └── page.tsx                 # Formulario dinámico
│   ├── solicitud/
│   │   └── [id]/
│   │       └── page.tsx                 # Detalle de solicitud
│   ├── mis-solicitudes/
│   │   └── page.tsx                     # Listado de solicitudes del usuario
│   ├── aprobaciones/
│   │   └── page.tsx                     # Panel de aprobaciones
│   └── globals.css                      # Estilos globales
├── components/
│   ├── FormBuilder.tsx                  # Constructor de formularios dinámicos
│   ├── ApprovalTimeline.tsx             # Timeline de aprobaciones
│   ├── SignaturePad.tsx                 # Pad de firma digital
│   ├── RequestDetail.tsx                # Detalle de solicitud
│   ├── RequestTable.tsx                 # Tabla de solicitudes
│   ├── Header.tsx                       # Encabezado/navegación
│   └── ui/
│       ├── Button.tsx                   # Componente Button
│       └── Badge.tsx                    # Componente Badge
├── hooks/
│   ├── useAuth.tsx                      # Hook de autenticación
│   └── useApi.ts                        # Hooks de API (SWR)
├── lib/
│   ├── supabase.ts                      # Cliente Supabase
│   └── api.ts                           # Funciones para llamadas API
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── .env.local.example
```

## Variables de Entorno

Crear archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

## Páginas Disponibles

### Autenticación
- `/login` - Login y registro

### Solicitante
- `/dashboard` - Dashboard principal
- `/formatos` - Listado de formatos disponibles
- `/formulario/:id` - Formulario dinámico
- `/solicitud/:id` - Detalle de solicitud
- `/mis-solicitudes` - Mis solicitudes con filtros

### Aprobador
- `/aprobaciones` - Panel de aprobaciones pendientes

## Características

✅ **Autenticación**
- Login/Registro con Supabase Auth
- Gestión de sesiones
- Context API para estado global

✅ **Formularios Dinámicos**
- Generación automática desde JSON schema
- Campos: text, textarea, number, date, repeater
- Validación en tiempo real

✅ **Flujo de Aprobación**
- Timeline visual del proceso
- Estados: pending, approved, rejected
- Comentarios y firmas digitales

✅ **Gestión de Solicitudes**
- Crear borrador
- Enviar solicitud
- Ver estado y aprobaciones
- Generar PDF

✅ **UI Moderna**
- TailwindCSS responsive
- Dark/Light mode ready
- Mobile-first design
- Componentes reutilizables

## Tecnologías

- Next.js 14 (App Router)
- React 18
- Supabase (Auth + Client)
- TailwindCSS
- SWR (Data fetching)
- TypeScript
- Lucide Icons
