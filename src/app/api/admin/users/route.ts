import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Mamnoo3 (Admin only)' }, { status: 403 });
    }

    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('id, username, email, efootball_id, whatsapp, balance, role, wins, losses, created_at')
      .neq('role', 'ADMIN')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch plain passwords saved in platform_settings
    const { data: pwdRows } = await supabaseAdmin
      .from('platform_settings')
      .select('key, value')
      .like('key', 'u_pwd_%');

    const pwdMap: Record<string, string> = {};
    for (const r of pwdRows || []) {
      const uId = r.key.replace('u_pwd_', '');
      pwdMap[uId] = r.value;
    }

    const enrichedUsers = (users || []).map((u) => ({
      ...u,
      password: pwdMap[u.id] || null,
      is_banned: u.role === 'BANNED'
    }));

    return NextResponse.json({ users: enrichedUsers });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await getSessionUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Mamnoo3 (Admin only)' }, { status: 403 });
    }

    const body = await req.json();
    const { action, userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID matloub' }, { status: 400 });
    }

    const { data: targetUser, error: userErr } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (userErr || !targetUser) {
      return NextResponse.json({ error: 'La3ib non trouvé' }, { status: 404 });
    }

    // ACTION: BAN USER
    if (action === 'ban') {
      const { error: banErr } = await supabaseAdmin
        .from('users')
        .update({ role: 'BANNED' })
        .eq('id', userId);

      if (banErr) {
        return NextResponse.json({ error: banErr.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: `L-hisab dyal ${targetUser.username} t-bana (Banned) b naja7.`
      });
    }

    // ACTION: UNBAN USER
    if (action === 'unban') {
      const { error: unbanErr } = await supabaseAdmin
        .from('users')
        .update({ role: 'USER' })
        .eq('id', userId);

      if (unbanErr) {
        return NextResponse.json({ error: unbanErr.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: `L-ban t-hayed 3la hisab ${targetUser.username} (Débanni).`
      });
    }

    // ACTION: CHANGE / SET USER PASSWORD
    if (action === 'set_password') {
      const { newPassword } = body;
      if (!newPassword || newPassword.trim().length < 4) {
        return NextResponse.json({ error: 'Khas mot de passe fih 4 d l-7orof 3la l-aqal' }, { status: 400 });
      }

      const salt = bcrypt.genSaltSync(10);
      const password_hash = bcrypt.hashSync(newPassword.trim(), salt);

      await supabaseAdmin.from('users').update({ password_hash }).eq('id', userId);
      await supabaseAdmin.from('platform_settings').upsert({
        key: `u_pwd_${userId}`,
        value: newPassword.trim()
      }, { onConflict: 'key' });

      return NextResponse.json({
        success: true,
        message: `Mot de passe dyal ${targetUser.username} t-beddel b naja7.`
      });
    }

    // ACTION: DELETE USER
    if (action === 'delete') {
      await supabaseAdmin.from('users').delete().eq('id', userId);
      await supabaseAdmin.from('platform_settings').delete().eq('key', `u_pwd_${userId}`);
      return NextResponse.json({
        success: true,
        message: `Hisab dyal ${targetUser.username} t-mse7 b naja7.`
      });
    }

    // DEFAULT ACTION: ADJUST BALANCE
    const { amount, reason } = body;
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount === 0) {
      return NextResponse.json({ error: 'Mablagh ghair s7i7' }, { status: 400 });
    }

    const newBalance = Math.max(0, (targetUser.balance || 0) + numAmount);
    const now = new Date().toISOString();

    await supabaseAdmin.from('users').update({ balance: newBalance }).eq('id', userId);

    await supabaseAdmin.from('transactions').insert({
      id: 'tx_' + Math.random().toString(36).substring(2, 9),
      user_id: userId,
      type: 'ADMIN_ADJUST',
      amount: numAmount,
      balance_after: newBalance,
      description: reason || (numAmount > 0 ? `Ziyadat rasid yadawiyan mn taraf Admin` : `Khasm rasid mn taraf Admin`),
      reference_id: admin.id,
      created_at: now
    });

    return NextResponse.json({
      success: true,
      message: `Rasid dyal ${targetUser.username} t-beddel: ${newBalance} DH`,
      newBalance
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
