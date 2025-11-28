import { supabase } from './auth';

/**
 * Subir archivo a Supabase Storage
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: Buffer | Uint8Array,
  contentType: string
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType,
      upsert: false,
    });

  if (error) throw error;

  // Obtener URL pública
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Eliminar archivo de Supabase Storage
 */
export async function deleteFile(bucket: string, path: string) {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
}

/**
 * Obtener URL pública de un archivo
 */
export function getPublicFileUrl(bucket: string, path: string): string {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
}

/**
 * Crear bucket si no existe
 */
export async function createBucketIfNotExists(bucketName: string) {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    
    const bucketExists = buckets?.some((b) => b.name === bucketName);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, {
        public: true,
      });
    }
  } catch (error) {
    console.error(`Error creating bucket ${bucketName}:`, error);
  }
}
