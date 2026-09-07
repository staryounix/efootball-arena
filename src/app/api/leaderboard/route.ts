import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('id, username, efootball_id, wins, losses, balance')
      .eq('role', 'USER')
      .order('wins', { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const players = (users || [])
      .map((u: any) => {
        const wins = u.wins || 0;
        const losses = u.losses || 0;
        const total = wins + losses;
        const win_rate = total > 0 ? Math.round((wins / total) * 1000) / 10 : 0.0;
        return {
          ...u,
          win_rate
        };
      })
      .sort((a, b) => {
        if (b.wins !== a.wins) return b.wins - a.wins;
        return b.win_rate - a.win_rate;
      });

    return NextResponse.json({ players });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
