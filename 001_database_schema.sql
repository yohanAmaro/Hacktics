-- ============================================================================
-- ITP Sistema Digital de Gestión de Trámites
-- Base de datos completa para Supabase
-- ============================================================================

-- ============================================================================
-- 1. TABLA: formats (Formatos disponibles)
-- ============================================================================
CREATE TABLE IF NOT EXISTS formats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  schema JSONB NOT NULL DEFAULT '{}',
  pdf_template_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE formats IS 'Almacena definiciones de formatos dinámicos (Solicitud de Transporte, Lista de Estudiantes, etc.)';
COMMENT ON COLUMN formats.schema IS 'Estructura JSON que define los campos del formulario';

-- ============================================================================
-- 2. TABLA: requests (Solicitudes/Trámites)
-- ============================================================================
CREATE TABLE IF NOT EXISTS requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  format_id UUID NOT NULL REFERENCES formats(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'in_review', 'approved', 'rejected', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE requests IS 'Almacena todas las solicitudes/trámites realizados';
COMMENT ON COLUMN requests.data IS 'Datos capturados en el formulario dinámico en formato JSON';

-- ============================================================================
-- 3. TABLA: approvals (Flujo de aprobaciones multinivel)
-- ============================================================================
CREATE TABLE IF NOT EXISTS approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  step INTEGER NOT NULL,
  approver_id UUID,
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  comment TEXT,
  signature_url TEXT,
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE approvals IS 'Gestiona el flujo de aprobaciones con múltiples niveles';
COMMENT ON COLUMN approvals.step IS 'Número de paso en el flujo de aprobación (1, 2, 3...)';

-- ============================================================================
-- 4. TABLA: signatures (Firmas digitales)
-- ============================================================================
CREATE TABLE IF NOT EXISTS signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  signature_image_url TEXT NOT NULL,
  certificate_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE signatures IS 'Almacena firmas digitales de usuarios';

-- ============================================================================
-- 5. TABLA: audit_logs (Registro de auditoría)
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE audit_logs IS 'Registro de auditoría de todas las acciones sobre solicitudes';

-- ============================================================================
-- 6. TABLA: generated_documents (Documentos generados)
-- ============================================================================
CREATE TABLE IF NOT EXISTS generated_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  document_type TEXT DEFAULT 'pdf',
  created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE generated_documents IS 'Almacena PDFs y documentos generados desde solicitudes';

-- ============================================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================================================

-- Índice en requests.status para filtrados rápidos
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);

-- Índice en requests.format_id para búsquedas por formato
CREATE INDEX IF NOT EXISTS idx_requests_format_id ON requests(format_id);

-- Índice en requests.requester_id para ver solicitudes del usuario
CREATE INDEX IF NOT EXISTS idx_requests_requester_id ON requests(requester_id);

-- Índice en approvals.request_id para obtener aprobaciones de una solicitud
CREATE INDEX IF NOT EXISTS idx_approvals_request_id ON approvals(request_id);

-- Índice en approvals.approver_id para ver aprobaciones asignadas
CREATE INDEX IF NOT EXISTS idx_approvals_approver_id ON approvals(approver_id);

-- Índice en approvals.status para filtrar pendientes
CREATE INDEX IF NOT EXISTS idx_approvals_status ON approvals(status);

-- Índice en audit_logs.request_id para historial
CREATE INDEX IF NOT EXISTS idx_audit_logs_request_id ON audit_logs(request_id);

-- Índice en audit_logs.user_id para auditoría por usuario
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);

-- Índice en generated_documents.request_id
CREATE INDEX IF NOT EXISTS idx_generated_documents_request_id ON generated_documents(request_id);

-- Índice compuesto para búsquedas rápidas de aprobaciones pendientes
CREATE INDEX IF NOT EXISTS idx_approvals_request_status ON approvals(request_id, status);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) - Seguridad a nivel de filas
-- ============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE formats ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;

-- Políticas para FORMATS (todos pueden ver activos)
CREATE POLICY "Formats visible a todos" ON formats
  FOR SELECT USING (active = true);

-- Políticas para REQUESTS
CREATE POLICY "Usuarios ven sus propias solicitudes" ON requests
  FOR SELECT USING (requester_id = auth.uid());

CREATE POLICY "Aprobadores ven solicitudes asignadas" ON requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM approvals 
      WHERE approvals.request_id = requests.id 
      AND approvals.approver_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios pueden crear solicitudes" ON requests
  FOR INSERT WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Usuarios pueden editar solo en draft" ON requests
  FOR UPDATE USING (requester_id = auth.uid() AND status = 'draft');

-- Políticas para APPROVALS
CREATE POLICY "Ver aprobaciones de propias solicitudes" ON approvals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM requests 
      WHERE requests.id = approvals.request_id 
      AND requests.requester_id = auth.uid()
    ) OR approver_id = auth.uid()
  );

CREATE POLICY "Aprobadores actualizan aprobaciones asignadas" ON approvals
  FOR UPDATE USING (approver_id = auth.uid());

-- Políticas para SIGNATURES
CREATE POLICY "Usuarios ven sus propias firmas" ON signatures
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Usuarios crean sus propias firmas" ON signatures
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Políticas para AUDIT_LOGS
CREATE POLICY "Ver auditoría de propias solicitudes" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM requests 
      WHERE requests.id = audit_logs.request_id 
      AND requests.requester_id = auth.uid()
    ) OR user_id = auth.uid()
  );

-- Políticas para GENERATED_DOCUMENTS
CREATE POLICY "Ver documentos de propias solicitudes" ON generated_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM requests 
      WHERE requests.id = generated_documents.request_id 
      AND requests.requester_id = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM approvals 
      WHERE approvals.request_id = generated_documents.request_id 
      AND approvals.approver_id = auth.uid()
    )
  );

-- ============================================================================
-- DATOS INICIALES (Ejemplos de formatos)
-- ============================================================================

-- Formato: Solicitud de Transporte
INSERT INTO formats (name, description, schema, active)
VALUES (
  'Solicitud de Transporte',
  'Formulario para solicitar servicio de transporte institucional',
  '{
    "title": "Solicitud de Transporte",
    "description": "Complete esta solicitud para solicitar transporte institucional",
    "fields": [
      {
        "id": "motivo",
        "label": "Motivo de la solicitud",
        "type": "textarea",
        "required": true,
        "placeholder": "Describa el motivo del transporte..."
      },
      {
        "id": "fecha_viaje",
        "label": "Fecha del viaje",
        "type": "date",
        "required": true
      },
      {
        "id": "hora_salida",
        "label": "Hora de salida",
        "type": "text",
        "required": true,
        "placeholder": "HH:MM"
      },
      {
        "id": "destino",
        "label": "Destino",
        "type": "text",
        "required": true,
        "placeholder": "Ciudad/Localidad"
      },
      {
        "id": "num_personas",
        "label": "Número de personas",
        "type": "number",
        "required": true,
        "min": 1
      },
      {
        "id": "estudiantes",
        "label": "Lista de estudiantes",
        "type": "repeater",
        "required": true,
        "fields": [
          {
            "id": "nombre",
            "label": "Nombre completo",
            "type": "text",
            "required": true
          },
          {
            "id": "matricula",
            "label": "Matrícula",
            "type": "text",
            "required": true
          },
          {
            "id": "carrera",
            "label": "Carrera",
            "type": "text",
            "required": true
          }
        ]
      }
    ]
  }',
  true
) ON CONFLICT DO NOTHING;

-- Formato: Lista Autorizada de Estudiantes
INSERT INTO formats (name, description, schema, active)
VALUES (
  'Lista Autorizada de Estudiantes',
  'Formulario para autorizar lista de estudiantes para eventos/actividades',
  '{
    "title": "Lista Autorizada de Estudiantes",
    "description": "Autorizar estudiantes para participar en actividades",
    "fields": [
      {
        "id": "actividad",
        "label": "Nombre de la actividad",
        "type": "text",
        "required": true,
        "placeholder": "Ej: Conciencia Ambiental"
      },
      {
        "id": "fecha_actividad",
        "label": "Fecha de la actividad",
        "type": "date",
        "required": true
      },
      {
        "id": "ubicacion",
        "label": "Ubicación de la actividad",
        "type": "text",
        "required": true
      },
      {
        "id": "responsable",
        "label": "Responsable de la actividad",
        "type": "text",
        "required": true
      },
      {
        "id": "observaciones",
        "label": "Observaciones",
        "type": "textarea",
        "required": false,
        "placeholder": "Notas adicionales..."
      },
      {
        "id": "lista_estudiantes",
        "label": "Estudiantes autorizados",
        "type": "repeater",
        "required": true,
        "fields": [
          {
            "id": "nombre",
            "label": "Nombre del estudiante",
            "type": "text",
            "required": true
          },
          {
            "id": "matricula",
            "label": "Matrícula",
            "type": "text",
            "required": true
          },
          {
            "id": "carrera",
            "label": "Carrera",
            "type": "text",
            "required": true
          },
          {
            "id": "semestre",
            "label": "Semestre",
            "type": "number",
            "required": true,
            "min": 1,
            "max": 8
          }
        ]
      }
    ]
  }',
  true
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================
