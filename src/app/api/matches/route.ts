import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import crypto from 'node:crypto';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let query = supabaseAdmin
      .from('matches')
      .select(`
        *,
        creator:creator_id(username, efootball_id, avatar),
        opponent:opponent_id(username, efootball_id, avatar),
        winner:winner_id(username)
      `);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: rows, error } = await query
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const matches = (rows || []).map((m: any) => ({
      ...m,
      creator_name: m.creator?.username || null,
      creator_efootball_id: m.creator?.efootball_id || null,
      creator_avatar: m.creator?.avatar || null,
      opponent_name: m.opponent?.username || null,
      opponent_efootball_id: m.opponent?.efootball_id || null,
      opponent_avatar: m.opponent?.avatar || null,
      winner_name: m.winner?.username || null
    }));

    return NextResponse.json({ matches });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, stake, platform = 'Mobile' } = await req.json();
    const numStake = parseFloat(stake);

    if (isNaN(numStake) || numStake < 5) {
      return NextResponse.json({ error: 'A9al mablagh l l-challenge houwa 5 DH' }, { status: 400 });
    }

    // Check user balance
    const { data: currentUser } = await supabaseAdmin
      .from('users')
      .select('balance')
      .eq('id', user.id)
      .single();

    if (!currentUser || currentUser.balance < numStake) {
      return NextResponse.json({ 
        error: `Rasid dyalk (${currentUser?.balance || 0} DH) ma kafich. Khassk tchhan l-hisab dyalk qbel.` 
      }, { status: 400 });
    }

    // Commission rate (default 10%)
    const { data: commRow } = await supabaseAdmin
      .from('platform_settings')
      .select('value')
      .eq('key', 'commission_rate')
      .maybeSingle();

    const commissionRate = commRow ? parseFloat(commRow.value) : 0.10;

    // Total pot is 2 * stake. Winner gets total - commission.
    const totalPot = numStake * 2;
    const prize = totalPot * (1 - commissionRate);

    const matchId = 'match_' + crypto.randomBytes(5).toString('hex');
    const now = new Date().toISOString();

    // Deduct stake from creator (ESCROW)
    const newBalance = currentUser.balance - numStake;
    await supabaseAdmin.from('users').update({ balance: newBalance }).eq('id', user.id);

    // Record escrow transaction
    await supabaseAdmin.from('transactions').insert({
      id: 'tx_' + Math.random().toString(36).substring(2, 9),
      user_id: user.id,
      type: 'MATCH_STAKE',
      amount: -numStake,
      balance_after: newBalance,
      description: `Mise 1v1 Match #${matchId}`,
      reference_id: matchId,
      created_at: now
    });

    // Create match
    await supabaseAdmin.from('matches').insert({
      id: matchId,
      title: title || `Challenge 1v1 (${numStake} DH)`,
      game: 'eFootball',
      platform,
      stake: numStake,
      prize,
      creator_id: user.id,
      status: 'OPEN',
      created_at: now,
      updated_at: now
    });

    return NextResponse.json({
      success: true,
      matchId,
      newBalance
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
