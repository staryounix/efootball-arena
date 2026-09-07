import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  // Get auth token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  // Verify token
  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  // Fetch user from Supabase using admin client
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('id, username, email, efootball_id, whatsapp, balance, role, avatar, wins, losses')
    .eq('id', payload.id)
    .maybeSingle();

  if (error || !user) {
    return NextResponse.json({ authenticated: false, user: null, error: error?.message }, { status: 500 });
  }

  if (user.role === 'BANNED') {
    const res = NextResponse.json({ authenticated: false, user: null, banned: true }, { status: 403 });
    res.cookies.delete('auth_token');
    return res;
  }

  return NextResponse.json({ authenticated: true, user });
}
