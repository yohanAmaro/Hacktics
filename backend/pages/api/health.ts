import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Crear cliente con service role para operaciones de servidor
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verificar conexión a Supabase
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      return res.status(500).json({ 
        error: 'Database connection failed',
        details: error.message 
      });
    }

    return res.status(200).json({ 
      status: 'ok',
      message: 'Backend is running and connected to Supabase',
      userCount: data?.users?.length || 0
    });
  } catch (error: any) {
    return res.status(500).json({ 
      error: 'Health check failed',
      details: error.message 
    });
  }
}
