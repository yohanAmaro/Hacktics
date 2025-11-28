import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, verifyAuth, sendSuccess, sendError } from '@/lib/auth';
import { saveSignature, getUserSignature } from '@/lib/signatures';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await verifyAuth(req);
  if (!user) {
    return sendError(res, 'Unauthorized', 401);
  }

  if (req.method === 'GET') {
    return handleGetSignature(req, res, user.id);
  } else if (req.method === 'POST') {
    return handleSaveSignature(req, res, user.id);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return sendError(res, 'Method not allowed', 405);
  }
}

async function handleGetSignature(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const signature = await getUserSignature(userId);
    return sendSuccess(res, signature);
  } catch (error: any) {
    return sendError(res, error.message);
  }
}

async function handleSaveSignature(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const { signature_image_url, certificate_url } = req.body;

    if (!signature_image_url) {
      return sendError(res, 'signature_image_url is required');
    }

    const signature = await saveSignature(
      userId,
      signature_image_url,
      certificate_url
    );

    return sendSuccess(res, signature, 201);
  } catch (error: any) {
    return sendError(res, error.message);
  }
}
