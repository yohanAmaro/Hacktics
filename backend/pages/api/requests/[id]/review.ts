import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, verifyAuth, sendSuccess, sendError } from '@/lib/auth';
import { logAuditAction } from '@/lib/audit';
import { approveRequest, rejectRequest } from '@/lib/approvals';

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

  if (req.method === 'POST') {
    return handleApproveRequest(req, res, id, user.id);
  } else if (req.method === 'PUT') {
    return handleRejectRequest(req, res, id, user.id);
  } else {
    res.setHeader('Allow', ['POST', 'PUT']);
    return sendError(res, 'Method not allowed', 405);
  }
}

async function handleApproveRequest(
  req: NextApiRequest,
  res: NextApiResponse,
  requestId: string,
  userId: string
) {
  try {
    const { approval_id, comment, signature_url } = req.body;

    if (!approval_id) {
      return sendError(res, 'approval_id is required');
    }

    // Obtener aprobación
    const { data: approval } = await supabase
      .from('approvals')
      .select('*')
      .eq('id', approval_id)
      .single();

    if (!approval) {
      return sendError(res, 'Approval not found', 404);
    }

    // Verificar que es el aprobador asignado
    if (approval.approver_id && approval.approver_id !== userId) {
      return sendError(res, 'Forbidden - You are not the assigned approver', 403);
    }

    // Aprobar
    await approveRequest(approval_id, userId, comment || '', signature_url);

    // Registrar auditoría
    await logAuditAction({
      requestId,
      userId,
      action: 'APPROVE_REQUEST',
      details: { approval_id, comment },
    });

    return sendSuccess(res, { message: 'Request approved successfully' });
  } catch (error: any) {
    return sendError(res, error.message);
  }
}

async function handleRejectRequest(
  req: NextApiRequest,
  res: NextApiResponse,
  requestId: string,
  userId: string
) {
  try {
    const { approval_id, comment } = req.body;

    if (!approval_id) {
      return sendError(res, 'approval_id is required');
    }

    // Obtener aprobación
    const { data: approval } = await supabase
      .from('approvals')
      .select('*')
      .eq('id', approval_id)
      .single();

    if (!approval) {
      return sendError(res, 'Approval not found', 404);
    }

    // Verificar que es el aprobador asignado
    if (approval.approver_id && approval.approver_id !== userId) {
      return sendError(res, 'Forbidden - You are not the assigned approver', 403);
    }

    // Rechazar
    await rejectRequest(approval_id, userId, comment || '');

    // Registrar auditoría
    await logAuditAction({
      requestId,
      userId,
      action: 'REJECT_REQUEST',
      details: { approval_id, comment },
    });

    return sendSuccess(res, { message: 'Request rejected successfully' });
  } catch (error: any) {
    return sendError(res, error.message);
  }
}
