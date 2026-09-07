import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const user = await getSessionUser();

    const { data: tournaments, error: tournError } = await supabaseAdmin
      .from('tournaments')
      .select(`
        *,
        tournament_participants(id)
      `)
      .order('created_at', { ascending: false });

    if (tournError) {
      return NextResponse.json({ error: tournError.message }, { status: 500 });
    }

    let joinedIds: string[] = [];
    if (user) {
      const { data: userJoined } = await supabaseAdmin
        .from('tournament_participants')
        .select('tournament_id')
        .eq('user_id', user.id);
      joinedIds = (userJoined || []).map((j: any) => j.tournament_id);
    }

    const results = (tournaments || []).map((t: any) => ({
      ...t,
      participant_count: t.tournament_participants ? t.tournament_participants.length : 0,
      isJoined: joinedIds.includes(t.id)
    }));

    return NextResponse.json({ tournaments: results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { tournamentId } = await req.json();
    if (!tournamentId) return NextResponse.json({ error: 'Tournament ID manquant' }, { status: 400 });

    const { data: tournament, error: tError } = await supabaseAdmin
      .from('tournaments')
      .select('*')
      .eq('id', tournamentId)
      .maybeSingle();

    if (tError || !tournament) return NextResponse.json({ error: 'Botola non trouvée' }, { status: 404 });

    if (tournament.status !== 'REGISTRATION') {
      return NextResponse.json({ error: 'Tasjil f had l-botola mssdod' }, { status: 400 });
    }

    // Check count
    const { count: participantCount } = await supabaseAdmin
      .from('tournament_participants')
      .select('*', { count: 'exact', head: true })
      .eq('tournament_id', tournamentId);

    if ((participantCount || 0) >= tournament.max_players) {
      return NextResponse.json({ error: 'L-botola 3amrat' }, { status: 400 });
    }

    // Check already joined
    const { data: already } = await supabaseAdmin
      .from('tournament_participants')
      .select('id')
      .eq('tournament_id', tournamentId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (already) {
      return NextResponse.json({ error: 'Derti tasjil deja f had l-botola' }, { status: 400 });
    }

    // Check user balance
    const { data: currentUser } = await supabaseAdmin
      .from('users')
      .select('balance')
      .eq('id', user.id)
      .single();

    if (!currentUser || currentUser.balance < tournament.entry_fee) {
      return NextResponse.json({ error: `Rasid dyalk (${currentUser?.balance || 0} DH) ma kafich l frais d'inscription (${tournament.entry_fee} DH)` }, { status: 400 });
    }

    const now = new Date().toISOString();
    const newBal = currentUser.balance - tournament.entry_fee;

    // Deduct fee
    await supabaseAdmin.from('users').update({ balance: newBal }).eq('id', user.id);

    // Record transaction
    await supabaseAdmin.from('transactions').insert({
      id: 'tx_' + Math.random().toString(36).substring(2, 9),
      user_id: user.id,
      type: 'TOURNAMENT_FEE',
      amount: -tournament.entry_fee,
      balance_after: newBal,
      description: `Frais d inscription f ${tournament.title}`,
      reference_id: tournament.id,
      created_at: now
    });

    // Register participant
    await supabaseAdmin.from('tournament_participants').insert({
      id: 'tp_' + Math.random().toString(36).substring(2, 9),
      tournament_id: tournamentId,
      user_id: user.id,
      joined_at: now
    });

    return NextResponse.json({ success: true, message: 'Tsjelti b naja7 f l-botola!', newBalance: newBal });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
