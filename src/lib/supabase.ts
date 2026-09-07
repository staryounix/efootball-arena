import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  '';

const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  '';

const supabaseSecretKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';


// Client-side / public Supabase client
export const supabase = createClient(supabaseUrl, supabasePublishableKey);

// Server-side admin Supabase client (used in route handlers, edge functions, user verification)
export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Helper to get the admin client safely
 */
export function getSupabaseAdmin() {
  return supabaseAdmin;
}

/**
 * Verifies a Supabase JWT / access token and returns the authenticated user
 */
export async function verifySupabaseToken(token: string) {
  try {
    const client = supabaseAdmin || supabase;
    const { data, error } = await client.auth.getUser(token);
    if (error || !data.user) {
      return null;
    }
    return data.user;
  } catch {
    return null;
  }
}
