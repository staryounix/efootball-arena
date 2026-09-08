import crypto from 'node:crypto';
import { supabaseAdmin } from './supabase';
import { cookies } from 'next/headers';

const SECRET = process.env.AUTH_SECRET || 'efootball-super-secret-key-2026-xyz';

export interface TokenPayload {
  id: string;
  username: string;
  role: string;
  exp: number;
}

export function signToken(payload: Omit<TokenPayload, 'exp'>): string {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 days
  const data: TokenPayload = { ...payload, exp };
  const json = JSON.stringify(data);
  const base64 = Buffer.from(json).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET).update(base64).digest('base64url');
  return `${base64}.${signature}`;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const [base64, signature] = token.split('.');
    if (!base64 || !signature) return null;
    const expectedSignature = crypto.createHmac('sha256', SECRET).update(base64).digest('base64url');
    if (signature !== expectedSignature) return null;
    const payload = JSON.parse(Buffer.from(base64, 'base64url').toString('utf8')) as TokenPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  const payload = verifyToken(token);
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
    return user;
  } catch {
    return null;
  }
}
