-- Premier Tech Solution: contact form leads

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 254),
  phone text check (phone is null or char_length(phone) <= 30),
  message text not null check (char_length(message) between 1 and 5000),
  ip_hash text check (ip_hash is null or char_length(ip_hash) = 64),
  user_agent text check (user_agent is null or char_length(user_agent) <= 300),
  status text not null default 'new' check (status in ('new','contacted','closed','spam'))
);

alter table public.leads enable row level security;

revoke all on table public.leads from anon, authenticated;

grant select, insert, update on table public.leads to service_role;

create index if not exists leads_created_at_idx on public.leads (created_at desc);

create index if not exists leads_ip_recent_idx on public.leads (ip_hash, created_at desc);
