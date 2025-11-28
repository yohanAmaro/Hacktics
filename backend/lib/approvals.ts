import { supabase } from './auth';

export interface ApprovalFlow {
  steps: Array<{
    step: number;
    role: string;
    description?: string;
  }>;
}

// Obtener flujo de aprobación por formato
export async function getApprovalFlow(formatId: string): Promise<ApprovalFlow> {
  const { data: format } = await supabase
    .from('formats')
    .select('schema')
    .eq('id', formatId)
    .single();

  if (!format) {
    return { steps: [{ step: 1, role: 'coordinator' }] };
  }

  const schema = format.schema as any;
  return schema.approvalFlow || { steps: [{ step: 1, role: 'coordinator' }] };
}

// Crear aprobaciones iniciales
export async function createInitialApprovals(
  requestId: string,
  approvalFlow: ApprovalFlow
) {
  const approvals = approvalFlow.steps.map((step) => ({
    request_id: requestId,
    step: step.step,
    role: step.role,
    approver_id: null,
    status: 'pending',
  }));

  const { error } = await supabase
    .from('approvals')
    .insert(approvals);

  if (error) throw error;
}

// Obtener aprobaciones de una solicitud
export async function getRequestApprovals(requestId: string) {
  const { data, error } = await supabase
    .from('approvals')
    .select('*')
    .eq('request_id', requestId)
    .order('step', { ascending: true });

  if (error) throw error;
  return data;
}

// Aprobar solicitud
export async function approveRequest(
  approvalId: string,
  approverId: string,
  comment: string,
  signatureUrl?: string
) {
  const { data: approval, error: fetchError } = await supabase
    .from('approvals')
    .select('*')
    .eq('id', approvalId)
    .single();

  if (fetchError) throw fetchError;

  const { error: updateError } = await supabase
    .from('approvals')
    .update({
      status: 'approved',
      approver_id: approverId,
      comment,
      signature_url: signatureUrl,
      signed_at: new Date().toISOString(),
    })
    .eq('id', approvalId);

  if (updateError) throw updateError;

  // Verificar si hay más aprobaciones pendientes
  const { data: pendingApprovals } = await supabase
    .from('approvals')
    .select('id')
    .eq('request_id', approval.request_id)
    .eq('status', 'pending');

  // Si no hay más pendientes, marcar solicitud como approved
  if (pendingApprovals && pendingApprovals.length === 0) {
    await supabase
      .from('requests')
      .update({ status: 'approved', updated_at: new Date().toISOString() })
      .eq('id', approval.request_id);
  } else {
    // Cambiar estado a in_review si aún hay aprobaciones
    await supabase
      .from('requests')
      .update({ status: 'in_review', updated_at: new Date().toISOString() })
      .eq('id', approval.request_id);
  }
}

// Rechazar solicitud
export async function rejectRequest(
  approvalId: string,
  approverId: string,
  comment: string
) {
  const { data: approval, error: fetchError } = await supabase
    .from('approvals')
    .select('request_id')
    .eq('id', approvalId)
    .single();

  if (fetchError) throw fetchError;

  // Actualizar aprobación
  const { error: updateError } = await supabase
    .from('approvals')
    .update({
      status: 'rejected',
      approver_id: approverId,
      comment,
      signed_at: new Date().toISOString(),
    })
    .eq('id', approvalId);

  if (updateError) throw updateError;

  // Marcar solicitud como rechazada
  await supabase
    .from('requests')
    .update({ status: 'rejected', updated_at: new Date().toISOString() })
    .eq('id', approval.request_id);
}

// Obtener solicitudes pendientes de aprobación
export async function getPendingApprovals(approverId: string) {
  const { data, error } = await supabase
    .from('approvals')
    .select(`
      id,
      step,
      role,
      status,
      request_id,
      requests(id, format_id, requester_id, status, created_at, data)
    `)
    .eq('approver_id', approverId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
