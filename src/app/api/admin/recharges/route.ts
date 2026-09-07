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
      .from('recharge_requests')
      .select(`
        *,
        user:user_id(username, email, efootball_id, balance)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const requests = (rows || []).map((r: any) => ({
      ...r,
      username: r.user?.username || '',
      email: r.user?.email || '',
      efootball_id: r.user?.efootball_id || '',
      current_balance: r.user?.balance ?? 0
    })).sort((a: any, b: any) => {
      if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
      if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return NextResponse.json({ requests });
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

    const { requestId, action, admin_notes } = await req.json();

    const { data: request, error: reqError } = await supabaseAdmin
      .from('recharge_requests')
      .select(`
        *,
        user:user_id(username, balance)
      `)
      .eq('id', requestId)
      .maybeSingle();

    if (reqError || !request) {
      return NextResponse.json({ error: 'Talab non trouvé' }, { status: 404 });
    }

    if (request.status !== 'PENDING') {
      return NextResponse.json({ error: `Had l-talab deja traité (${request.status})` }, { status: 400 });
    }

    const now = new Date().toISOString();
    const userObj = (request as any).user;

    if (action === 'approve') {
      const currentBalance = userObj?.balance ?? 0;
      const newBalance = currentBalance + request.amount;

      // Add balance to user
      await supabaseAdmin.from('users').update({ balance: newBalance }).eq('id', request.user_id);

      // Update request status
      await supabaseAdmin.from('recharge_requests').update({
        status: 'APPROVED',
        admin_notes: admin_notes || 'Validé par l Admin',
        processed_at: now
      }).eq('id', requestId);

      // Record transaction
      await supabaseAdmin.from('transactions').insert({
        id: 'tx_' + Math.random().toString(36).substring(2, 9),
        user_id: request.user_id,
        type: 'DEPOSIT',
        amount: request.amount,
        balance_after: newBalance,
        description: `Chahn rasid #${request.id} (+${request.amount} DH)`,
        reference_id: request.id,
        created_at: now
      });

      return NextResponse.json({
        success: true,
        message: `T-validat l-3amaliya! ${request.amount} DH t-zadit l hisab ${userObj?.username}. Nouveau solde: ${newBalance} DH`,
        newBalance
      });
    } else if (action === 'reject') {
      await supabaseAdmin.from('recharge_requests').update({
        status: 'REJECTED',
        admin_notes: admin_notes || 'Refusé par l Admin',
        processed_at: now
      }).eq('id', requestId);

      return NextResponse.json({
        success: true,
        message: `Talab #${request.id} trfed.`
      });
    }

    return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
