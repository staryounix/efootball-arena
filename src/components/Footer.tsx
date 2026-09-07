'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950/80 py-8 px-4 text-xs text-zinc-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-center sm:text-start">
          <span className="text-base">⚽</span>
          <span className="font-bold text-zinc-300">{t.site_title}</span>
          <span>— {t.footer_subtitle}</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 text-zinc-400">
          <span>{t.footer_payment}</span>
          <span>•</span>
          <span className="text-emerald-400 font-medium">{t.footer_escrow}</span>
          <span>•</span>
          <span className="text-zinc-500">{t.footer_rights} © 2026</span>
        </div>
      </div>
    </footer>
  );
}
