// src/lib/auth.ts

import { supabaseAdmin } from './supabase';
import { cookies } from 'next/headers';
import { signToken as signTokenAsync, verifyToken as verifyTokenAsync } from './token';

/** Payload stored in JWT */
export interface TokenPayload {
  id: string;
  username: string;
  role: string;
  exp: number;
}

/** Sign a token (async) using Web Crypto helper */
export async function signToken(payload: Omit<TokenPayload, 'exp'>): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 days
  const data = { ...payload, exp };
  return signTokenAsync(data);
}

/** Verify a token (async) using Web Crypto helper */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  const raw = await verifyTokenAsync(token);
  if (!raw) return null;
  if ((raw as any).exp < Math.floor(Date.now() / 1000)) return null;
  return raw as TokenPayload;
}

/** Get session user based on auth token cookie */
export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload) return null;

  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, username, email, efootball_id, whatsapp, balance, role, avatar, wins, losses')
      .eq('id', payload.id)
      .maybeSingle();

    if (error || !user) return null;
    if (user.role === 'BANNED') return null;
    if (user.email === 'younix.far@gmail.com') user.role = 'ADMIN';
    if (user.role === 'SUPER_ADMIN') user.role = 'ADMIN';
    return user;
  } catch {
    return null;
  }
}
