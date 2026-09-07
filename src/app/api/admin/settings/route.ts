import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Mamnoo3' }, { status: 403 });
    }

    const { data: rows, error } = await supabaseAdmin
      .from('platform_settings')
      .select('key, value');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const settings: Record<string, any> = {};
    for (const r of rows || []) {
      if (r.key.startsWith('u_pwd_')) continue;
      if (r.key === 'payment_methods') {
        try {
          settings.payment_methods = JSON.parse(r.value);
        } catch {
          settings.payment_methods = r.value;
        }
      } else {
        settings[r.key] = r.value;
      }
    }
    return NextResponse.json({ settings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Mamnoo3' }, { status: 403 });
    }

    const body = await req.json();

    const upserts = [];
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'string') {
        upserts.push({ key, value });
      } else if (value !== null && typeof value === 'object') {
        upserts.push({ key, value: JSON.stringify(value) });
      }
    }

    // Auto-sync legacy keys if payment_methods is present
    if (body.payment_methods && Array.isArray(body.payment_methods)) {
      const cih = body.payment_methods.find((m: any) => m.id === 'cih' || m.name?.toLowerCase().includes('cih'));
      if (cih) {
        if (cih.rib) upserts.push({ key: 'cih_rib', value: cih.rib });
        if (cih.holder_name) upserts.push({ key: 'cih_name', value: cih.holder_name });
      }
      const cp = body.payment_methods.find((m: any) => m.id === 'cashplus' || m.name?.toLowerCase().includes('cash'));
      if (cp) {
        if (cp.cin) upserts.push({ key: 'cashplus_cin', value: cp.cin });
        if (cp.holder_name) upserts.push({ key: 'cashplus_name', value: cp.holder_name });
      }
    }

    if (upserts.length > 0) {
      const { error } = await supabaseAdmin
        .from('platform_settings')
        .upsert(upserts, { onConflict: 'key' });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: 'Les paramètres t-sauvegardawe b naja7' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
