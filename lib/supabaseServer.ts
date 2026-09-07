// lib/supabaseServer.ts
// Helper to create a Supabase client for Edge/Server environments using @supabase/server
// This client validates incoming JWTs and provides a server‑side context.

import { createClient } from '@supabase/server';

/**
 * Returns a Supabase client configured for the current request.
 * The client automatically extracts the auth token from the request headers.
 */
export const supabaseServer = createClient({
  url: process.env.SUPABASE_URL!,
  // The service role key is NOT needed here – the library validates the JWT from the request.
  // The anon/public key is used for public requests; the library will replace it with the user`s token when present.
  // If you need privileged access in the server, you can supply the service role key explicitly:
  // serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
});
