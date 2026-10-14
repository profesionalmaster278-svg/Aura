-- ==============================================================================
-- AURA CROWN & CUT AI - MODULE A: SUPABASE MIGRATION
-- Migration: 20261012_init.sql
-- ==============================================================================

create extension if not exists pg_cron;

create table if not exists public.hair_consultations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  demographic_tier text not null check (demographic_tier in ('kid', 'teen', 'adult', 'senior')),
  style_category text not null check (style_category in ('masculine', 'feminine', 'androgynous')),
  face_shape text not null check (face_shape in ('oval', 'round', 'square', 'heart', 'diamond', 'oblong', 'triangle')),
  detected_metrics jsonb not null,
  selected_style text not null,
  render_url text not null,
  stylist_brief jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.hair_consultations enable row level security;

create policy "Users can view and manage their own consultations"
  on public.hair_consultations for all
  using (auth.uid() = user_id);

-- Hard-delete ephemeral generation records older than 24 hours
select cron.schedule('purge-ephemeral-consultations', '0 * * * *', $$
  delete from public.hair_consultations where created_at < now() - interval '24 hours';
$$);
