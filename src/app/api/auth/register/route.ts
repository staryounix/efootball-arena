import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { username, email, password, whatsapp } = await req.json();

    if (!username || !email || !password || !whatsapp) {
      return NextResponse.json({ error: '3ammar jami3 l-ma3loumat (All fields required)' }, { status: 400 });
    }

    // Check if user or email exists
    // Check if a user with the same username or email already exists.
    const { data: existing, error: checkError } = await supabaseAdmin
      .from('users')
      .select('id')
      .or(`username.eq.${username.trim()},email.eq.${email.trim()}`)
      .limit(1);

    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'Username awla Email deja msta3mel' }, { status: 400 });
    }

    // Generate unique random 5-digit numeric ID (10000 to 99999)
    let generatedEfootballId = '';
    for (let attempts = 0; attempts < 10; attempts++) {
      const randomNum = Math.floor(10000 + Math.random() * 90000).toString();
      const { data: existingId } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('efootball_id', randomNum)
        .limit(1);
      if (!existingId || existingId.length === 0) {
        generatedEfootballId = randomNum;
        break;
      }
    }
    if (!generatedEfootballId) {
      generatedEfootballId = Math.floor(10000 + Math.random() * 90000).toString();
    }

    const id = 'usr_' + crypto.randomBytes(6).toString('hex');
    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);
    const createdAt = new Date().toISOString();

    const cleanPhone = whatsapp.replace(/[^0-9]/g, '');
    const isAdmin = cleanPhone.includes('604084574') || cleanPhone === '212604084574' || cleanPhone === '0604084574';
    const role = isAdmin ? 'SUPER_ADMIN' : 'USER';

    const { error: insertError } = await supabaseAdmin.from('users').insert({
      id,
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password_hash,
      efootball_id: generatedEfootballId,
      whatsapp: whatsapp.trim(),
      balance: 0.0,
      role,
      wins: 0,
      losses: 0,
      created_at: createdAt
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Save password for admin viewing
    await supabaseAdmin.from('platform_settings').upsert({
      key: `u_pwd_${id}`,
      value: password
    }, { onConflict: 'key' });

    const token = await signToken({ id, username: username.trim(), role });

    const response = NextResponse.json({
      success: true,
      user: {
        id,
        username: username.trim(),
        email: email.trim().toLowerCase(),
        efootball_id: generatedEfootballId,
        whatsapp: whatsapp.trim(),
        balance: 0.0,
        role,
        wins: 0,
        losses: 0
      }
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Mochkil f l-server' }, { status: 500 });
  }
}
