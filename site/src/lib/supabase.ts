import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Client Supabase optionnel.
 * Seule la clé publique "anon" est utilisée côté navigateur.
 * La clé "service_role" ne doit JAMAIS être placée dans ce projet frontend.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey, { auth: { persistSession: false } }) : null;

export const isSupabaseEnabled = supabase !== null;
