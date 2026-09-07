import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Mamnoo3 (Accès refusé)' }, { status: 403 });
    }

    const { data: tournaments, error: tournError } = await supabaseAdmin
      .from('tournaments')
      .select(`
        *,
        tournament_participants(
          id,
          joined_at,
          user:user_id(id, username, efootball_id, whatsapp)
        )
      `)
      .order('created_at', { ascending: false });

    if (tournError) {
      return NextResponse.json({ error: tournError.message }, { status: 500 });
    }

    const tournamentsWithParticipants = (tournaments || []).map((t: any) => {
      const participants = (t.tournament_participants || []).map((tp: any) => ({
        participant_id: tp.id,
        joined_at: tp.joined_at,
        user_id: tp.user?.id || '',
        username: tp.user?.username || '',
        efootball_id: tp.user?.efootball_id || '',
        whatsapp: tp.user?.whatsapp || ''
      }));

      return {
        ...t,
        participant_count: participants.length,
        participants
      };
    });

    return NextResponse.json({ tournaments: tournamentsWithParticipants });
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
      title,
      banner,
      entry_fee,
      prize_pool,
      max_players,
      start_date,
      rules,
      status
    } = await req.json();

    if (!title?.trim()) {
      return NextResponse.json({ error: '3onwan l-botola darouri (Titre requis)' }, { status: 400 });
    }

    const numericEntryFee = parseFloat(entry_fee ?? 0);
    const numericPrizePool = parseFloat(prize_pool ?? 0);
    const numericMaxPlayers = parseInt(max_players ?? 16, 10);

    if (isNaN(numericEntryFee) || numericEntryFee < 0) {
      return NextResponse.json({ error: 'Frais d\'inscription ghalat' }, { status: 400 });
    }
    if (isNaN(numericPrizePool) || numericPrizePool < 0) {
      return NextResponse.json({ error: 'Prize pool ghalat' }, { status: 400 });
    }

    const id = 'tourn_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    const defaultBanner = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=60';
    const createdAt = new Date().toISOString();

    const { error: insertError } = await supabaseAdmin.from('tournaments').insert({
      id,
      title: title.trim(),
      banner: banner?.trim() || defaultBanner,
      entry_fee: numericEntryFee,
      prize_pool: numericPrizePool,
      max_players: numericMaxPlayers || 16,
      status: status || 'REGISTRATION',
      start_date: start_date?.trim() || 'Halan (Direct)',
      rules: rules?.trim() || 'Match standard 10 min, extra time + penalties en cas d égalité.',
      created_at: createdAt
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'L-Botola t-zadit b naja7!',
      tournamentId: id
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
      title,
      banner,
      entry_fee,
      prize_pool,
      max_players,
      start_date,
      rules,
      status
    } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID l-botola manquant' }, { status: 400 });
    }

    const { error: updateError } = await supabaseAdmin
      .from('tournaments')
      .update({
        title: title?.trim() || 'Botola eFootball',
        banner: banner?.trim() || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=60',
        entry_fee: parseFloat(entry_fee ?? 0),
        prize_pool: parseFloat(prize_pool ?? 0),
        max_players: parseInt(max_players ?? 16, 10),
        start_date: start_date?.trim() || '',
        rules: rules?.trim() || '',
        status: status || 'REGISTRATION'
      })
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'L-Botola t-modifat b naja7!' });
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

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'ID l-botola manquant' }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from('tournaments')
      .select('title')
      .eq('id', id)
      .maybeSingle();

    if (!existing) {
      return NextResponse.json({ error: 'Had l-botola ma lqinahach' }, { status: 404 });
    }

    // Delete participants first
    await supabaseAdmin.from('tournament_participants').delete().eq('tournament_id', id);
    // Delete tournament
    await supabaseAdmin.from('tournaments').delete().eq('id', id);

    return NextResponse.json({
      success: true,
      message: `L-Botola "${existing.title}" tmhat b naja7!`
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
