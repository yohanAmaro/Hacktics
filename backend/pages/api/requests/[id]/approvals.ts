import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, verifyAuth, sendSuccess, sendError } from '@/lib/auth';
import { getRequestApprovals } from '@/lib/approvals';

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

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return sendError(res, 'Method not allowed', 405);
  }

  try {
    const approvals = await getRequestApprovals(id);
    return sendSuccess(res, approvals);
  } catch (error: any) {
    return sendError(res, error.message);
  }
}
