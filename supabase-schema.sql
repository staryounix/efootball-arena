-- =========================================================
-- eFootball Arena - Supabase Schema
-- Run this script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/kccybqothwdkqqttgvqg/sql
-- =========================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  efootball_id TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  balance DOUBLE PRECISION NOT NULL DEFAULT 0.0,
  role TEXT NOT NULL DEFAULT 'USER',
  avatar TEXT,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Recharge Requests Table
CREATE TABLE IF NOT EXISTS public.recharge_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount DOUBLE PRECISION NOT NULL,
  payment_method TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  notes TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- 3. Withdrawal Requests Table
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount DOUBLE PRECISION NOT NULL,
  method TEXT NOT NULL,
  destination_info TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- 4. Matches Table
CREATE TABLE IF NOT EXISTS public.matches (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  game TEXT NOT NULL DEFAULT 'eFootball',
  platform TEXT NOT NULL DEFAULT 'Mobile',
  stake DOUBLE PRECISION NOT NULL,
  prize DOUBLE PRECISION NOT NULL,
  creator_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  opponent_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'OPEN',
  room_code TEXT,
  creator_score INTEGER,
  opponent_score INTEGER,
  creator_proof TEXT,
  opponent_proof TEXT,
  creator_claimed_winner TEXT,
  opponent_claimed_winner TEXT,
  winner_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  dispute_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Match Messages Table
CREATE TABLE IF NOT EXISTS public.match_messages (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Tournaments Table
CREATE TABLE IF NOT EXISTS public.tournaments (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  banner TEXT,
  entry_fee DOUBLE PRECISION NOT NULL,
  prize_pool DOUBLE PRECISION NOT NULL,
  max_players INTEGER NOT NULL DEFAULT 16,
  status TEXT NOT NULL DEFAULT 'REGISTRATION',
  start_date TEXT NOT NULL,
  rules TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Tournament Participants Table
CREATE TABLE IF NOT EXISTS public.tournament_participants (
  id TEXT PRIMARY KEY,
  tournament_id TEXT NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tournament_id, user_id)
);

-- 8. Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount DOUBLE PRECISION NOT NULL,
  balance_after DOUBLE PRECISION NOT NULL,
  description TEXT NOT NULL,
  reference_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Platform Settings Table
CREATE TABLE IF NOT EXISTS public.platform_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Default Settings
INSERT INTO public.platform_settings (key, value) VALUES
  ('admin_whatsapp', '+212604084574'),
  ('cih_rib', '230 780 0000000000000000 00'),
  ('cih_name', 'MOHAMMED ADMIN'),
  ('cashplus_name', 'MOHAMMED ADMIN'),
  ('cashplus_cin', 'AB123456'),
  ('commission_rate', '0.10')
ON CONFLICT (key) DO NOTHING;

-- Disable Row Level Security (RLS) so service role / server can read/write without restriction
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.recharge_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.withdrawal_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.matches DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.match_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tournaments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tournament_participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.platform_settings DISABLE ROW LEVEL SECURITY;
