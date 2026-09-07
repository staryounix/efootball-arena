import { NextResponse } from 'next/server';
import { getSessionUser, verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, username, email, efootball_id, whatsapp, balance, role, avatar, wins, losses')
    .eq('id', payload.id)
    .maybeSingle();

  if (!user) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  if (user.role === 'BANNED') {
    const res = NextResponse.json({ 
      authenticated: false, 
      user: null, 
      banned: true, 
      error: 'Had l-hisab m-banni (Banned). Twasel m3a l-admin f WhatsApp.' 
    }, { status: 403 });
    res.cookies.delete('auth_token');
    return res;
  }

  return NextResponse.json({ authenticated: true, user });
}
