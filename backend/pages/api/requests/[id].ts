import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, verifyAuth, sendSuccess, sendError } from '@/lib/auth';
import { logAuditAction } from '@/lib/audit';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await verifyAuth(req);
  if (!user) {
    return sendError(res, 'Unauthorized', 401);
  }

  const { id } = req.query;

  if (!id) {
    return sendError(res, 'ID is required');
  }

  if (req.method === 'GET') {
    return handleGetRequest(req, res, id as string, user.id);
  } else if (req.method === 'PUT') {
    return handleUpdateRequest(req, res, id as string, user.id);
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    return sendError(res, 'Method not allowed', 405);
  }
}

async function handleGetRequest(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string,
  userId: string
) {
  try {
    const { data, error } = await supabase
      .from('requests')
      .select('*, formats(name, description, schema)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return sendError(res, 'Request not found', 404);
      }
      throw error;
    }

    // Verificar permisos
    if (data.requester_id !== userId) {
      return sendError(res, 'Forbidden', 403);
    }

    return sendSuccess(res, data);
  } catch (error: any) {
    return sendError(res, error.message);
  }
}

async function handleUpdateRequest(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string,
  userId: string
) {
  try {
    const { data: requestData } = req.body;

    // Obtener solicitud actual
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
      return sendError(res, 'Can only update requests in draft status', 400);
    }

    // Actualizar solicitud
    const { data: updated, error: updateError } = await supabase
      .from('requests')
      .update({
        data: requestData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select();

    if (updateError) throw updateError;

    // Registrar auditoría
    await logAuditAction({
      requestId: id,
      userId,
      action: 'UPDATE_REQUEST',
      details: { data: requestData },
    });

    return sendSuccess(res, updated[0]);
  } catch (error: any) {
    return sendError(res, error.message);
  }
}
