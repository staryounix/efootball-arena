import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const DEFAULT_PAYMENT_METHODS = [
  {
    id: 'cih',
    name: 'CIH Bank',
    type: 'bank',
    enabled: true,
    rib: '230 780 0000000000000000 00',
    holder_name: 'MOHAMMED ADMIN',
    instructions: 'Versez le montant sur ce compte CIH et envoyez la capture sur WhatsApp.'
  },
  {
    id: 'cashplus',
    name: 'Cash Plus',
    type: 'cash',
    enabled: true,
    holder_name: 'MOHAMMED ADMIN',
    cin: 'AB123456',
    instructions: 'Envoyez le transfert Cash Plus puis envoyez le code de retrait sur WhatsApp.'
  },
  {
    id: 'attijari',
    name: 'Attijariwafa bank',
    type: 'bank',
    enabled: true,
    rib: '007 780 0000000000000000 11',
    holder_name: 'MOHAMMED ADMIN',
    instructions: 'Virement vers ce compte Attijariwafa et envoyez la capture sur WhatsApp.'
  },
  {
    id: 'inwi',
    name: 'Inwi Money',
    type: 'phone',
    enabled: true,
    phone: '+212604084574',
    holder_name: 'MOHAMMED ADMIN',
    instructions: 'Envoyez via Inwi Money vers ce numéro et envoyez la capture sur WhatsApp.'
  },
  {
    id: 'orange',
    name: 'Orange Money',
    type: 'phone',
    enabled: true,
    phone: '+212604084574',
    holder_name: 'MOHAMMED ADMIN',
    instructions: 'Envoyez via Orange Money vers ce numéro et envoyez la capture sur WhatsApp.'
  },
  {
    id: 'usdt',
    name: 'USDT (TRC20)',
    type: 'crypto',
    enabled: true,
    wallet_address: 'TYDzsYUEWvYpxapbFCeTXvkRBxmPgkYNi8',
    network: 'TRC20',
    instructions: 'Envoyez le montant en USDT TRC20 et envoyez le Hash (TxID) sur WhatsApp.'
  }
];

export async function GET() {
  try {
    const { data: rows, error } = await supabaseAdmin
      .from('platform_settings')
      .select('key, value');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const settings: Record<string, any> = {};
    for (const r of rows || []) {
      // Never expose user passwords in public settings
      if (r.key.startsWith('u_pwd_')) continue;

      if (r.key === 'payment_methods') {
        try {
          settings.payment_methods = JSON.parse(r.value);
        } catch {
          settings.payment_methods = DEFAULT_PAYMENT_METHODS;
        }
      } else {
        settings[r.key] = r.value;
      }
    }

    if (!settings.payment_methods) {
      settings.payment_methods = DEFAULT_PAYMENT_METHODS;
    }

    return NextResponse.json({ settings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
