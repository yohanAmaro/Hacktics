import { supabase } from './auth';

/**
 * Guardar firma digital de usuario
 */
export async function saveSignature(
  userId: string,
  signatureImageUrl: string,
  certificateUrl?: string
) {
  const { data, error } = await supabase
    .from('signatures')
    .insert({
      user_id: userId,
      signature_image_url: signatureImageUrl,
      certificate_url: certificateUrl,
    })
    .select();

  if (error) throw error;
  return data[0];
}

/**
 * Obtener firma actual del usuario
 */
export async function getUserSignature(userId: string) {
  const { data, error } = await supabase
    .from('signatures')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data || null;
}

/**
 * Verificar si usuario tiene firma registrada
 */
export async function hasSignature(userId: string): Promise<boolean> {
  const sig = await getUserSignature(userId);
  return sig !== null;
}
