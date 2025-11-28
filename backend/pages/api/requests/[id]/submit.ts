import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, verifyAuth, sendSuccess, sendError } from '@/lib/auth';
import { logAuditAction } from '@/lib/audit';
import { createInitialApprovals, getApprovalFlow } from '@/lib/approvals';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await verifyAuth(req);
  if (!user) {
    return sendError(res, 'Unauthorized', 401);
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return sendError(res, 'ID is required');
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return sendError(res, 'Method not allowed', 405);
  }

  return handleSubmitRequest(req, res, id, user.id);
}

async function handleSubmitRequest(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string,
  userId: string
) {
  try {
    // Obtener solicitud
    const { data: request, error: fetchError } = await supabase
      .from('requests')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return sendError(res, 'Request not found', 404);
      }
      throw fetchError;
    }

    // Verificar permisos y estado
    if (request.requester_id !== userId) {
      return sendError(res, 'Forbidden', 403);
    }

    if (request.status !== 'draft') {
      return sendError(res, 'Can only submit requests in draft status', 400);
    }

    // Cambiar estado a submitted
    const { data: updated, error: updateError } = await supabase
      .from('requests')
      .update({
        status: 'in_review',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select();

    if (updateError) throw updateError;

    // Registrar auditoría
    await logAuditAction({
      requestId: id,
      userId,
      action: 'SUBMIT_REQUEST',
      details: {},
    });

    return sendSuccess(res, updated[0]);
  } catch (error: any) {
    return sendError(res, error.message);
  }
}
