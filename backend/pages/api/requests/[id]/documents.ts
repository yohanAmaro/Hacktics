import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, verifyAuth, sendSuccess, sendError } from '@/lib/auth';
import { generateRequestPDF, getGeneratedDocuments } from '@/lib/pdf';

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
    return handleGeneratePDF(req, res, id, user.id);
  } else if (req.method === 'GET') {
    return handleGetDocuments(req, res, id, user.id);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return sendError(res, 'Method not allowed', 405);
  }
}

async function handleGeneratePDF(
  req: NextApiRequest,
  res: NextApiResponse,
  requestId: string,
  userId: string
) {
  try {
    // Obtener solicitud
    const { data: request, error: fetchError } = await supabase
      .from('requests')
      .select('*, formats(name)')
      .eq('id', requestId)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return sendError(res, 'Request not found', 404);
      }
      throw fetchError;
    }

    // Verificar permisos
    if (request.requester_id !== userId) {
      return sendError(res, 'Forbidden', 403);
    }

    // Generar PDF
    const pdfUrl = await generateRequestPDF(
      requestId,
      request.data,
      request.formats.name
    );

    return sendSuccess(res, { pdf_url: pdfUrl }, 201);
  } catch (error: any) {
    return sendError(res, error.message);
  }
}

async function handleGetDocuments(
  req: NextApiRequest,
  res: NextApiResponse,
  requestId: string,
  userId: string
) {
  try {
    // Verificar acceso
    const { data: request } = await supabase
      .from('requests')
      .select('requester_id')
      .eq('id', requestId)
      .single();

    if (!request) {
      return sendError(res, 'Request not found', 404);
    }

    if (request.requester_id !== userId) {
      return sendError(res, 'Forbidden', 403);
    }

    const documents = await getGeneratedDocuments(requestId);
    return sendSuccess(res, documents);
  } catch (error: any) {
    return sendError(res, error.message);
  }
}
