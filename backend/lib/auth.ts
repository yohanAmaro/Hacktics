import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Verificar token JWT
export async function verifyAuth(req: NextApiRequest) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error) return null;
    return data.user;
  } catch {
    return null;
  }
}

// Response handlers
export function sendSuccess(res: NextApiResponse, data: any, status = 200) {
  res.status(status).json({ success: true, data });
}

export function sendError(res: NextApiResponse, message: string, status = 400) {
  res.status(status).json({ success: false, error: message });
}
