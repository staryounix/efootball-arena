INSERT INTO public.users (id, username, email, password_hash, efootball_id, whatsapp, balance, role, avatar, wins, losses, created_at) 
VALUES ('usr_admin_001', 'admin', 'admin@example.com', extensions.crypt('SuperSecret123!', extensions.gen_salt('bf')), '99999', '+212600000000', 0, 'SUPER_ADMIN', NULL, 0, 0, now())
ON CONFLICT (id) DO UPDATE SET 
    username = EXCLUDED.username,
    email = EXCLUDED.email,
    password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role;
