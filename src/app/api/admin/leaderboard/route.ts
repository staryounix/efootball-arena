import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Mamnoo3 (Accès refusé)' }, { status: 403 });
    }

    const { data: rows, error } = await supabaseAdmin
      .from('users')
      .select('id, username, email, efootball_id, whatsapp, balance, role, wins, losses, created_at')
      .eq('role', 'USER')
      .order('wins', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const players = (rows || []).map((u: any) => {
      const wins = u.wins || 0;
      const losses = u.losses || 0;
      const total = wins + losses;
      const win_rate = total > 0 ? Math.round((wins / total) * 1000) / 10 : 0.0;
      return {
        ...u,
        win_rate
      };
    }).sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.win_rate - a.win_rate;
    });

    return NextResponse.json({ players });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Mamnoo3 (Accès refusé)' }, { status: 403 });
    }

    const {
      username,
      efootball_id,
      wins,
      losses,
      whatsapp,
      balance
    } = await req.json();

    if (!username?.trim()) {
      return NextResponse.json({ error: 'Username darouri' }, { status: 400 });
    }
    if (!efootball_id?.trim()) {
      return NextResponse.json({ error: 'eFootball ID darouri' }, { status: 400 });
    }

    const cleanUsername = username.trim();
    const cleanEfootballId = efootball_id.trim();
    const numWins = Math.max(0, parseInt(wins ?? 0, 10) || 0);
    const numLosses = Math.max(0, parseInt(losses ?? 0, 10) || 0);
    const numBalance = Math.max(0, parseFloat(balance ?? 0) || 0);
    const cleanWhatsapp = (whatsapp?.trim() || '+212600000000');

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin
      .from('users')
      .select('id, role, whatsapp')
      .ilike('username', cleanUsername)
      .limit(1);

    const existing = existingUsers && existingUsers.length > 0 ? existingUsers[0] : null;

    if (existing) {
      await supabaseAdmin.from('users').update({
        efootball_id: cleanEfootballId,
        wins: numWins,
        losses: numLosses,
        balance: numBalance,
        whatsapp: cleanWhatsapp !== '+212600000000' ? cleanWhatsapp : existing.whatsapp,
        role: 'USER'
      }).eq('id', existing.id);

      return NextResponse.json({
        success: true,
        message: `L-La3ib "${cleanUsername}" kan deja w t-updateaw les stats dyalo b naja7!`
      });
    }

    // Create new player record
    const id = 'usr_' + crypto.randomBytes(6).toString('hex');
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('player123', salt);
    const email = `${cleanUsername.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Date.now().toString().slice(-4)}@player.efootball`;
    const createdAt = new Date().toISOString();

    const { error: insertErr } = await supabaseAdmin.from('users').insert({
      id,
      username: cleanUsername,
      email,
      password_hash: hash,
      efootball_id: cleanEfootballId,
      whatsapp: cleanWhatsapp,
      balance: numBalance,
      role: 'USER',
      wins: numWins,
      losses: numLosses,
      created_at: createdAt
    });

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `La3ib jdid "${cleanUsername}" tzad f l-classement b naja7!`
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Mamnoo3 (Accès refusé)' }, { status: 403 });
    }

    const {
      id,
      username,
      efootball_id,
      wins,
      losses,
      balance
    } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (!existing) {
      return NextResponse.json({ error: 'La3ib ma lqinahach' }, { status: 404 });
    }

    const numWins = Math.max(0, parseInt(wins ?? 0, 10) || 0);
    const numLosses = Math.max(0, parseInt(losses ?? 0, 10) || 0);

    const updates: any = {
      wins: numWins,
      losses: numLosses
    };
    if (username?.trim()) updates.username = username.trim();
    if (efootball_id?.trim()) updates.efootball_id = efootball_id.trim();
    if (balance !== undefined) updates.balance = parseFloat(balance);

    const { error: updateErr } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('id', id);

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Les statistiques dyal l-la3ib t-modifiw b naja7!'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Mamnoo3 (Accès refusé)' }, { status: 403 });
    }

    const { id, mode } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    }

    const { data: targetUser } = await supabaseAdmin
      .from('users')
      .select('username, role')
      .eq('id', id)
      .maybeSingle();

    if (!targetUser) {
      return NextResponse.json({ error: 'La3ib ma lqinahach' }, { status: 404 });
    }

    if (targetUser.role === 'ADMIN') {
      return NextResponse.json({ error: 'Mamnoo3 tmhi compte d Admin' }, { status: 400 });
    }

    if (mode === 'reset') {
      // Just reset wins & losses to 0
      await supabaseAdmin.from('users').update({ wins: 0, losses: 0 }).eq('id', id);
      return NextResponse.json({
        success: true,
        message: `Les points dyal "${targetUser.username}" rje3o l 0 (remis à zéro)!`
      });
    }

    // Full removal from leaderboard:
    try {
      await supabaseAdmin.from('tournament_participants').delete().eq('user_id', id);
      await supabaseAdmin.from('recharge_requests').delete().eq('user_id', id);
      await supabaseAdmin.from('withdrawal_requests').delete().eq('user_id', id);
      await supabaseAdmin.from('transactions').delete().eq('user_id', id);
      await supabaseAdmin.from('match_messages').delete().eq('user_id', id);
      await supabaseAdmin.from('matches').delete().or(`creator_id.eq.${id},opponent_id.eq.${id}`);
      await supabaseAdmin.from('users').delete().eq('id', id);
    } catch {
      await supabaseAdmin.from('users').update({ role: 'INACTIVE', wins: 0, losses: 0 }).eq('id', id);
    }

    return NextResponse.json({
      success: true,
      message: `L-la3ib "${targetUser.username}" tmha b naja7 mn l-classement!`
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
