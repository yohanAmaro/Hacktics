import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, verifyAuth, sendSuccess, sendError } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Verificar autenticación
  const user = await verifyAuth(req);
  if (!user) {
    return sendError(res, 'Unauthorized', 401);
  }

  if (req.method === 'GET') {
    return handleGetFormats(req, res);
  } else if (req.method === 'POST') {
    return handleCreateFormat(req, res, user.id);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return sendError(res, 'Method not allowed', 405);
  }
}

async function handleGetFormats(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data, error } = await supabase
      .from('formats')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return sendSuccess(res, data);
  } catch (error: any) {
    return sendError(res, error.message);
  }
}

async function handleCreateFormat(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const { name, description, schema, pdf_template_url } = req.body;

    if (!name || !schema) {
      return sendError(res, 'Name and schema are required');
    }

    const { data, error } = await supabase
      .from('formats')
      .insert({
        name,
        description,
        schema,
        pdf_template_url,
      })
      .select();

    if (error) throw error;

    return sendSuccess(res, data[0], 201);
  } catch (error: any) {
    return sendError(res, error.message);
  }
}
