-- Run this once in your Supabase SQL editor
-- Table that holds the queue of promotional email campaigns

create table if not exists public.promo_queue (
  id           uuid primary key default gen_random_uuid(),
  subject      text not null,
  headline     text not null,
  body_content text not null,
  cta_text     text,
  cta_url      text,
  scheduled_for timestamp with time zone not null,
  status       text not null default 'pending'
                 check (status in ('pending', 'processing', 'sent', 'cancelled')),
  started_at   timestamp with time zone,
  sent_at      timestamp with time zone,
  sent_count   integer default 0,
  failed_count integer default 0,
  created_at   timestamp with time zone default now()
);

-- Only service role can read/write (called from server-side cron only)
alter table public.promo_queue enable row level security;
