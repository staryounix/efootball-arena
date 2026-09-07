import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Mamnoo3 (Admin only)' }, { status: 403 });
    }

    const { data: rows, error } = await supabaseAdmin
      .from('matches')
      .select(`
        *,
        creator:creator_id(username, efootball_id, whatsapp),
        opponent:opponent_id(username, efootball_id, whatsapp)
      `)
      .eq('status', 'DISPUTE')
      .order('updated_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const disputes = (rows || []).map((m: any) => ({
      ...m,
      creator_name: m.creator?.username || null,
      creator_efootball_id: m.creator?.efootball_id || null,
      creator_whatsapp: m.creator?.whatsapp || null,
      opponent_name: m.opponent?.username || null,
      opponent_efootball_id: m.opponent?.efootball_id || null,
      opponent_whatsapp: m.opponent?.whatsapp || null
    }));

    return NextResponse.json({ disputes });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Mamnoo3 (Admin only)' }, { status: 403 });
    }

    const { matchId, decision, winnerId } = await req.json();

    const { data: match, error: matchError } = await supabaseAdmin
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .maybeSingle();

    if (matchError || !match || match.status !== 'DISPUTE') {
      return NextResponse.json({ error: 'Match non trouvé ou pas en litige' }, { status: 400 });
    }

    const now = new Date().toISOString();

    if (decision === 'PICK_WINNER') {
      if (!winnerId || (winnerId !== match.creator_id && winnerId !== match.opponent_id)) {
        return NextResponse.json({ error: 'Khtar l-fayez s7i7' }, { status: 400 });
      }

      const loserId = winnerId === match.creator_id ? match.opponent_id : match.creator_id;

      // Credit winner
      const { data: winnerUser } = await supabaseAdmin
        .from('users')
        .select('balance, wins')
        .eq('id', winnerId)
        .single();

      const newBal = (winnerUser?.balance || 0) + match.prize;
      await supabaseAdmin.from('users').update({
        balance: newBal,
        wins: (winnerUser?.wins || 0) + 1
      }).eq('id', winnerId);

      // Update loser losses
      const { data: loserUser } = await supabaseAdmin
        .from('users')
        .select('losses')
        .eq('id', loserId)
        .single();

      await supabaseAdmin.from('users').update({
        losses: (loserUser?.losses || 0) + 1
      }).eq('id', loserId);

      // Record transaction
      await supabaseAdmin.from('transactions').insert({
        id: 'tx_' + Math.random().toString(36).substring(2, 9),
        user_id: winnerId,
        type: 'MATCH_WIN',
        amount: match.prize,
        balance_after: newBal,
        description: `Rbeh 1v1 apres arbitrage Admin #${match.id}`,
        reference_id: match.id,
        created_at: now
      });

      await supabaseAdmin.from('matches').update({
        status: 'COMPLETED',
        winner_id: winnerId,
        dispute_reason: `Hal l-khilaf mn taraf Admin: Fayez houwa ${winnerId}`,
        updated_at: now
      }).eq('id', matchId);

      return NextResponse.json({ success: true, message: 'L-khilaf t-7all w t-siftat l-jaiza l l-rabeh!' });
    } else if (decision === 'REFUND_BOTH') {
      // Refund both creator and opponent their stakes
      const { data: creator } = await supabaseAdmin
        .from('users')
        .select('balance')
        .eq('id', match.creator_id)
        .single();

      const { data: opponent } = await supabaseAdmin
        .from('users')
        .select('balance')
        .eq('id', match.opponent_id)
        .single();

      const newCreatorBal = (creator?.balance || 0) + match.stake;
      const newOpponentBal = (opponent?.balance || 0) + match.stake;

      await supabaseAdmin.from('users').update({ balance: newCreatorBal }).eq('id', match.creator_id);
      await supabaseAdmin.from('users').update({ balance: newOpponentBal }).eq('id', match.opponent_id);

      await supabaseAdmin.from('transactions').insert([
        {
          id: 'tx_' + Math.random().toString(36).substring(2, 9),
          user_id: match.creator_id,
          type: 'MATCH_REFUND',
          amount: match.stake,
          balance_after: newCreatorBal,
          description: `Rjoo3 mise match annulé par Admin #${match.id}`,
          reference_id: match.id,
          created_at: now
        },
        {
          id: 'tx_' + Math.random().toString(36).substring(2, 9),
          user_id: match.opponent_id,
          type: 'MATCH_REFUND',
          amount: match.stake,
          balance_after: newOpponentBal,
          description: `Rjoo3 mise match annulé par Admin #${match.id}`,
          reference_id: match.id,
          created_at: now
        }
      ]);

      await supabaseAdmin.from('matches').update({
        status: 'CANCELLED',
        dispute_reason: 'Match annulé par Admin w rj3o les mises l bjouj',
        updated_at: now
      }).eq('id', matchId);

      return NextResponse.json({ success: true, message: 'Match annulé w rj3o l-flous l bjouj la3ibin.' });
    }

    return NextResponse.json({ error: 'Decision inconnue' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
