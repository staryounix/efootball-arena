import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Khassek t-connecta qbel' }, { status: 401 });
    }

    const { amount, payment_method, whatsapp, notes } = await req.json();

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({ error: 'Dakhel mablgh s7i7 (Invalid amount)' }, { status: 400 });
    }

    if (!payment_method || !whatsapp) {
      return NextResponse.json({ error: 'Khtar tariqat l-khalas w dkhl raqm WhatsApp' }, { status: 400 });
    }

    const requestId = 'REC-' + Math.floor(100000 + Math.random() * 900000);
    const createdAt = new Date().toISOString();

    const { error: insertError } = await supabaseAdmin.from('recharge_requests').insert({
      id: requestId,
      user_id: user.id,
      amount: numericAmount,
      payment_method,
      whatsapp: whatsapp.trim(),
      status: 'PENDING',
      notes: notes?.trim() || null,
      created_at: createdAt
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Get Admin whatsapp number from settings
    const { data: settingRow } = await supabaseAdmin
      .from('platform_settings')
      .select('value')
      .eq('key', 'admin_whatsapp')
      .maybeSingle();

    const adminPhone = settingRow?.value || '+212604084574';

    // Format phone for wa.me link (remove +, spaces, etc.)
    const cleanPhone = adminPhone.replace(/[^0-9]/g, '');
    const defaultMsg = encodeURIComponent(
      `Salam Admin! Dert talab chahn rasid:\n` +
      `- Raqm l-talab: #${requestId}\n` +
      `- L-Mablagh: ${numericAmount} DH\n` +
      `- Tariqa: ${payment_method}\n` +
      `- ID eFootball: ${user.efootball_id}\n` +
      `- Pseudo: ${user.username}`
    );

    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${defaultMsg}`;

    return NextResponse.json({
      success: true,
      request: {
        id: requestId,
        amount: numericAmount,
        payment_method,
        whatsapp,
        status: 'PENDING',
        created_at: createdAt
      },
      adminWhatsapp: adminPhone,
      whatsappUrl
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Mochkil f l-server' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: requests, error } = await supabaseAdmin
      .from('recharge_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ requests: requests || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
