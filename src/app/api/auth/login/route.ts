import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { signToken } from '@/lib/auth';

/**
 * POST /api/auth/login
 * Handles user login using Supabase Auth.
 * Supports login by email or username (case‑insensitive).
 * After successful authentication, redirects based on role.
 */
export async function POST(req: Request) {
  try {
    const { login, password } = await req.json();

    if (!login || !password) {
      return NextResponse.json({ error: 'المرجو إدخال اسم المستخدم/البريد الإلكتروني وكلمة المرور' }, { status: 400 });
    }

    // Determine if the supplied login is an email. Simple check for '@'.
    const isEmail = login.includes('@');
    let email: string | null = null;
    let fallbackRole: string | null = null; // role from public.users if we need to fallback

    if (isEmail) {
      email = login.trim();
    } else {
      // Assume username – fetch the associated email (and possibly role) from the users table.
      const { data: userRec, error: dbErr } = await supabaseAdmin
        .from('users')
        .select('email, role')
        .eq('username', login.trim())
        .single();

      if (dbErr || !userRec) {
        return NextResponse.json({ error: 'المستخدم غير موجود أو كلمة المرور غير صحيحة' }, { status: 401 });
      }
      email = userRec.email;
      fallbackRole = userRec.role;
    }

    // Authenticate via Supabase Auth.
    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email: email ?? '',
      password,
    });

    if (authError || !authData?.user) {
      // Provide a friendly Arabic / French message.
      const message = 'اسم المستخدم أو كلمة المرور غير صحيحة / Identifiants invalides';
      return NextResponse.json({ error: message }, { status: 401 });
    }

    const supabaseUser = authData.user;
    // Prefer role stored in auth metadata, otherwise fallback to the role we fetched earlier.
    const roleFromMeta = (supabaseUser.user_metadata as any)?.role;
    const userRole = roleFromMeta ?? fallbackRole ?? 'USER';

    // Create our own JWT for the frontend if needed.
    const token = await signToken({
      id: supabaseUser.id,
      email: supabaseUser.email,
      role: userRole,
    });

    const redirectUrl = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN' ? '/admin' : '/';

    const response = NextResponse.json({
      success: true,
      user: {
        id: supabaseUser.id,
        email: supabaseUser.email,
        role: userRole,
        // Any additional fields you may want to expose can be added here.
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
    return NextResponse.json({ error: err.message || 'خطأ في الخادم' }, { status: 500 });
  }
}
