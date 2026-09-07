'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  ShieldCheck, 
  Wallet, 
  Users, 
  AlertTriangle, 
  Settings, 
  CheckCircle2, 
  XCircle, 
  MessageCircle, 
  ExternalLink, 
  Plus, 
  Minus, 
  Clock, 
  RefreshCw,
  Search,
  Save,
  Trophy,
  Flame,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Ban,
  Copy,
  Building,
  CreditCard,
  Smartphone,
  Info,
  Check,
  UserPlus,
  Calendar,
  Award,
  PlusCircle
} from 'lucide-react';

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'recharges' | 'tournaments' | 'leaderboard' | 'disputes' | 'users' | 'settings'>('recharges');

  // Data states
  const [recharges, setRecharges] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [tournamentsList, setTournamentsList] = useState<any[]>([]);
  const [leaderboardList, setLeaderboardList] = useState<any[]>([]);
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Users Management States
  const [userSearch, setUserSearch] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<'ALL' | 'ACTIVE' | 'BANNED'>('ALL');
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedPwdUserId, setCopiedPwdUserId] = useState<string | null>(null);
  const [passwordChangeModal, setPasswordChangeModal] = useState<{ userId: string; username: string; newPassword: string } | null>(null);

  // Payment Methods Modal State
  const [showAddMethodModal, setShowAddMethodModal] = useState(false);
  const [newMethodForm, setNewMethodForm] = useState({
    name: '',
    type: 'bank',
    enabled: true,
    rib: '',
    holder_name: '',
    cin: '',
    phone: '',
    wallet_address: '',
    network: 'TRC20',
    instructions: ''
  });

  // Manual User Adjustment Modal
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<string>('50');
  const [adjustReason, setAdjustReason] = useState<string>('Ziyadat rasid yadawiya');

  // Tournaments Modal States
  const [showTournamentModal, setShowTournamentModal] = useState(false);
  const [editingTournament, setEditingTournament] = useState<any | null>(null);
  const [tournamentForm, setTournamentForm] = useState({
    title: '',
    banner: '',
    entry_fee: '20',
    prize_pool: '300',
    max_players: '16',
    start_date: 'Dimanche 21:00 GMT+1',
    rules: 'Match standard 10 min, extra time + penalties en cas d égalité.',
    status: 'REGISTRATION'
  });
  const [selectedTournamentParticipants, setSelectedTournamentParticipants] = useState<{
    tournamentTitle: string;
    participants: any[];
  } | null>(null);

  // Leaderboard Modal States
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<any | null>(null);
  const [leaderboardForm, setLeaderboardForm] = useState({
    username: '',
    efootball_id: '',
    wins: '10',
    losses: '2',
    balance: '0',
    whatsapp: '+212600000000'
  });

  // Filter for recharges
  const [rechargeFilter, setRechargeFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const fetchRecharges = async () => {
    try {
      const res = await fetch('/api/admin/recharges');
      const data = await res.json();
      if (data.requests) setRecharges(data.requests);
    } catch {}
  };

  const fetchDisputes = async () => {
    try {
      const res = await fetch('/api/admin/disputes');
      const data = await res.json();
      if (data.disputes) setDisputes(data.disputes);
    } catch {}
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) setUsersList(data.users);
    } catch {}
  };

  const fetchTournaments = async () => {
    try {
      const res = await fetch('/api/admin/tournaments');
      const data = await res.json();
      if (data.tournaments) setTournamentsList(data.tournaments);
    } catch {}
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/admin/leaderboard');
      const data = await res.json();
      if (data.players) setLeaderboardList(data.players);
    } catch {}
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.settings) {
        setSettings(data.settings);
        if (data.settings.payment_methods && Array.isArray(data.settings.payment_methods)) {
          setPaymentMethods(data.settings.payment_methods);
        } else {
          setPaymentMethods([
            { id: 'cih', name: 'CIH Bank', type: 'bank', enabled: true, rib: data.settings.cih_rib || '230 780 0000000000000000 00', holder_name: data.settings.cih_name || 'MOHAMMED ADMIN', instructions: 'Versez le montant sur ce compte CIH et envoyez la capture sur WhatsApp.' },
            { id: 'cashplus', name: 'Cash Plus', type: 'cash', enabled: true, cin: data.settings.cashplus_cin || 'AB123456', holder_name: data.settings.cashplus_name || 'MOHAMMED ADMIN', instructions: 'Envoyez le transfert Cash Plus puis envoyez le code de retrait sur WhatsApp.' },
            { id: 'attijari', name: 'Attijariwafa bank', type: 'bank', enabled: true, rib: '007 780 0000000000000000 11', holder_name: 'MOHAMMED ADMIN', instructions: 'Virement vers ce compte Attijariwafa et envoyez la capture sur WhatsApp.' },
            { id: 'inwi', name: 'Inwi Money', type: 'phone', enabled: true, phone: data.settings.admin_whatsapp || '+212604084574', holder_name: 'MOHAMMED ADMIN', instructions: 'Envoyez via Inwi Money vers ce numéro et envoyez la capture sur WhatsApp.' },
            { id: 'orange', name: 'Orange Money', type: 'phone', enabled: true, phone: data.settings.admin_whatsapp || '+212604084574', holder_name: 'MOHAMMED ADMIN', instructions: 'Envoyez via Orange Money vers ce numéro et envoyez la capture sur WhatsApp.' },
            { id: 'usdt', name: 'USDT (TRC20)', type: 'crypto', enabled: true, wallet_address: 'TYDzsYUEWvYpxapbFCeTXvkRBxmPgkYNi8', network: 'TRC20', instructions: 'Envoyez le montant en USDT TRC20 et envoyez le Hash (TxID) sur WhatsApp.' }
          ]);
        }
      }
    } catch {}
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([
      fetchRecharges(), 
      fetchTournaments(), 
      fetchLeaderboard(), 
      fetchDisputes(), 
      fetchUsers(), 
      fetchSettings()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Action: Approve Recharge
  const handleApproveRecharge = async (requestId: string, amount: number, username: string) => {
    if (!confirm(`Wach bghiti t-validé had l-talab w t-zid ${amount} DH l ${username}?`)) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/recharges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action: 'approve' })
      });
      const data = await res.json();
      if (res.ok) {
        showFeedback('success', data.message);
        fetchRecharges();
        fetchUsers();
      } else {
        showFeedback('error', data.error);
      }
    } catch {
      showFeedback('error', 'Erreur serveur');
    } finally {
      setActionLoading(false);
    }
  };

  // Action: Reject Recharge
  const handleRejectRecharge = async (requestId: string) => {
    const reason = prompt('Sbab l-rafd (Optionnel):', 'Paiement non reçu');
    if (reason === null) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/recharges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action: 'reject', admin_notes: reason })
      });
      const data = await res.json();
      if (res.ok) {
        showFeedback('success', data.message);
        fetchRecharges();
      } else {
        showFeedback('error', data.error);
      }
    } catch {
      showFeedback('error', 'Erreur serveur');
    } finally {
      setActionLoading(false);
    }
  };

  // Action: Manual Balance Adjustment
  const handleUserAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          amount: parseFloat(adjustAmount),
          reason: adjustReason
        })
      });
      const data = await res.json();
      if (res.ok) {
        showFeedback('success', data.message);
        setSelectedUser(null);
        fetchUsers();
      } else {
        showFeedback('error', data.error);
      }
    } catch {
      showFeedback('error', 'Erreur serveur');
    } finally {
      setActionLoading(false);
    }
  };

  // Action: Resolve Dispute
  const handleResolveDispute = async (matchId: string, decision: string, winnerId?: string) => {
    if (!confirm('Wach mteked mn had l-qarar?')) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId, decision, winnerId })
      });
      const data = await res.json();
      if (res.ok) {
        showFeedback('success', data.message);
        fetchDisputes();
      } else {
        showFeedback('error', data.error);
      }
    } catch {
      showFeedback('error', 'Erreur serveur');
    } finally {
      setActionLoading(false);
    }
  };

  // Action: Toggle Ban/Unban User
  const handleToggleBan = async (userId: string, isBanned: boolean, username: string) => {
    const action = isBanned ? 'unban' : 'ban';
    const confirmMsg = isBanned 
      ? `Wach bghiti t-7ayed l-ban 3la ${username}?` 
      : `Wach bghiti t-bani l-hisab dyal ${username}? Ghadi yt-bloqua f l-site.`;
    
    if (!confirm(confirmMsg)) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userId })
      });
      const data = await res.json();
      if (res.ok) {
        showFeedback('success', data.message);
        fetchUsers();
      } else {
        showFeedback('error', data.error);
      }
    } catch {
      showFeedback('error', 'Erreur serveur');
    } finally {
      setActionLoading(false);
    }
  };

  // Action: Save New Password for User
  const handleSavePassword = async () => {
    if (!passwordChangeModal || !passwordChangeModal.newPassword) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set_password',
          userId: passwordChangeModal.userId,
          newPassword: passwordChangeModal.newPassword
        })
      });
      const data = await res.json();
      if (res.ok) {
        showFeedback('success', data.message);
        setPasswordChangeModal(null);
        fetchUsers();
      } else {
        showFeedback('error', data.error);
      }
    } catch {
      showFeedback('error', 'Erreur serveur');
    } finally {
      setActionLoading(false);
    }
  };

  // Copy password helper
  const handleCopyPassword = (pwd: string, userId: string) => {
    navigator.clipboard.writeText(pwd);
    setCopiedPwdUserId(userId);
    setTimeout(() => setCopiedPwdUserId(null), 2000);
  };

  // Action: Save Settings & Payment Methods
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...settings,
          payment_methods: paymentMethods
        })
      });
      const data = await res.json();
      if (res.ok) {
        showFeedback('success', data.message);
        fetchSettings();
      } else {
        showFeedback('error', data.error);
      }
    } catch {
      showFeedback('error', 'Erreur serveur');
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle payment method enabled
  const handleTogglePaymentMethod = (index: number) => {
    const updated = [...paymentMethods];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    setPaymentMethods(updated);
  };

  // Update payment method field
  const handleUpdatePaymentMethodField = (index: number, field: string, value: any) => {
    const updated = [...paymentMethods];
    updated[index] = { ...updated[index], [field]: value };
    setPaymentMethods(updated);
  };

  // Delete payment method
  const handleDeletePaymentMethod = (index: number) => {
    if (!confirm('Wach bghiti t-mseh had tariqat chahn?')) return;
    const updated = paymentMethods.filter((_, i) => i !== index);
    setPaymentMethods(updated);
  };

  // Add new payment method
  const handleAddNewPaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMethodForm.name.trim()) return;
    const methodId = 'pm_' + Date.now().toString(36);
    const newMethod = {
      ...newMethodForm,
      id: methodId
    };
    setPaymentMethods([...paymentMethods, newMethod]);
    setShowAddMethodModal(false);
    setNewMethodForm({
      name: '',
      type: 'bank',
      enabled: true,
      rib: '',
      holder_name: '',
      cin: '',
      phone: '',
      wallet_address: '',
      network: 'TRC20',
      instructions: ''
    });
    showFeedback('success', `Tariqa "${newMethod.name}" t-zadet! Ma tensach t-clicki 3la Sauvegarder.`);
  };

  // ==========================================
  // TOURNAMENTS (BOTOLAT) ACTIONS
  // ==========================================
  const openAddTournament = () => {
    setEditingTournament(null);
    setTournamentForm({
      title: '',
      banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=60',
      entry_fee: '20',
      prize_pool: '300',
      max_players: '16',
      start_date: 'Dimanche 21:00 GMT+1',
      rules: 'Match standard 10 min, extra time + penalties en cas d égalité.',
      status: 'REGISTRATION'
    });
    setShowTournamentModal(true);
  };

  const openEditTournament = (t: any) => {
    setEditingTournament(t);
    setTournamentForm({
      title: t.title,
      banner: t.banner || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=60',
      entry_fee: t.entry_fee.toString(),
      prize_pool: t.prize_pool.toString(),
      max_players: t.max_players.toString(),
      start_date: t.start_date || '',
      rules: t.rules || '',
      status: t.status || 'REGISTRATION'
    });
    setShowTournamentModal(true);
  };

  const handleSaveTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const isEdit = !!editingTournament;
      const endpoint = '/api/admin/tournaments';
      const method = isEdit ? 'PUT' : 'POST';
      const payload = isEdit 
        ? { id: editingTournament.id, ...tournamentForm }
        : tournamentForm;

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        showFeedback('success', data.message || 'Operation reussie');
        setShowTournamentModal(false);
        fetchTournaments();
      } else {
        showFeedback('error', data.error || 'Erreur lors de l enregistrement');
      }
    } catch {
      showFeedback('error', 'Erreur serveur');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTournament = async (id: string, title: string) => {
    if (!confirm(`Wach mteked bghiti tmhi had l-botola: "${title}"? Jamahir w les participants ghay-tmhaw m3aha!`)) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/tournaments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (res.ok) {
        showFeedback('success', data.message);
        fetchTournaments();
      } else {
        showFeedback('error', data.error);
      }
    } catch {
      showFeedback('error', 'Erreur serveur');
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // LEADERBOARD (CLASSEMENT) ACTIONS
  // ==========================================
  const openAddPlayer = () => {
    setEditingPlayer(null);
    setLeaderboardForm({
      username: '',
      efootball_id: '',
      wins: '10',
      losses: '2',
      balance: '0',
      whatsapp: '+212600000000'
    });
    setShowLeaderboardModal(true);
  };

  const openEditPlayer = (p: any) => {
    setEditingPlayer(p);
    setLeaderboardForm({
      username: p.username,
      efootball_id: p.efootball_id,
      wins: p.wins.toString(),
      losses: p.losses.toString(),
      balance: p.balance ? p.balance.toString() : '0',
      whatsapp: p.whatsapp || '+212600000000'
    });
    setShowLeaderboardModal(true);
  };

  const handleSaveLeaderboardPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const isEdit = !!editingPlayer;
      const endpoint = '/api/admin/leaderboard';
      const method = isEdit ? 'PUT' : 'POST';
      const payload = isEdit
        ? { id: editingPlayer.id, ...leaderboardForm }
        : leaderboardForm;

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        showFeedback('success', data.message || 'Operation reussie');
        setShowLeaderboardModal(false);
        fetchLeaderboard();
        fetchUsers();
      } else {
        showFeedback('error', data.error || 'Erreur');
      }
    } catch {
      showFeedback('error', 'Erreur serveur');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteLeaderboardPlayer = async (id: string, username: string, mode: 'remove' | 'reset' = 'remove') => {
    const question = mode === 'reset'
      ? `Wach bghiti trje3 les points dyal "${username}" l 0?`
      : `Wach bghiti tmhi l-la3ib "${username}" kamel mn l-classement?`;
    
    if (!confirm(question)) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/leaderboard', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, mode })
      });
      const data = await res.json();
      if (res.ok) {
        showFeedback('success', data.message);
        fetchLeaderboard();
        fetchUsers();
      } else {
        showFeedback('error', data.error);
      }
    } catch {
      showFeedback('error', 'Erreur serveur');
    } finally {
      setActionLoading(false);
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Mamnoo3 (Accès Réservé l l-Admin)</h2>
        <p className="text-xs text-zinc-400">
          Khassek tkoun connecte b compte d'administration bach tchouf had l-page.
        </p>
      </div>
    );
  }

  const filteredRecharges = recharges.filter(r => {
    if (rechargeFilter === 'ALL') return true;
    return r.status === rechargeFilter;
  });

  const filteredUsers = usersList.filter(u => {
    const query = userSearch.trim().toLowerCase();
    const matchesSearch = !query || (
      (u.username || '').toLowerCase().includes(query) ||
      (u.email || '').toLowerCase().includes(query) ||
      (u.whatsapp || '').toLowerCase().includes(query) ||
      (u.efootball_id || '').toLowerCase().includes(query)
    );

    const isBanned = u.role === 'BANNED' || u.is_banned === true;
    if (userStatusFilter === 'ACTIVE') return matchesSearch && !isBanned;
    if (userStatusFilter === 'BANNED') return matchesSearch && isBanned;
    return matchesSearch;
  });

  const pendingCount = recharges.filter(r => r.status === 'PENDING').length;
  const disputeCount = disputes.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white">لوحة تحكم الإدارة (Admin Panel)</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
              Super Admin
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            إدارة ومراجعة طلبات الشحن اليدوي، البطولات الرسمية، لوحة الصدارة، وفض النزاعات.
          </p>
        </div>

        <button
          onClick={loadAll}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${actionLoading ? 'animate-spin' : ''}`} />
          <span>تحديث</span>
        </button>
      </div>

      {/* Feedback toast */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-sm font-semibold flex items-center gap-3 animate-fadeIn ${
            feedback.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-semibold uppercase">شحن قيد الانتظار</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-black text-emerald-400 font-mono mt-2 block">
            {pendingCount}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-semibold uppercase">البطولات الرسمية</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-black text-amber-400 font-mono mt-2 block">
            {tournamentsList.length}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-semibold uppercase">لوحة الصدارة</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <span className="text-2xl font-black text-orange-400 font-mono mt-2 block">
            {leaderboardList.length}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-semibold uppercase">نزاعات (Disputes)</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-2xl font-black text-rose-400 font-mono mt-2 block">
            {disputeCount}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-semibold uppercase">إجمالي اللاعبين</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-2xl font-black text-white font-mono mt-2 block">
            {usersList.length}
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 overflow-x-auto">
        {[
          { id: 'recharges', label: 'طلبات الشحن', icon: Wallet, badge: pendingCount },
          { id: 'tournaments', label: '🏆 البطولات الرسمية', icon: Trophy, badge: tournamentsList.length },
          { id: 'leaderboard', label: '🔥 لوحة الصدارة', icon: Flame, badge: leaderboardList.length },
          { id: 'disputes', label: 'فض النزاعات', icon: AlertTriangle, badge: disputeCount },
          { id: 'users', label: 'اللاعبين والأرصدة', icon: Users },
          { id: 'settings', label: 'الإعدادات والواتساب', icon: Settings }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  tab.id === 'tournaments' ? 'bg-amber-500 text-black' :
                  tab.id === 'leaderboard' ? 'bg-orange-500 text-white' :
                  tab.id === 'disputes' ? 'bg-rose-500 text-white' : 'bg-zinc-700 text-white'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: RECHARGES (MANUAL DEPOSITS) */}
      {activeTab === 'recharges' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-black text-white">طلبات شحن الرصيد</h3>
            <div className="flex gap-1.5">
              {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setRechargeFilter(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    rechargeFilter === f
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {f === 'PENDING' ? 'En attente' : f === 'APPROVED' ? 'Validés' : f === 'REJECTED' ? 'Refusés' : 'Tous'}
                </button>
              ))}
            </div>
          </div>

          {filteredRecharges.length === 0 ? (
            <div className="text-center py-16 rounded-3xl bg-zinc-900/40 border border-dashed border-zinc-800 text-zinc-500 text-sm">
              Makayn hta chi talab chahn f had l-status.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRecharges.map(req => {
                const cleanPhone = req.whatsapp.replace(/[^0-9]/g, '');
                const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  `Salam ${req.username}! Bkhosos talab chahn #${req.id} dyal ${req.amount} DH...`
                )}`;

                return (
                  <div
                    key={req.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${
                      req.status === 'PENDING'
                        ? 'bg-zinc-900/90 border-emerald-500/40 shadow-lg'
                        : 'bg-zinc-950 border-zinc-800/80 opacity-80'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-white font-mono">#{req.id}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">
                          {req.payment_method}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {new Date(req.created_at).toLocaleString('fr-FR')}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                        <span className="text-zinc-300">
                          La3ib: <strong className="text-emerald-400">{req.username}</strong>
                        </span>
                        <span className="text-zinc-400 font-mono">ID eFootball: {req.efootball_id}</span>
                        <span className="text-zinc-400">Solde actuel: <strong className="font-mono">{req.current_balance} DH</strong></span>
                      </div>

                      {req.notes && (
                        <div className="text-xs text-zinc-400 bg-zinc-950 p-2 rounded-lg border border-zinc-800">
                          Note du joueur: <span className="text-zinc-200">{req.notes}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-zinc-800">
                      <div className="text-left lg:text-right mr-2">
                        <span className="text-[10px] text-zinc-500 uppercase font-bold block">Mablagh l-chahn</span>
                        <span className="text-xl font-black text-emerald-400 font-mono">
                          +{req.amount} DH
                        </span>
                      </div>

                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs font-bold"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp ({req.whatsapp})</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      {req.status === 'PENDING' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApproveRecharge(req.id, req.amount, req.username)}
                            disabled={actionLoading}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs shadow-lg shadow-emerald-500/20"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Validé & Zid Rasid</span>
                          </button>

                          <button
                            onClick={() => handleRejectRecharge(req.id)}
                            disabled={actionLoading}
                            className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 text-xs font-bold"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            req.status === 'APPROVED'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {req.status === 'APPROVED' ? 'Validé ✓' : 'Refusé ✕'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TOURNAMENTS (BOTOLAT) MANAGEMENT */}
      {activeTab === 'tournaments' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>Idarat L-Botolat (Tournois)</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Zid botola jdida, modifi les prix w l-mwa3id, awla mhi ay botola f l-mawqi3.
              </p>
            </div>

            <button
              onClick={openAddTournament}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-zinc-950 font-black text-xs shadow-lg shadow-amber-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Zid Botola Jdida</span>
            </button>
          </div>

          {tournamentsList.length === 0 ? (
            <div className="text-center py-20 rounded-3xl bg-zinc-900/40 border border-dashed border-zinc-800 text-zinc-500 text-sm">
              Makayna hta chi botola daba. Wrek 3la "+ Zid Botola Jdida" bach t-creer whda!
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tournamentsList.map(t => (
                <div
                  key={t.id}
                  className="rounded-3xl bg-zinc-900/90 border border-zinc-800 overflow-hidden shadow-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Banner */}
                    <div className="h-44 bg-zinc-950 relative overflow-hidden">
                      <img src={t.banner} alt={t.title} className="w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                      
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                        Ja'iza: {t.prize_pool} DH
                      </div>

                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          t.status === 'REGISTRATION' ? 'bg-emerald-500/80 text-white' :
                          t.status === 'ONGOING' ? 'bg-cyan-500/80 text-white' :
                          t.status === 'COMPLETED' ? 'bg-zinc-700 text-zinc-300' : 'bg-rose-500/80 text-white'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-lg font-black text-white leading-snug">{t.title}</h4>
                        <span className="text-xs font-mono text-zinc-400 shrink-0 bg-zinc-800 px-2 py-1 rounded-md">
                          {t.participant_count || 0}/{t.max_players} Places
                        </span>
                      </div>

                      <p className="text-xs text-zinc-400 line-clamp-2">{t.rules}</p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-2 border-y border-zinc-800/80 text-xs">
                        <div>
                          <span className="text-[10px] text-zinc-500 uppercase font-bold block">Frais</span>
                          <span className="font-black text-emerald-400 font-mono">{t.entry_fee} DH</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-500 uppercase font-bold block">Weqt</span>
                          <span className="font-semibold text-zinc-300">{t.start_date}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-500 uppercase font-bold block">Prize Pool</span>
                          <span className="font-black text-amber-400 font-mono">{t.prize_pool} DH</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-5 pt-0 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800/80 mt-2">
                    <button
                      onClick={() => setSelectedTournamentParticipants({
                        tournamentTitle: t.title,
                        participants: t.participants || []
                      })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      <span>L-Mcharkin ({t.participant_count || 0})</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditTournament(t)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-emerald-500/20 hover:text-emerald-300 text-zinc-200 text-xs font-semibold transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Modifi</span>
                      </button>

                      <button
                        onClick={() => handleDeleteTournament(t.id, t.title)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-xs font-semibold border border-rose-500/30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Mhi</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: LEADERBOARD (CLASSEMENT) MANAGEMENT */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" />
                <span>Idarat L-Classement (Leaderboard)</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                T-hakkam f tartib l-la3ibin: zid la3ib jdid, beddel les victoires w les défaites, awla mhi mn l-classement.
              </p>
            </div>

            <button
              onClick={openAddPlayer}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-zinc-950 font-black text-xs shadow-lg shadow-orange-500/20"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Zid La3ib f L-Classement</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-400 uppercase font-semibold border-b border-zinc-800">
                <tr>
                  <th className="p-3.5 w-16 text-center">Rang</th>
                  <th className="p-3.5">La3ib (Joueur)</th>
                  <th className="p-3.5">eFootball ID</th>
                  <th className="p-3.5 text-center">Wins (Intissarat)</th>
                  <th className="p-3.5 text-center">Losses (Hazai'm)</th>
                  <th className="p-3.5 text-center">Win Rate</th>
                  <th className="p-3.5">Solde (DH)</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {leaderboardList.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="p-3.5 text-center font-bold">
                      {idx === 0 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-black font-black text-xs">1</span>
                      ) : idx === 1 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-zinc-300 text-black font-black text-xs">2</span>
                      ) : idx === 2 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs">3</span>
                      ) : (
                        <span className="text-zinc-500 font-mono">#{idx + 1}</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold text-xs">
                          {p.username.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-bold text-white text-sm">{p.username}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-zinc-400">{p.efootball_id}</td>
                    <td className="p-3.5 text-center font-bold text-emerald-400 font-mono text-sm">{p.wins}</td>
                    <td className="p-3.5 text-center font-bold text-rose-400 font-mono text-sm">{p.losses}</td>
                    <td className="p-3.5 text-center font-bold text-zinc-200 font-mono text-xs">{p.win_rate}%</td>
                    <td className="p-3.5 font-bold text-amber-400 font-mono">{p.balance?.toFixed(2) || '0.00'} DH</td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditPlayer(p)}
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-emerald-500/20 hover:text-emerald-300 text-zinc-200 text-xs font-semibold transition-colors flex items-center gap-1"
                          title="Modifi les statistiques"
                        >
                          <Edit className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Modifi</span>
                        </button>

                        <button
                          onClick={() => handleDeleteLeaderboardPlayer(p.id, p.username, 'reset')}
                          className="px-2 py-1.5 rounded-lg bg-zinc-800 hover:bg-amber-500/20 hover:text-amber-300 text-zinc-300 text-xs font-semibold"
                          title="Rje3 les victoires l 0"
                        >
                          0 pts
                        </button>

                        <button
                          onClick={() => handleDeleteLeaderboardPlayer(p.id, p.username, 'remove')}
                          className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30"
                          title="Mhi mn l-classement"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: DISPUTES */}
      {activeTab === 'disputes' && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-white">Idarat L-Khilafat (Match Disputes)</h3>

          {disputes.length === 0 ? (
            <div className="text-center py-16 rounded-3xl bg-zinc-900/40 border border-dashed border-zinc-800 text-zinc-500 text-sm">
              Lhamdullah makayn hta chi khilaf mftou7 daba. Kolchi tranquille!
            </div>
          ) : (
            <div className="space-y-6">
              {disputes.map(match => (
                <div key={match.id} className="p-6 rounded-3xl bg-zinc-900/90 border border-rose-500/40 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <div>
                      <span className="text-xs font-bold text-rose-400 font-mono">Dispute #{match.id}</span>
                      <h4 className="text-sm font-bold text-white mt-0.5">{match.title}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Prize Pot</span>
                      <span className="text-base font-black text-amber-400 font-mono">{match.prize} DH</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400">{match.creator_name} (Hôte)</span>
                        <span className="text-xs font-mono">Score: {match.creator_score}</span>
                      </div>
                      <p className="text-xs text-zinc-400">
                        Claimed Winner: <strong>{match.creator_claimed_winner === match.creator_id ? 'Raso' : 'L-khssim'}</strong>
                      </p>
                      {match.creator_proof ? (
                        <div className="mt-2 rounded-xl overflow-hidden border border-zinc-800 max-h-48">
                          <img src={match.creator_proof} alt="Proof 1" className="w-full object-cover" />
                        </div>
                      ) : (
                        <div className="text-[11px] text-zinc-500 italic">Makaynch capture</div>
                      )}
                    </div>

                    <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-400">{match.opponent_name} (Adversaire)</span>
                        <span className="text-xs font-mono">Score: {match.opponent_score}</span>
                      </div>
                      <p className="text-xs text-zinc-400">
                        Claimed Winner: <strong>{match.opponent_claimed_winner === match.opponent_id ? 'Raso' : 'L-khssim'}</strong>
                      </p>
                      {match.opponent_proof ? (
                        <div className="mt-2 rounded-xl overflow-hidden border border-zinc-800 max-h-48">
                          <img src={match.opponent_proof} alt="Proof 2" className="w-full object-cover" />
                        </div>
                      ) : (
                        <div className="text-[11px] text-zinc-500 italic">Makaynch capture</div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-800 flex flex-wrap gap-2 justify-end">
                    <button
                      onClick={() => handleResolveDispute(match.id, 'PICK_WINNER', match.creator_id)}
                      disabled={actionLoading}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black"
                    >
                      🏆 Fowwez {match.creator_name} ({match.prize} DH)
                    </button>

                    <button
                      onClick={() => handleResolveDispute(match.id, 'PICK_WINNER', match.opponent_id)}
                      disabled={actionLoading}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-black"
                    >
                      🏆 Fowwez {match.opponent_name} ({match.prize} DH)
                    </button>

                    <button
                      onClick={() => handleResolveDispute(match.id, 'REFUND_BOTH')}
                      disabled={actionLoading}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                    >
                      Annuler l-Match w Rje3 l-mise l bjouj
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: USERS & BALANCE ADJUSTMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>Qayimat L-La3ibin & Idarat L-Hisabat</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Chouf jami3 ma3loumat l-la3ibin, l-mots de passe, t-7akem f l-ban (T-bani awla t-7ayed l-ban), w zayd/n9ess rasid.
              </p>
            </div>

            {/* Filter Chips & Total Stats */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl font-mono">
                Total: <strong className="text-white">{usersList.length}</strong>
              </span>
              <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
                <button
                  type="button"
                  onClick={() => setUserStatusFilter('ALL')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    userStatusFilter === 'ALL' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Tous ({usersList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setUserStatusFilter('ACTIVE')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    userStatusFilter === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Actifs ({usersList.filter(u => u.role !== 'BANNED' && !u.is_banned).length})
                </button>
                <button
                  type="button"
                  onClick={() => setUserStatusFilter('BANNED')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    userStatusFilter === 'BANNED' ? 'bg-rose-500/20 text-rose-400' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Bannis ({usersList.filter(u => u.role === 'BANNED' || u.is_banned).length})
                </button>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute start-3.5 top-3" />
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Qelleb b Pseudo, Email, WhatsApp, awla eFootball ID..."
              className="w-full ps-10 pe-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950/40">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-400 uppercase font-semibold border-b border-zinc-800">
                <tr>
                  <th className="p-3.5">La3ib (Pseudo/Email)</th>
                  <th className="p-3.5">Mot de Passe</th>
                  <th className="p-3.5">eFootball ID</th>
                  <th className="p-3.5">WhatsApp</th>
                  <th className="p-3.5">Rasid</th>
                  <th className="p-3.5">W / L</th>
                  <th className="p-3.5">Statut</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 bg-zinc-900/40">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-zinc-500">
                      Makayn 7ta la3ib b had l-ma3loumat.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(u => {
                    const isBanned = u.role === 'BANNED' || u.is_banned === true;
                    const isPasswordVisible = visiblePasswords[u.id] || false;

                    return (
                      <tr key={u.id} className={`hover:bg-zinc-800/40 transition-colors ${isBanned ? 'bg-rose-950/10' : ''}`}>
                        {/* Player / Email */}
                        <td className="p-3.5">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{u.username}</span>
                            {isBanned && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                Banni
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-mono text-zinc-500 truncate max-w-[170px]">
                            {u.email}
                          </div>
                        </td>

                        {/* Password */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5">
                            {u.password ? (
                              <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 px-2.5 py-1 rounded-lg font-mono text-[11px]">
                                <span className={isPasswordVisible ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
                                  {isPasswordVisible ? u.password : '••••••••'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setVisiblePasswords(prev => ({ ...prev, [u.id]: !prev[u.id] }))}
                                  className="text-zinc-400 hover:text-white p-0.5"
                                  title={isPasswordVisible ? 'Dreg l-mot de passe' : 'Bayyen l-mot de passe'}
                                >
                                  {isPasswordVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleCopyPassword(u.password, u.id)}
                                  className="text-zinc-400 hover:text-emerald-300 p-0.5"
                                  title="Copier mot de passe"
                                >
                                  {copiedPwdUserId === u.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            ) : (
                              <span className="text-[11px] font-mono text-zinc-500 italic bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                                Hash Bcrypt
                              </span>
                            )}

                            {/* Reset / Set Password button */}
                            <button
                              type="button"
                              onClick={() => setPasswordChangeModal({ userId: u.id, username: u.username, newPassword: '' })}
                              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                              title="Beddel Mot de passe"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                        {/* eFootball ID */}
                        <td className="p-3.5 font-mono font-semibold text-zinc-300">
                          {u.efootball_id}
                        </td>

                        {/* WhatsApp */}
                        <td className="p-3.5 font-mono">
                          <a
                            href={`https://wa.me/${(u.whatsapp || '').replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-400 hover:underline"
                          >
                            <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{u.whatsapp}</span>
                          </a>
                        </td>

                        {/* Balance */}
                        <td className="p-3.5 font-bold text-emerald-400 font-mono">
                          {u.balance.toFixed(2)} DH
                        </td>

                        {/* W / L */}
                        <td className="p-3.5 font-mono text-zinc-300">
                          <span className="text-emerald-400 font-semibold">{u.wins}W</span> / <span className="text-rose-400 font-semibold">{u.losses}L</span>
                        </td>

                        {/* Statut Badge */}
                        <td className="p-3.5">
                          {isBanned ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                              <Ban className="w-2.5 h-2.5" /> Banni
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Actif
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Ban / Unban */}
                            {isBanned ? (
                              <button
                                type="button"
                                onClick={() => handleToggleBan(u.id, true, u.username)}
                                disabled={actionLoading}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-semibold flex items-center gap-1 transition-colors border border-emerald-500/30"
                                title="7eyed l-ban"
                              >
                                <Unlock className="w-3 h-3" />
                                <span>Débannir</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleToggleBan(u.id, false, u.username)}
                                disabled={actionLoading}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 text-xs font-semibold flex items-center gap-1 transition-colors border border-rose-500/30"
                                title="Bani had l-hisab"
                              >
                                <Ban className="w-3 h-3" />
                                <span>Bannir</span>
                              </button>
                            )}

                            {/* Adjust Balance */}
                            <button
                              type="button"
                              onClick={() => setSelectedUser(u)}
                              className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors border border-zinc-700/60"
                            >
                              ± Rasid
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: SETTINGS & PAYMENT METHODS */}
      {activeTab === 'settings' && (
        <div className="max-w-4xl space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-400" />
                <span>I3dadat l-Mawqi3 & Toroq L-Chahn</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Thakkam f ma3loumat l-khalas (CIH, Cash Plus, Attijari, Inwi/Orange Money, USDT) li kaychoufhoum l-za'ir f nafida dyal chahn.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddMethodModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-400/20 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Zid Tariqat Chahn Jdida</span>
            </button>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-8">
            {/* 1. General Platform Settings */}
            <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-3xl space-y-4">
              <h4 className="text-sm font-black text-white uppercase tracking-wider border-b border-zinc-800 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>1. Ma3loumat L-Idara & L-Watsapp</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Raqm WhatsApp dyal Admin (Tawassoul & Reçus)
                  </label>
                  <input
                    type="text"
                    value={settings.admin_whatsapp || ''}
                    onChange={(e) => setSettings({ ...settings, admin_whatsapp: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="+212604084574"
                    required
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Had l-raqm kayt-fath 3lih WhatsApp direct mnin l-la3ib kay-cliqui 3la "Twasel m3a Admin".
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Taux Commission Plateforme (Ex: 0.10 = 10%)
                  </label>
                  <input
                    type="text"
                    value={settings.commission_rate || '0.10'}
                    onChange={(e) => setSettings({ ...settings, commission_rate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Nesba l-idara mn kol match (0.10 = 10% d l-arba7).
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Toroq L-Chahn (Payment Methods) Management */}
            <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-3xl space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-emerald-400" />
                  <span>2. Toroq L-Chahn Li Kaybanou L-Za'ir (Recharge Methods)</span>
                </h4>
                <span className="text-xs text-zinc-400 font-mono">
                  {paymentMethods.filter(m => m.enabled !== false).length} M-khedmin / {paymentMethods.length} Total
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method, idx) => {
                  const isEnabled = method.enabled !== false;
                  return (
                    <div
                      key={method.id || idx}
                      className={`p-4 rounded-2xl border transition-all ${
                        isEnabled
                          ? 'bg-zinc-950/80 border-zinc-800'
                          : 'bg-zinc-950/40 border-zinc-800/50 opacity-60'
                      }`}
                    >
                      {/* Card Header: Method Name & Active Toggle */}
                      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={method.name || ''}
                            onChange={(e) => handleUpdatePaymentMethodField(idx, 'name', e.target.value)}
                            className="text-sm font-bold text-white bg-transparent border-b border-zinc-700 focus:outline-none focus:border-emerald-400 px-1"
                            placeholder="Nom de la méthode"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleTogglePaymentMethod(idx)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                              isEnabled
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                            }`}
                          >
                            {isEnabled ? '✓ M-khedma' : '✕ M-weqfa'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePaymentMethod(idx)}
                            className="text-zinc-500 hover:text-rose-400 p-1"
                            title="Mseh had tariqa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Fields */}
                      <div className="space-y-3 text-xs">
                        {/* RIB (if bank or has rib) */}
                        {('rib' in method || method.type === 'bank') && (
                          <div>
                            <label className="block text-[11px] text-zinc-400 font-semibold mb-1">
                              RIB (24 Arqam)
                            </label>
                            <input
                              type="text"
                              value={method.rib || ''}
                              onChange={(e) => handleUpdatePaymentMethodField(idx, 'rib', e.target.value)}
                              placeholder="230 780 0000000000000000 00"
                              className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        )}

                        {/* CIN (if cash or has cin) */}
                        {('cin' in method || method.type === 'cash') && (
                          <div>
                            <label className="block text-[11px] text-zinc-400 font-semibold mb-1">
                              CIN (Raqm L-Bitaqa L-Wataniya)
                            </label>
                            <input
                              type="text"
                              value={method.cin || ''}
                              onChange={(e) => handleUpdatePaymentMethodField(idx, 'cin', e.target.value)}
                              placeholder="AB123456"
                              className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        )}

                        {/* Phone (if phone or has phone) */}
                        {('phone' in method || method.type === 'phone') && (
                          <div>
                            <label className="block text-[11px] text-zinc-400 font-semibold mb-1">
                              Numéro Téléphone / Raqm Chahn
                            </label>
                            <input
                              type="text"
                              value={method.phone || ''}
                              onChange={(e) => handleUpdatePaymentMethodField(idx, 'phone', e.target.value)}
                              placeholder="+212604084574"
                              className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        )}

                        {/* Crypto Wallet Address & Network */}
                        {('wallet_address' in method || method.type === 'crypto') && (
                          <>
                            <div>
                              <label className="block text-[11px] text-zinc-400 font-semibold mb-1">
                                Adresse Portefeuille (USDT Wallet)
                              </label>
                              <input
                                type="text"
                                value={method.wallet_address || ''}
                                onChange={(e) => handleUpdatePaymentMethodField(idx, 'wallet_address', e.target.value)}
                                placeholder="TYDzsYUEWvYpxapbFCeTXvkRBxmPgkYNi8"
                                className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-zinc-400 font-semibold mb-1">
                                Réseau (Network)
                              </label>
                              <input
                                type="text"
                                value={method.network || 'TRC20'}
                                onChange={(e) => handleUpdatePaymentMethodField(idx, 'network', e.target.value)}
                                placeholder="TRC20"
                                className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                          </>
                        )}

                        {/* Beneficiary Name */}
                        <div>
                          <label className="block text-[11px] text-zinc-400 font-semibold mb-1">
                            Nom du bénéficiaire (Ism L-Mustafid)
                          </label>
                          <input
                            type="text"
                            value={method.holder_name || ''}
                            onChange={(e) => handleUpdatePaymentMethodField(idx, 'holder_name', e.target.value)}
                            placeholder="MOHAMMED ADMIN"
                            className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        {/* Custom Instructions / Notice to Visitor */}
                        <div>
                          <label className="block text-[11px] text-zinc-400 font-semibold mb-1">
                            Ta3limat & Moulahadat L-Tahwil (Kaychoufha l-za'ir)
                          </label>
                          <textarea
                            rows={2}
                            value={method.instructions || ''}
                            onChange={(e) => handleUpdatePaymentMethodField(idx, 'instructions', e.target.value)}
                            placeholder="Sifet l-flous f had l-hisab w sift reçu f WhatsApp..."
                            className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500 resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={actionLoading}
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-black text-sm text-zinc-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-xl shadow-emerald-400/20"
              >
                <Save className="w-4 h-4" />
                <span>Sauvegarder Jami3 L-Paramètres & Toroq L-Chahn</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL: ADD / EDIT TOURNAMENT */}
      {/* ========================================================== */}
      {showTournamentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>{editingTournament ? 'Modifi L-Botola' : 'Zid Botola Jdida'}</span>
              </h3>
              <button
                onClick={() => setShowTournamentModal(false)}
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTournament} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  3onwan l-Botola (Titre)
                </label>
                <input
                  type="text"
                  value={tournamentForm.title}
                  onChange={(e) => setTournamentForm({ ...tournamentForm, title: e.target.value })}
                  placeholder="Ex: 🏆 Ramadan eFootball Cup 2026"
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Lien dyal Tsweera (Banner Image URL)
                </label>
                <input
                  type="url"
                  value={tournamentForm.banner}
                  onChange={(e) => setTournamentForm({ ...tournamentForm, banner: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Frais (DH)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={tournamentForm.entry_fee}
                    onChange={(e) => setTournamentForm({ ...tournamentForm, entry_fee: e.target.value })}
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Prize Pool (DH)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={tournamentForm.prize_pool}
                    onChange={(e) => setTournamentForm({ ...tournamentForm, prize_pool: e.target.value })}
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Max Places
                  </label>
                  <select
                    value={tournamentForm.max_players}
                    onChange={(e) => setTournamentForm({ ...tournamentForm, max_players: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="8">8 Places</option>
                    <option value="16">16 Places</option>
                    <option value="32">32 Places</option>
                    <option value="64">64 Places</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Weqt L-Bdaya (Date/Heure)
                  </label>
                  <input
                    type="text"
                    value={tournamentForm.start_date}
                    onChange={(e) => setTournamentForm({ ...tournamentForm, start_date: e.target.value })}
                    placeholder="Ex: Vendredi 22:00 GMT+1"
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Statut L-Botola
                  </label>
                  <select
                    value={tournamentForm.status}
                    onChange={(e) => setTournamentForm({ ...tournamentForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="REGISTRATION">REGISTRATION (Tasjil Mftou7)</option>
                    <option value="ONGOING">ONGOING (Kanl3bo daba)</option>
                    <option value="COMPLETED">COMPLETED (Salat)</option>
                    <option value="CANCELLED">CANCELLED (Moulghat)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Qawanin l-botola (Règles & Format)
                </label>
                <textarea
                  rows={2}
                  value={tournamentForm.rules}
                  onChange={(e) => setTournamentForm({ ...tournamentForm, rules: e.target.value })}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowTournamentModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-zinc-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-xs font-bold text-zinc-950 shadow-lg shadow-amber-500/20"
                >
                  {editingTournament ? 'Sauvegarder les modifications' : 'Zid L-Botola Daba'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL: TOURNAMENT PARTICIPANTS LIST */}
      {/* ========================================================== */}
      {selectedTournamentParticipants && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h3 className="text-sm font-bold text-white">
                  L-Mcharkin f: <span className="text-amber-400">{selectedTournamentParticipants.tournamentTitle}</span>
                </h3>
                <span className="text-xs text-zinc-400">
                  Total: {selectedTournamentParticipants.participants.length} joueurs
                </span>
              </div>
              <button
                onClick={() => setSelectedTournamentParticipants(null)}
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {selectedTournamentParticipants.participants.length === 0 ? (
              <div className="text-center py-10 text-zinc-500 text-xs">
                Ba9i hta chi wahed ma tsjel f had l-botola.
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {selectedTournamentParticipants.participants.map((p, idx) => (
                  <div key={p.participant_id || idx} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{p.username}</div>
                      <div className="text-zinc-400 font-mono text-[11px]">eFootball: {p.efootball_id}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-zinc-400 font-mono text-[11px]">{p.whatsapp}</div>
                      <span className="text-[10px] text-zinc-500">{new Date(p.joined_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setSelectedTournamentParticipants(null)}
              className="w-full py-2.5 rounded-xl bg-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 mt-2"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL: ADD / EDIT LEADERBOARD PLAYER */}
      {/* ========================================================== */}
      {showLeaderboardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" />
                <span>{editingPlayer ? `Modifi: ${editingPlayer.username}` : 'Zid La3ib f L-Classement'}</span>
              </h3>
              <button
                onClick={() => setShowLeaderboardModal(false)}
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLeaderboardPlayer} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Pseudo (Username)
                </label>
                <input
                  type="text"
                  value={leaderboardForm.username}
                  onChange={(e) => setLeaderboardForm({ ...leaderboardForm, username: e.target.value })}
                  placeholder="Ex: Reda_PES"
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  eFootball ID
                </label>
                <input
                  type="text"
                  value={leaderboardForm.efootball_id}
                  onChange={(e) => setLeaderboardForm({ ...leaderboardForm, efootball_id: e.target.value })}
                  placeholder="Ex: EF-123456"
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-orange-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Wins (Intissarat)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={leaderboardForm.wins}
                    onChange={(e) => setLeaderboardForm({ ...leaderboardForm, wins: e.target.value })}
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-emerald-400 font-bold font-mono text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Losses (Hazai'm)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={leaderboardForm.losses}
                    onChange={(e) => setLeaderboardForm({ ...leaderboardForm, losses: e.target.value })}
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-rose-400 font-bold font-mono text-sm focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Solde (DH)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={leaderboardForm.balance}
                    onChange={(e) => setLeaderboardForm({ ...leaderboardForm, balance: e.target.value })}
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-orange-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    WhatsApp (Optionnel)
                  </label>
                  <input
                    type="text"
                    value={leaderboardForm.whatsapp}
                    onChange={(e) => setLeaderboardForm({ ...leaderboardForm, whatsapp: e.target.value })}
                    placeholder="+2126..."
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-orange-400"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLeaderboardModal(false)}
                  className="flex-1 py-2 rounded-xl bg-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-zinc-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-xs font-bold text-zinc-950 shadow-lg shadow-orange-500/20"
                >
                  {editingPlayer ? 'Mise à jour' : 'Zid La3ib'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL: MANUAL USER BALANCE ADJUSTMENT */}
      {/* ========================================================== */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">
              Zid awla N9es Rasid: <span className="text-emerald-400">{selectedUser.username}</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Rasid dyalo l-hali: <strong className="text-white font-mono">{selectedUser.balance.toFixed(2)} DH</strong>
            </p>

            <form onSubmit={handleUserAdjustment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Mablagh (+ l ziyada, - l khasm)
                </label>
                <input
                  type="number"
                  step="1"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Sbab (Motif)
                </label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 py-2 rounded-xl bg-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-zinc-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-xs font-bold text-zinc-950"
                >
                  Appliquer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL: CHANGE USER PASSWORD */}
      {/* ========================================================== */}
      {passwordChangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Beddel Mot de passe ({passwordChangeModal.username})</span>
              </h3>
              <button
                onClick={() => setPasswordChangeModal(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Mot de passe Jdid (New Password)
                </label>
                <input
                  type="text"
                  value={passwordChangeModal.newPassword}
                  onChange={(e) => setPasswordChangeModal({ ...passwordChangeModal, newPassword: e.target.value })}
                  placeholder="Dakhel mot de passe jdid..."
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-400"
                  autoFocus
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordChangeModal(null)}
                  className="flex-1 py-2 rounded-xl bg-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-zinc-700"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSavePassword}
                  disabled={actionLoading || !passwordChangeModal.newPassword.trim()}
                  className="flex-1 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-xs font-black text-zinc-950 disabled:opacity-50"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL: ADD PAYMENT METHOD */}
      {/* ========================================================== */}
      {showAddMethodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Zid Tariqat Chahn Jdida</span>
              </h3>
              <button
                onClick={() => setShowAddMethodModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewPaymentMethod} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Nom de la méthode (Ex: Barid Bank, BMCE, PayPal...)
                </label>
                <input
                  type="text"
                  value={newMethodForm.name}
                  onChange={(e) => setNewMethodForm({ ...newMethodForm, name: e.target.value })}
                  placeholder="Ex: Barid Bank"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Type de paiement
                </label>
                <select
                  value={newMethodForm.type}
                  onChange={(e) => setNewMethodForm({ ...newMethodForm, type: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400"
                >
                  <option value="bank">Virement Bancaire (RIB)</option>
                  <option value="cash">Agence de transfert (Cash / CIN)</option>
                  <option value="phone">Portefeuille Mobile (Numéro de téléphone)</option>
                  <option value="crypto">Crypto-monnaie (USDT / Wallet)</option>
                </select>
              </div>

              {newMethodForm.type === 'bank' && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    RIB (24 Chiffres)
                  </label>
                  <input
                    type="text"
                    value={newMethodForm.rib}
                    onChange={(e) => setNewMethodForm({ ...newMethodForm, rib: e.target.value })}
                    placeholder="350 810 0000000000000000 99"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>
              )}

              {newMethodForm.type === 'cash' && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    CIN
                  </label>
                  <input
                    type="text"
                    value={newMethodForm.cin}
                    onChange={(e) => setNewMethodForm({ ...newMethodForm, cin: e.target.value })}
                    placeholder="AB123456"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>
              )}

              {newMethodForm.type === 'phone' && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Numéro de Téléphone
                  </label>
                  <input
                    type="text"
                    value={newMethodForm.phone}
                    onChange={(e) => setNewMethodForm({ ...newMethodForm, phone: e.target.value })}
                    placeholder="+212600000000"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>
              )}

              {newMethodForm.type === 'crypto' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Adresse Portefeuille (Wallet)
                    </label>
                    <input
                      type="text"
                      value={newMethodForm.wallet_address}
                      onChange={(e) => setNewMethodForm({ ...newMethodForm, wallet_address: e.target.value })}
                      placeholder="T..."
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Réseau (Network)
                    </label>
                    <input
                      type="text"
                      value={newMethodForm.network}
                      onChange={(e) => setNewMethodForm({ ...newMethodForm, network: e.target.value })}
                      placeholder="TRC20"
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Nom du Bénéficiaire (Nom Complet)
                </label>
                <input
                  type="text"
                  value={newMethodForm.holder_name}
                  onChange={(e) => setNewMethodForm({ ...newMethodForm, holder_name: e.target.value })}
                  placeholder="MOHAMMED ADMIN"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Ta3limat & Moulahada (Instructions affichées au visiteur)
                </label>
                <textarea
                  rows={2}
                  value={newMethodForm.instructions}
                  onChange={(e) => setNewMethodForm({ ...newMethodForm, instructions: e.target.value })}
                  placeholder="Sifet l-mablagh puis envoyez le reçu sur WhatsApp..."
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMethodModal(false)}
                  className="flex-1 py-2 rounded-xl bg-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-zinc-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-xs font-black text-zinc-950"
                >
                  Zid Tariqa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
