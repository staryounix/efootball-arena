import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const { data: matchRow, error: matchError } = await supabaseAdmin
      .from('matches')
      .select(`
        *,
        creator:creator_id(username, efootball_id, whatsapp),
        opponent:opponent_id(username, efootball_id, whatsapp),
        winner:winner_id(username)
      `)
      .eq('id', id)
      .maybeSingle();

    if (matchError || !matchRow) {
      return NextResponse.json({ error: 'Match non trouvé' }, { status: 404 });
    }

    const match = {
      ...matchRow,
      creator_name: (matchRow as any).creator?.username || null,
      creator_efootball_id: (matchRow as any).creator?.efootball_id || null,
      creator_whatsapp: (matchRow as any).creator?.whatsapp || null,
      opponent_name: (matchRow as any).opponent?.username || null,
      opponent_efootball_id: (matchRow as any).opponent?.efootball_id || null,
      opponent_whatsapp: (matchRow as any).opponent?.whatsapp || null,
      winner_name: (matchRow as any).winner?.username || null
    };

    const { data: messages } = await supabaseAdmin
      .from('match_messages')
      .select('*')
      .eq('match_id', id)
      .order('created_at', { ascending: true });

    return NextResponse.json({ match, messages: messages || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { action, ...data } = await req.json();

    const { data: match, error: matchError } = await supabaseAdmin
      .from('matches')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (matchError || !match) return NextResponse.json({ error: 'Match non trouvé' }, { status: 404 });

    const now = new Date().toISOString();

    // 1. JOIN MATCH
    if (action === 'join') {
      if (match.status !== 'OPEN') {
        return NextResponse.json({ error: 'Had l-match ma bqash disponible' }, { status: 400 });
      }
      if (match.creator_id === user.id) {
        return NextResponse.json({ error: 'Ma ymknch t-l3eb dhed rassek' }, { status: 400 });
      }

      const { data: currentUser } = await supabaseAdmin
        .from('users')
        .select('balance')
        .eq('id', user.id)
        .single();

      if (!currentUser || currentUser.balance < match.stake) {
        return NextResponse.json({ error: `Rasid dyalk (${currentUser?.balance || 0} DH) ma kafich l had l-challenge (${match.stake} DH)` }, { status: 400 });
      }

      // Deduct stake from opponent (ESCROW)
      const newBalance = currentUser.balance - match.stake;
      await supabaseAdmin.from('users').update({ balance: newBalance }).eq('id', user.id);

      await supabaseAdmin.from('transactions').insert({
        id: 'tx_' + Math.random().toString(36).substring(2, 9),
        user_id: user.id,
        type: 'MATCH_STAKE',
        amount: -match.stake,
        balance_after: newBalance,
        description: `Mise 1v1 Match #${match.id}`,
        reference_id: match.id,
        created_at: now
      });

      await supabaseAdmin.from('matches').update({
        opponent_id: user.id,
        status: 'PLAYING',
        updated_at: now
      }).eq('id', id);

      // System chat message
      await supabaseAdmin.from('match_messages').insert({
        id: 'msg_' + Math.random().toString(36).substring(2, 9),
        match_id: id,
        user_id: user.id,
        username: 'System',
        message: `${user.username} dkhul l l-match! Tbadlo l-room code daba.`,
        created_at: now
      });

      return NextResponse.json({ success: true, message: 'Dkhelti l l-match b naja7!' });
    }

    // 2. CANCEL MATCH (Creator only when OPEN)
    if (action === 'cancel') {
      if (match.creator_id !== user.id) {
        return NextResponse.json({ error: 'Ghir mol l-match li 3ndo l-haq y-annulih' }, { status: 403 });
      }
      if (match.status !== 'OPEN') {
        return NextResponse.json({ error: 'Ma ymknch t-annuli match bda' }, { status: 400 });
      }

      // Refund creator
      const { data: currentUser } = await supabaseAdmin
        .from('users')
        .select('balance')
        .eq('id', user.id)
        .single();

      const newBalance = (currentUser?.balance || 0) + match.stake;
      await supabaseAdmin.from('users').update({ balance: newBalance }).eq('id', user.id);

      await supabaseAdmin.from('transactions').insert({
        id: 'tx_' + Math.random().toString(36).substring(2, 9),
        user_id: user.id,
        type: 'MATCH_REFUND',
        amount: match.stake,
        balance_after: newBalance,
        description: `Rjoo3 mise Match annulé #${match.id}`,
        reference_id: match.id,
        created_at: now
      });

      await supabaseAdmin.from('matches').update({
        status: 'CANCELLED',
        updated_at: now
      }).eq('id', id);

      return NextResponse.json({ success: true, message: 'Match annulé w rje3 lik l-rasid' });
    }

    // 3. SET ROOM CODE
    if (action === 'set_room_code') {
      const { room_code } = data;
      if (!room_code) return NextResponse.json({ error: 'Dakhel room code' }, { status: 400 });
      if (match.creator_id !== user.id && match.opponent_id !== user.id) {
        return NextResponse.json({ error: 'Khassek tkoun f l-match' }, { status: 403 });
      }

      await supabaseAdmin.from('matches').update({
        room_code: room_code.trim(),
        updated_at: now
      }).eq('id', id);

      await supabaseAdmin.from('match_messages').insert({
        id: 'msg_' + Math.random().toString(36).substring(2, 9),
        match_id: id,
        user_id: user.id,
        username: 'System',
        message: `Room Code dyal eFootball t-setta: ${room_code.trim()}`,
        created_at: now
      });

      return NextResponse.json({ success: true, room_code });
    }

    // 4. CHAT MESSAGE
    if (action === 'send_message') {
      const { message } = data;
      if (!message || !message.trim()) return NextResponse.json({ error: 'Message khawi' }, { status: 400 });

      await supabaseAdmin.from('match_messages').insert({
        id: 'msg_' + Math.random().toString(36).substring(2, 9),
        match_id: id,
        user_id: user.id,
        username: user.username,
        message: message.trim(),
        created_at: now
      });

      return NextResponse.json({ success: true });
    }

    // 5. SUBMIT MATCH RESULT
    if (action === 'submit_result') {
      const { score, claimed_winner, proof } = data;
      const isCreator = match.creator_id === user.id;
      const isOpponent = match.opponent_id === user.id;

      if (!isCreator && !isOpponent) {
        return NextResponse.json({ error: 'Nta machi f had l-match' }, { status: 403 });
      }

      if (match.status !== 'PLAYING' && match.status !== 'PENDING_CONFIRMATION') {
        return NextResponse.json({ error: 'L-match machi f halat l3ib' }, { status: 400 });
      }

      // Update submitter's info
      if (isCreator) {
        await supabaseAdmin.from('matches').update({
          creator_score: parseInt(score) || 0,
          creator_claimed_winner: claimed_winner,
          creator_proof: proof || null,
          status: 'PENDING_CONFIRMATION',
          updated_at: now
        }).eq('id', id);
      } else {
        await supabaseAdmin.from('matches').update({
          opponent_score: parseInt(score) || 0,
          opponent_claimed_winner: claimed_winner,
          opponent_proof: proof || null,
          status: 'PENDING_CONFIRMATION',
          updated_at: now
        }).eq('id', id);
      }

      // Re-fetch match to check both submissions
      const { data: updatedMatch } = await supabaseAdmin
        .from('matches')
        .select('*')
        .eq('id', id)
        .single();

      if (updatedMatch?.creator_claimed_winner && updatedMatch?.opponent_claimed_winner) {
        // Both submitted!
        if (updatedMatch.creator_claimed_winner === updatedMatch.opponent_claimed_winner) {
          // AGREED ON WINNER!
          const winnerId = updatedMatch.creator_claimed_winner;
          const loserId = winnerId === match.creator_id ? match.opponent_id : match.creator_id;

          // Credit prize to winner
          const { data: winnerUser } = await supabaseAdmin
            .from('users')
            .select('balance, wins')
            .eq('id', winnerId)
            .single();

          const newWinnerBal = (winnerUser?.balance || 0) + match.prize;
          await supabaseAdmin.from('users').update({
            balance: newWinnerBal,
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

          // Record winning transaction
          await supabaseAdmin.from('transactions').insert({
            id: 'tx_' + Math.random().toString(36).substring(2, 9),
            user_id: winnerId,
            type: 'MATCH_WIN',
            amount: match.prize,
            balance_after: newWinnerBal,
            description: `Jawa'iz rbeh 1v1 Match #${match.id}`,
            reference_id: match.id,
            created_at: now
          });

          // Mark completed
          await supabaseAdmin.from('matches').update({
            status: 'COMPLETED',
            winner_id: winnerId,
            updated_at: now
          }).eq('id', id);

          await supabaseAdmin.from('match_messages').insert({
            id: 'msg_' + Math.random().toString(36).substring(2, 9),
            match_id: id,
            user_id: user.id,
            username: 'System',
            message: `🎉 Match salat! L-fayez t-validat natija dyalo w khda ${match.prize} DH!`,
            created_at: now
          });

          return NextResponse.json({ success: true, status: 'COMPLETED', winnerId });
        } else {
          // DISPUTE!
          await supabaseAdmin.from('matches').update({
            status: 'DISPUTE',
            dispute_reason: 'Kola wahed claima rbeh. Khass tadakhol l-admin.',
            updated_at: now
          }).eq('id', id);

          await supabaseAdmin.from('match_messages').insert({
            id: 'msg_' + Math.random().toString(36).substring(2, 9),
            match_id: id,
            user_id: user.id,
            username: 'System',
            message: `⚠️ Khilaf (Dispute)! Bjouj claimed rbehto. L-Admin ghaychouf les captures d'écran daba bach y-tranchi.`,
            created_at: now
          });

          return NextResponse.json({ success: true, status: 'DISPUTE', message: 'Tkayyes, l-admin ghay-checké l-capture d écran' });
        }
      }

      return NextResponse.json({ success: true, status: 'PENDING_CONFIRMATION', message: 'Natija tsjlat, kan-tsenaw l-la3ib lakhor y-validé' });
    }

    return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
