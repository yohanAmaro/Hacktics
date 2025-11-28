import { supabase } from './auth';

interface AuditLogInput {
  requestId: string;
  userId: string;
  action: string;
  details?: Record<string, any>;
}

/**
 * Registra una acción en el historial de auditoría
 */
export async function logAuditAction(input: AuditLogInput) {
  const { requestId, userId, action, details = {} } = input;

  const { error } = await supabase
    .from('audit_logs')
    .insert({
      request_id: requestId,
      user_id: userId,
      action,
      details,
    });

  if (error) {
    console.error('Error logging audit action:', error);
    // No lanzar error para no bloquear la operación principal
  }
}

/**
 * Obtener historial de auditoría de una solicitud
 */
export async function getAuditLog(requestId: string) {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('request_id', requestId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Obtener historial de auditoría de un usuario
 */
export async function getUserAuditLog(userId: string, limit = 50) {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}
