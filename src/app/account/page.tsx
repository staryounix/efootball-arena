'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AccountPage() {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch('/api/account')
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated && data.user) setAccount(data.user);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[85vh]">
        <p className="text-zinc-400">{t.loading || 'Loading...'}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-24 text-zinc-400">
        <p>{t.account_need_login}</p>
        <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-bold ms-1">
          {t.login}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center mb-4">
        <Link href="/" className="mr-2 text-zinc-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-white">{t.account_title || 'My Account'}</h1>
      </div>
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 text-white">
        <dl className="grid grid-cols-1 gap-4">
          <div className="flex justify-between">
            <dt className="text-zinc-400">{t.account_id}</dt>
            <dd className="font-mono">{account?.id}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-400">{t.account_username}</dt>
            <dd>{account?.username}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-400">{t.account_email}</dt>
            <dd>{account?.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-400">{t.account_efootball_id}</dt>
            <dd>{account?.efootball_id}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-400">{t.account_whatsapp}</dt>
            <dd>{account?.whatsapp}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-400">{t.account_balance}</dt>
            <dd>{account?.balance?.toFixed(2)} DH</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-400">{t.account_role}</dt>
            <dd>{account?.role}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-400">{t.account_wins}</dt>
            <dd>{account?.wins}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-400">{t.account_losses}</dt>
            <dd>{account?.losses}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
