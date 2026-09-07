'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { X, Swords, AlertCircle, Sparkles, Smartphone, Gamepad2, Monitor } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CreateMatchModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const STAKE_PRESETS = [10, 20, 50, 100, 200];

export default function CreateMatchModal({ onClose, onSuccess }: CreateMatchModalProps) {
  const { user, refreshUser } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [stake, setStake] = useState<number | string>(20);
  const [platform, setPlatform] = useState('Mobile');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const numStake = parseFloat(stake.toString()) || 0;
  const potentialPrize = (numStake * 2 * 0.90).toFixed(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (numStake < 5) {
      setError('5 DH هو أقل مبلغ لإنشاء التحدي');
      return;
    }

    if (!user || user.balance < numStake) {
      setError(t.modal_recharge_prompt);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() || `تحدي 1 ضد 1 (${numStake} DH)`,
          stake: numStake,
          platform
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'حدث خطأ أثناء إنشاء التحدي');
      } else {
        await refreshUser();
        onClose();
        if (onSuccess) onSuccess();
        router.push(`/matches/${data.matchId}`);
      }
    } catch {
      setError('مشكل في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{t.modal_create_title}</h2>
              <p className="text-xs text-zinc-400">{t.modal_create_subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Platform selection */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              {t.modal_platform_label}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Mobile', label: 'Mobile (iOS/Android)', icon: Smartphone },
                { id: 'PlayStation', label: 'PlayStation', icon: Gamepad2 },
                { id: 'Xbox/PC', label: 'Xbox / PC', icon: Monitor }
              ].map(p => {
                const Icon = p.icon;
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      platform === p.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-emerald-400" />
                    <span className="text-[11px] text-center">{p.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stake */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                {t.modal_stake_label}
              </label>
              <span className="text-xs text-zinc-400">
                {t.nav_balance}: <strong className="text-emerald-400 font-mono">{user?.balance.toFixed(2)} DH</strong>
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 mb-2">
              {STAKE_PRESETS.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setStake(p)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    numStake === p
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {p} DH
                </button>
              ))}
            </div>

            <input
              type="number"
              min="5"
              step="5"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              placeholder={t.recharge_other_amount}
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500 text-sm"
              required
            />
          </div>

          {/* Prize calculation card */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-zinc-950 to-teal-950/40 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-[11px] text-zinc-400 uppercase font-semibold block">{t.modal_prize_calc}</span>
                <span className="text-xs text-zinc-300">{t.modal_fee_note}</span>
              </div>
            </div>
            <div className="text-end font-mono">
              <span className="text-lg font-black text-amber-400">{potentialPrize} DH</span>
            </div>
          </div>

          {/* Optional Title */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              {t.modal_title_label}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.modal_title_placeholder}
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || (user ? user.balance < numStake : false)}
            className="w-full py-3 px-4 rounded-xl font-bold text-zinc-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 text-sm"
          >
            {loading ? t.modal_creating : `${t.modal_submit_btn} (${numStake} DH)`}
          </button>
        </form>
      </div>
    </div>
  );
}
