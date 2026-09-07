'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { 
  X, 
  Wallet, 
  CheckCircle2, 
  MessageCircle, 
  Copy, 
  Clock, 
  CreditCard,
  Building,
  Smartphone,
  ChevronRight,
  ShieldAlert,
  Info
} from 'lucide-react';

interface RechargeModalProps {
  onClose: () => void;
}

const PRESET_AMOUNTS = [20, 50, 100, 200, 500];

export default function RechargeModal({ onClose }: RechargeModalProps) {
  const { user, refreshUser } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  
  // Form State
  const [amount, setAmount] = useState<number | string>(50);
  const [paymentMethod, setPaymentMethod] = useState('CIH Bank');
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp || '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Success state after submitting
  const [submittedData, setSubmittedData] = useState<{
    requestId: string;
    amount: number;
    whatsappUrl: string;
    adminWhatsapp: string;
  } | null>(null);

  // Platform settings (CIH RIB, etc.)
  const [settings, setSettings] = useState<Record<string, any>>({
    cih_rib: '230 780 0000000000000000 00',
    cih_name: 'MOHAMMED ADMIN',
    cashplus_name: 'MOHAMMED ADMIN',
    cashplus_cin: 'AB123456',
    admin_whatsapp: '+212604084574',
    payment_methods: []
  });

  // Past requests
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [copiedKey, setCopiedKey] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          setSettings(data.settings);
          if (data.settings.payment_methods && Array.isArray(data.settings.payment_methods)) {
            const activeMethods = data.settings.payment_methods.filter((m: any) => m.enabled !== false);
            if (activeMethods.length > 0 && !activeMethods.some((m: any) => m.name === paymentMethod)) {
              setPaymentMethod(activeMethods[0].name);
            }
          }
        }
      })
      .catch(() => {});
  }, []);

  const loadHistory = async () => {
    if (!user) return;
    setLoadingHistory(true);
    try {
      const res = await fetch('/api/wallet/recharge');
      const data = await res.json();
      if (data.requests) setHistory(data.requests);
    } catch {}
    setLoadingHistory(false);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('Khassek t-connecta qbel bach t-sift talab chahn.');
      return;
    }

    const numAmount = parseFloat(amount.toString());

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('يرجى إدخال مبلغ صحيح');
      return;
    }

    if (!whatsapp.trim()) {
      setError('يرجى إدخال رقم الواتساب الخاص بك');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/wallet/recharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: numAmount,
          payment_method: paymentMethod,
          whatsapp,
          notes
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'حدث خطأ، يرجى إعادة المحاولة');
      } else {
        setSubmittedData({
          requestId: data.request.id,
          amount: data.request.amount,
          whatsappUrl: data.whatsappUrl,
          adminWhatsapp: data.adminWhatsapp
        });
        refreshUser();
      }
    } catch {
      setError('مشكل في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  const methods: any[] = (settings.payment_methods && Array.isArray(settings.payment_methods) && settings.payment_methods.length > 0)
    ? settings.payment_methods.filter((m: any) => m.enabled !== false)
    : [
        { id: 'cih', name: 'CIH Bank', type: 'bank', enabled: true, rib: settings.cih_rib || '230 780 0000000000000000 00', holder_name: settings.cih_name || 'MOHAMMED ADMIN' },
        { id: 'cashplus', name: 'Cash Plus', type: 'cash', enabled: true, cin: settings.cashplus_cin || 'AB123456', holder_name: settings.cashplus_name || 'MOHAMMED ADMIN' },
        { id: 'attijari', name: 'Attijariwafa', type: 'bank', enabled: true, rib: '007 780 0000000000000000 11', holder_name: 'MOHAMMED ADMIN' },
        { id: 'inwi', name: 'Inwi Money', type: 'phone', enabled: true, phone: settings.admin_whatsapp || '+212604084574' },
        { id: 'orange', name: 'Orange Money', type: 'phone', enabled: true, phone: settings.admin_whatsapp || '+212604084574' },
        { id: 'usdt', name: 'USDT (Crypto)', type: 'crypto', enabled: true, wallet_address: 'TYDzsYUEWvYpxapbFCeTXvkRBxmPgkYNi8', network: 'TRC20' }
      ];

  const currentMethod = methods.find(m => m.name === paymentMethod || m.id === paymentMethod) || methods[0] || {};

  function getMethodIcon(m: any) {
    const name = (m.name || '').toLowerCase();
    const type = (m.type || '').toLowerCase();
    if (type === 'crypto' || name.includes('usdt') || name.includes('crypto')) return Wallet;
    if (type === 'phone' || name.includes('money') || name.includes('inwi') || name.includes('orange')) return Smartphone;
    if (type === 'cash' || name.includes('cash') || name.includes('wafa')) return CreditCard;
    return Building;
  }



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{t.recharge_title}</h2>
              <p className="text-xs text-zinc-400">{t.recharge_subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/30 px-6 pt-2">
          <button
            onClick={() => setActiveTab('create')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all me-6 ${
              activeTab === 'create'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {t.recharge_tab_new}
          </button>
          <button
            onClick={() => {
              setActiveTab('history');
              loadHistory();
            }}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'history'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {t.recharge_tab_history}
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {activeTab === 'create' ? (
            submittedData ? (
              /* Success Screen */
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">{t.recharge_success_title}</h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    {t.recharge_request_num} <span className="text-emerald-400 font-mono font-bold">#{submittedData.requestId}</span>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-start space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">{t.recharge_amount}</span>
                    <span className="text-white font-bold font-mono">{submittedData.amount} DH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">{t.recharge_method}:</span>
                    <span className="text-white font-medium">{paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">الحالة:</span>
                    <span className="text-amber-400 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {t.recharge_status_pending}
                    </span>
                  </div>
                </div>

                {/* Direct WhatsApp button */}
                <div className="pt-2">
                  <a
                    href={submittedData.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/30 text-base group"
                  >
                    <MessageCircle className="w-5 h-5 fill-current" />
                    <span>{t.recharge_whatsapp_btn}</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
                  </a>
                  <p className="text-[11px] text-zinc-400 mt-2">
                    {t.recharge_whatsapp_note}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSubmittedData(null);
                    onClose();
                  }}
                  className="text-xs text-zinc-400 hover:text-zinc-200 underline pt-2"
                >
                  {t.recharge_back}
                </button>
              </div>
            ) : (
              /* Request Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Amount presets */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                    {t.recharge_select_amount}
                  </label>
                  <div className="grid grid-cols-5 gap-2 mb-2.5">
                    {PRESET_AMOUNTS.map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setAmount(p)}
                        className={`py-2 rounded-xl text-sm font-bold border transition-all ${
                          amount === p
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm shadow-emerald-500/30'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      min="10"
                      step="5"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={t.recharge_other_amount}
                      className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                      required
                    />
                    <span className="absolute end-3.5 top-2.5 text-xs text-zinc-400 font-bold">
                      DH (MAD)
                    </span>
                  </div>
                </div>

                {/* Payment method selection */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                    {t.recharge_method}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {methods.map((item: any) => {
                      const Icon = getMethodIcon(item);
                      const isSelected = paymentMethod === item.name || paymentMethod === item.id;
                      return (
                        <button
                          type="button"
                          key={item.id || item.name}
                          onClick={() => setPaymentMethod(item.name)}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold text-start transition-all ${
                            isSelected
                              ? 'bg-emerald-500/15 border-emerald-500/80 text-emerald-300 shadow-sm'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                          <span className="truncate">{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Admin payment details box */}
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2.5 text-xs">
                  <div className="text-zinc-400 font-medium flex items-center justify-between">
                    <span>{t.recharge_admin_info} (<strong className="text-white">{currentMethod.name || paymentMethod}</strong>):</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Verifié ✓</span>
                  </div>

                  {/* Dynamic Transfer Details */}
                  <div className="space-y-2 pt-1">
                    {/* Bank RIB */}
                    {currentMethod.rib && (
                      <div className="flex items-center justify-between bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-800">
                        <span className="text-zinc-200 font-mono text-[11px] font-semibold break-all">
                          RIB: {currentMethod.rib}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(currentMethod.rib, 'rib')}
                          className="text-emerald-400 hover:text-emerald-300 p-1 ms-2 shrink-0"
                          title="Copier RIB"
                        >
                          {copiedKey === 'rib' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}

                    {/* Cash Plus CIN */}
                    {currentMethod.cin && (
                      <div className="flex items-center justify-between bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-800">
                        <span className="text-zinc-200 font-mono text-[11px] font-semibold">
                          CIN: {currentMethod.cin}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(currentMethod.cin, 'cin')}
                          className="text-emerald-400 hover:text-emerald-300 p-1 ms-2 shrink-0"
                          title="Copier CIN"
                        >
                          {copiedKey === 'cin' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}

                    {/* Phone Number (Inwi / Orange) */}
                    {currentMethod.phone && (
                      <div className="flex items-center justify-between bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-800">
                        <span className="text-zinc-200 font-mono text-[11px] font-semibold">
                          Raqm / Téléphone: {currentMethod.phone}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(currentMethod.phone, 'phone')}
                          className="text-emerald-400 hover:text-emerald-300 p-1 ms-2 shrink-0"
                          title="Copier Numéro"
                        >
                          {copiedKey === 'phone' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}

                    {/* Crypto USDT Wallet Address */}
                    {currentMethod.wallet_address && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-800">
                          <span className="text-zinc-200 font-mono text-[10px] break-all leading-tight">
                            {currentMethod.wallet_address}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(currentMethod.wallet_address, 'wallet')}
                            className="text-emerald-400 hover:text-emerald-300 p-1 ms-2 shrink-0"
                            title="Copier Adresse"
                          >
                            {copiedKey === 'wallet' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                        {currentMethod.network && (
                          <div className="text-[10px] text-zinc-400">
                            Réseau (Network): <span className="font-bold text-amber-400 font-mono">{currentMethod.network}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Beneficiary Name */}
                    {currentMethod.holder_name && (
                      <div className="text-[11px] text-zinc-300 bg-zinc-900/50 px-2.5 py-1.5 rounded-md border border-zinc-800/60">
                        <span className="text-zinc-400">Bénéficiaire (Nom Complet):</span>{' '}
                        <strong className="text-white uppercase font-semibold">{currentMethod.holder_name}</strong>
                      </div>
                    )}

                    {/* Custom Admin Instructions / Notice */}
                    {currentMethod.instructions && (
                      <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-start gap-2">
                        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-400" />
                        <span className="leading-relaxed">{currentMethod.instructions}</span>
                      </div>
                    )}

                    {!currentMethod.rib && !currentMethod.cin && !currentMethod.phone && !currentMethod.wallet_address && (
                      <p className="text-zinc-400 text-[11px] leading-relaxed">
                        ستزودك الإدارة بمعلومات التحويل المباشرة عبر الواتساب فور إرسال الطلب.
                      </p>
                    )}
                  </div>
                </div>

                {!user && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
                    <span>زائر؟ يمكنك نسخ معلومات الإدارة للتحويل، أو تسجيل الدخول لإرسال الطلب تلقائياً.</span>
                    <a href="/login" className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold shrink-0 ms-2">
                      دخول
                    </a>
                  </div>
                )}

                {/* User's WhatsApp number */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    {t.recharge_your_whatsapp}
                  </label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+212 6 XX XX XX XX"
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono text-sm"
                    required
                  />
                </div>

                {/* Optional Note */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    {t.recharge_notes}
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t.recharge_notes_ph}
                    className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-zinc-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 text-sm"
                >
                  {loading ? t.recharge_sending : `${t.recharge_submit} (${amount} DH)`}
                </button>
              </form>
            )
          ) : (
            /* History Tab */
            <div className="space-y-3">
              {loadingHistory ? (
                <div className="text-center py-8 text-zinc-500 text-sm">{t.recharge_history_loading}</div>
              ) : history.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-sm">
                  {t.recharge_history_empty}
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-zinc-300">#{item.id}</span>
                        <span className="text-xs text-zinc-500 font-medium">({item.payment_method})</span>
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        {new Date(item.created_at).toLocaleString('fr-FR')}
                      </div>
                    </div>

                    <div className="text-end">
                      <div className="text-sm font-bold text-emerald-400 font-mono">
                        +{item.amount} DH
                      </div>
                      <div>
                        {item.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            <Clock className="w-2.5 h-2.5" /> {t.recharge_status_pending}
                          </span>
                        )}
                        {item.status === 'APPROVED' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="w-2.5 h-2.5" /> {t.recharge_status_approved}
                          </span>
                        )}
                        {item.status === 'REJECTED' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                            <ShieldAlert className="w-2.5 h-2.5" /> {t.recharge_status_rejected}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
