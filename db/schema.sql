-- Trader Joe's prototype: one table per conversion, plus tracked events.
create extension if not exists pgcrypto;

create table if not exists subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  source      text not null,
  visitor_id  text not null,
  created_at  timestamptz not null default now()
);

create table if not exists drop_alerts (
  id          uuid primary key default gen_random_uuid(),
  drop_id     text not null,
  email       text not null,
  visitor_id  text not null,
  created_at  timestamptz not null default now(),
  unique (drop_id, email)
);
create index if not exists drop_alerts_visitor on drop_alerts (visitor_id);

create table if not exists members (
  id            uuid primary key default gen_random_uuid(),
  member_number text not null unique,
  email         text not null,
  birth_month   int,
  store_id      text not null,
  categories    text[] not null default '{}',
  visitor_id    text not null unique,
  created_at    timestamptz not null default now()
);

create table if not exists waitlist (
  id          uuid primary key default gen_random_uuid(),
  store_id    text not null,
  email       text not null,
  visitor_id  text not null,
  created_at  timestamptz not null default now(),
  unique (store_id, email)
);
create index if not exists waitlist_store on waitlist (store_id);

create table if not exists events (
  id          bigserial primary key,
  name        text not null,
  client_id   text not null,
  session_id  text,
  page        text,
  params      jsonb not null default '{}',
  created_at  timestamptz not null default now()
);
create index if not exists events_client on events (client_id, created_at desc);
