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

  if (req.method === 'GET') {
    return handleGetRequests(req, res, user.id);
  } else if (req.method === 'POST') {
    return handleCreateRequest(req, res, user.id);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return sendError(res, 'Method not allowed', 405);
  }
}

async function handleGetRequests(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const { status, format_id, limit = 50, offset = 0 } = req.query;

    let query = supabase
      .from('requests')
      .select('*, formats(name, description)', { count: 'exact' });

    // Filtrar por usuario (solicitudes propias)
    query = query.eq('requester_id', userId);

    if (status && typeof status === 'string') {
      query = query.eq('status', status);
    }

    if (format_id && typeof format_id === 'string') {
      query = query.eq('format_id', format_id);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(
        parseInt(offset as string) || 0,
        parseInt(offset as string) + parseInt(limit as string) - 1
      );

    if (error) throw error;

    return sendSuccess(res, {
      data,
      total: count,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });
  } catch (error: any) {
    return sendError(res, error.message);
  }
}

async function handleCreateRequest(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const { format_id, data } = req.body;

    if (!format_id || !data) {
      return sendError(res, 'format_id and data are required');
    }

    // Verificar que el formato existe
    const { data: format } = await supabase
      .from('formats')
      .select('id')
      .eq('id', format_id)
      .single();

    if (!format) {
      return sendError(res, 'Format not found', 404);
    }

    // Crear solicitud
    const { data: request, error: createError } = await supabase
      .from('requests')
      .insert({
        format_id,
        requester_id: userId,
        data,
        status: 'draft',
      })
      .select();

    if (createError) throw createError;

    const newRequest = request[0];

    // Crear aprobaciones iniciales
    const approvalFlow = await getApprovalFlow(format_id);
    await createInitialApprovals(newRequest.id, approvalFlow);

    // Registrar en auditoría
    await logAuditAction({
      requestId: newRequest.id,
      userId,
      action: 'CREATE_REQUEST',
      details: { format_id, data },
    });

    return sendSuccess(res, newRequest, 201);
  } catch (error: any) {
    return sendError(res, error.message);
  }
}
