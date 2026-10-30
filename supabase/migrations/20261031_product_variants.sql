-- Run this once in Supabase SQL Editor for an existing store database.
alter table public.products
  add column if not exists sizes jsonb not null default '[6,7,8,9,10,11]'::jsonb,
  add column if not exists colors jsonb not null default '[]'::jsonb;
