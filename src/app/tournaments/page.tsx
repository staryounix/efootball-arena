'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { 
  Trophy, 
  Users, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck,
  Award,
  PlusCircle
} from 'lucide-react';
import RechargeModal from '@/components/RechargeModal';

export default function TournamentsPage() {
  const { user, refreshUser } = useAuth();
  const { t } = useLanguage();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [showRecharge, setShowRecharge] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchTournaments = async () => {
    try {
      const res = await fetch('/api/tournaments');
      const data = await res.json();
      if (data.tournaments) setTournaments(data.tournaments);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleJoin = async (tournament: any) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (user.balance < tournament.entry_fee) {
      setMsg({ type: 'error', text: `${t.matches_insufficient_balance} (${user.balance} DH / ${tournament.entry_fee} DH).` });
      setShowRecharge(true);
      return;
    }

    if (!confirm(`تأكيد التسجيل في بطولة "${tournament.title}" برسم اشتراك ${tournament.entry_fee} درهم؟`)) return;

    setJoiningId(tournament.id);
    try {
      const res = await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tournamentId: tournament.id })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: 'تم التسجيل بنجاح في البطولة! ستظهر القرعة قبل موعد الانطلاق.' });
        await refreshUser();
        fetchTournaments();
      } else {
        setMsg({ type: 'error', text: data.error || 'حدث خطأ في التسجيل' });
      }
    } catch {
      setMsg({ type: 'error', text: 'مشكل في الاتصال بالخادم' });
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">{t.tourn_page_title}</h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
              {t.tourn_page_subtitle}
            </p>
          </div>
        </div>

        {user?.role === 'ADMIN' && (
          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>+ {t.tourn_admin_manage}</span>
          </Link>
        )}
      </div>

      {msg && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
          msg.type === 'success' ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
        }`}>
          {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Tournaments list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tournaments.map(tr => (
          <div
            key={tr.id}
            className="rounded-3xl bg-zinc-900/80 border border-zinc-800 overflow-hidden shadow-xl flex flex-col justify-between"
          >
            <div>
              {/* Banner */}
              <div className="h-44 bg-zinc-950 relative overflow-hidden">
                <img src={tr.banner} alt={tr.title} className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                <div className="absolute top-4 start-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                  {t.tourn_total_prize} {tr.prize_pool} DH
                </div>
                <div className="absolute top-4 end-4 bg-zinc-900/80 backdrop-blur-md text-zinc-200 text-xs font-mono px-2.5 py-1 rounded-lg border border-zinc-700">
                  {tr.participant_count || 0}/{tr.max_players} {t.tourn_places}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-black text-white">{tr.title}</h3>
                <p className="text-xs text-zinc-400">{tr.rules}</p>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-zinc-800 text-center">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold block">{t.tourn_entry_fee}</span>
                    <span className="text-sm font-black text-white font-mono">{tr.entry_fee} DH</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold block">{t.tourn_start}</span>
                    <span className="text-xs font-bold text-emerald-400 block mt-0.5">{tr.start_date}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold block">{t.tourn_format}</span>
                    <span className="text-xs font-bold text-zinc-300 block mt-0.5">{t.tourn_knockout}</span>
                  </div>
                </div>

                {/* Prize Breakdown */}
                <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-1.5 font-semibold">
                    <Award className="w-4 h-4 text-amber-400" /> {t.tourn_distribution}
                  </span>
                  <span className="text-zinc-300 font-mono">
                    🥇 1er: {(tr.prize_pool * 0.6).toFixed(0)} DH • 🥈 2ème: {(tr.prize_pool * 0.3).toFixed(0)} DH • 🥉 3ème: {(tr.prize_pool * 0.1).toFixed(0)} DH
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="p-6 pt-0">
              {tr.isJoined ? (
                <div className="w-full py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> {t.tourn_joined_already}
                </div>
              ) : (
                <button
                  onClick={() => handleJoin(tr)}
                  disabled={joiningId === tr.id}
                  className="w-full py-3 rounded-xl font-black text-xs text-zinc-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all shadow-lg shadow-amber-500/20"
                >
                  {joiningId === tr.id ? t.tourn_registering : `${t.tourn_register_btn} (${tr.entry_fee} DH)`}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showRecharge && <RechargeModal onClose={() => setShowRecharge(false)} />}
    </div>
  );
}
