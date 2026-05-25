-- Run this in your Supabase SQL editor
-- Project: User Authentication

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Users table
create table if not exists users (
  id           uuid primary key default gen_random_uuid(),
  email        text unique not null,
  name         text not null,
  password_hash text not null,
  created_at   timestamptz default now() not null,
  updated_at   timestamptz default now() not null
);

-- Auto-update updated_at on every row change
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_updated_at
  before update on users
  for each row execute procedure set_updated_at();

-- Index on email for fast lookups
create index if not exists users_email_idx on users(email);

-- Row Level Security: disable public access (server uses service-role key)
alter table users enable row level security;

-- No public policies needed — backend accesses via service-role key only
-- This keeps password_hash completely server-side
