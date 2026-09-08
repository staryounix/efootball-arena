// src/scripts/create-super-admin.ts
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';

/**
 * Creates a SUPER_ADMIN user if one does not already exist.
 * Admin identification is based on the configured admin WhatsApp number.
 */
async function createSuperAdmin() {
  const adminPhone = '+212604084574';
  // Check if a SUPER_ADMIN already exists with this phone number
  const { data: existing, error: fetchErr } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('whatsapp', adminPhone)
    .eq('role', 'SUPER_ADMIN')
    .limit(1);

  if (fetchErr) {
    console.error('Error checking for existing admin:', fetchErr.message);
    process.exit(1);
  }

  if (existing && existing.length > 0) {
    console.log('SUPER_ADMIN already exists with ID:', existing[0].id);
    return;
  }

  // Generate a deterministic admin ID for reproducibility
  const id = 'admin_' + crypto.randomBytes(6).toString('hex');
  const username = 'admin';
  const email = 'admin@efootball.arena';
  const password = 'Admin@123'; // Change after first login
  const salt = bcrypt.genSaltSync(10);
  const password_hash = bcrypt.hashSync(password, salt);

  const { error: insertErr } = await supabaseAdmin.from('users').insert({
    id,
    username,
    email,
    password_hash,
    efootball_id: 'ADMIN001',
    whatsapp: adminPhone,
    balance: 0.0,
    role: 'SUPER_ADMIN',
    wins: 0,
    losses: 0,
    created_at: new Date().toISOString(),
  });

  if (insertErr) {
    console.error('Failed to create SUPER_ADMIN:', insertErr.message);
    process.exit(1);
  }

  console.log('SUPER_ADMIN created successfully.');
  console.log('Credentials -> email:', email, 'password:', password);
}

createSuperAdmin();
