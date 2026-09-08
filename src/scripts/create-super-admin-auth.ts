// src/scripts/create-super-admin-auth.ts
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';

// Load Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
if (!supabaseUrl) {
  console.error('❌ supabaseUrl is not set');
  process.exit(1);
}
if (!supabaseServiceKey) {
  console.error('❌ supabaseServiceKey is not set');
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Ensure a Supabase Auth user with SUPER_ADMIN role exists.
 * This script does **not** touch the application `public.users` table
 * to avoid permission issues when a service‑role key is unavailable.
 */
async function ensureSuperAdmin() {
  const adminEmail = 'admin@efootball.arena';
  const adminPhone = '+212604084574';
  const adminPassword = '124578YOUNIx';

  // List existing Auth users (page 1, 100 per page)
  const { data: { users } = {} } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 100,
  });

  const exists = users?.some(u => u.email === adminEmail);
  if (!exists) {
    const { data: created, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      phone: adminPhone,
      user_metadata: { role: 'SUPER_ADMIN' },
    });
    if (error) {
      console.error('⛔️ Failed to create Auth admin user:', error.message);
      process.exit(1);
    }
    console.log('🛠️ Created Auth admin user, id:', created?.user?.id);
  } else {
    console.log('✅ Auth admin user already exists.');
  }

  // Upsert the admin row in the application table (public.users)
  const adminRow = {
    id: crypto.randomBytes(8).toString('hex'),
    username: 'admin',
    email: adminEmail,
    password_hash: bcrypt.hashSync(adminPassword, bcrypt.genSaltSync(10)),
    efootball_id: 'ADMIN001',
    whatsapp: adminPhone,
    balance: 0,
    role: 'SUPER_ADMIN',
    wins: 0,
    losses: 0,
    created_at: new Date().toISOString(),
  };
  const { error: upsertErr } = await supabase.from('users').upsert(adminRow, { onConflict: 'email' });
  if (upsertErr) {
    console.error('⛔️ Failed to upsert admin row into public.users:', upsertErr.message);
    // Not fatal – continue
  } else {
    console.log('🗂️ Upserted SUPER_ADMIN row into public.users.');
  }

}

ensureSuperAdmin();
