import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, verifyAuth, sendSuccess, sendError } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id) {
    return sendError(res, 'ID is required');
  }

  if (req.method === 'GET') {
    return handleGetFormat(req, res, id as string);
  } else if (req.method === 'PUT') {
    const user = await verifyAuth(req);
    if (!user) return sendError(res, 'Unauthorized', 401);
    return handleUpdateFormat(req, res, id as string);
  } else if (req.method === 'DELETE') {
    const user = await verifyAuth(req);
    if (!user) return sendError(res, 'Unauthorized', 401);
    return handleDeleteFormat(req, res, id as string);
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return sendError(res, 'Method not allowed', 405);
  }
}

async function handleGetFormat(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const { data, error } = await supabase
      .from('formats')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return sendError(res, 'Format not found', 404);
      }
      throw error;
    }

    return sendSuccess(res, data);
  } catch (error: any) {
    return sendError(res, error.message);
  }
}

async function handleUpdateFormat(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  try {
    const { name, description, schema, pdf_template_url, active } = req.body;

    const { data, error } = await supabase
      .from('formats')
      .update({
        name,
        description,
        schema,
        pdf_template_url,
        active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return sendError(res, 'Format not found', 404);
    }

    return sendSuccess(res, data[0]);
  } catch (error: any) {
    return sendError(res, error.message);
  }
}

async function handleDeleteFormat(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  try {
    const { error } = await supabase
      .from('formats')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return sendSuccess(res, { message: 'Format deleted successfully' });
  } catch (error: any) {
    return sendError(res, error.message);
  }
}
