import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabase: any = null;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (e) {
  console.warn('Supabase not configured properly');
}

// Interfaz para usuario
export interface User {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
}

// Obtener usuario actual
export async function getCurrentUser(): Promise<User | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    return data.user as User;
  } catch {
    return null;
  }
}

// Login
export async function login(email: string, password: string) {
  if (!supabase) throw new Error('Supabase not configured');
  return supabase.auth.signInWithPassword({ email, password });
}

// Sign up
export async function signup(email: string, password: string, metadata?: any) {
  if (!supabase) throw new Error('Supabase not configured');
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
}

// Logout
export async function logout() {
  if (!supabase) return { error: null };
  return supabase.auth.signOut();
}

// Obtener token actual
export async function getAuthToken(): Promise<string | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) return null;
    return data.session.access_token;
  } catch {
    return null;
  }
}
