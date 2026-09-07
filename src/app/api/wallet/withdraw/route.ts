import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, method, destination_info } = await req.json();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json({ error: 'Mablagh ghair s7i7' }, { status: 400 });
    }

    const { data: latestUser } = await supabaseAdmin
      .from('users')
      .select('balance')
      .eq('id', user.id)
      .single();

    const currentBalance = latestUser?.balance ?? user.balance;

    if (currentBalance < numAmount) {
      return NextResponse.json({ error: 'Rasid dyalk ma kafich l had l-sahb' }, { status: 400 });
    }

    if (!destination_info) {
      return NextResponse.json({ error: 'Dakhel ma3loumat l-sahb (RIB / Nom / CIN)' }, { status: 400 });
    }

    const withdrawId = 'WIT-' + Math.floor(100000 + Math.random() * 900000);
    const createdAt = new Date().toISOString();
    const newBalance = currentBalance - numAmount;

    // Deduct from user balance immediately
    await supabaseAdmin.from('users').update({ balance: newBalance }).eq('id', user.id);

    // Record withdrawal request
    await supabaseAdmin.from('withdrawal_requests').insert({
      id: withdrawId,
      user_id: user.id,
      amount: numAmount,
      method,
      destination_info: destination_info.trim(),
      status: 'PENDING',
      created_at: createdAt
    });

    // Record transaction
    await supabaseAdmin.from('transactions').insert({
      id: 'tx_' + Math.random().toString(36).substring(2, 9),
      user_id: user.id,
      type: 'WITHDRAWAL',
      amount: -numAmount,
      balance_after: newBalance,
      description: `Talab Sahb #${withdrawId} (${method})`,
      reference_id: withdrawId,
      created_at: createdAt
    });

    return NextResponse.json({
      success: true,
      message: 'Talab l-sahb tsjel b naja7 w ghay-traitih l-admin',
      requestId: withdrawId,
      newBalance
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: withdrawals, error } = await supabaseAdmin
      .from('withdrawal_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ withdrawals: withdrawals || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
