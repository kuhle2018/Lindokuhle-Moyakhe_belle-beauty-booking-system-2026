-- Run this once in the Supabase SQL Editor before deploying.
create extension if not exists pgcrypto;

create table if not exists public.belle_bookings (
  id uuid primary key default gen_random_uuid(),
  first_name text not null check (char_length(first_name) between 1 and 60),
  surname text not null check (char_length(surname) between 1 and 60),
  client_phone text not null check (char_length(client_phone) between 3 and 30),
  service text not null check (char_length(service) between 1 and 80),
  appointment_date date not null,
  appointment_time time not null,
  notes text,
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  cancellation_token uuid not null default gen_random_uuid() unique,
  created_at timestamptz not null default now(),
  cancelled_at timestamptz
);

create index if not exists belle_bookings_date_status_idx on public.belle_bookings (appointment_date, status);
alter table public.belle_bookings enable row level security;

create or replace function public.belle_availability(p_date date)
returns table(booked_count integer, remaining integer, fully_booked boolean)
language sql security definer set search_path = public as $$
  select count(*)::integer, greatest(5 - count(*)::integer, 0), count(*) >= 5
  from belle_bookings
  where appointment_date = p_date and status = 'confirmed';
$$;

create or replace function public.belle_create_booking(p_first_name text, p_surname text, p_phone text, p_service text, p_date date, p_time time, p_notes text default null)
returns table(id uuid, cancellation_token uuid, remaining integer)
language plpgsql security definer set search_path = public as $$
declare booking_count integer;
begin
  if p_date < current_date then raise exception 'BELLE_PAST_DATE'; end if;
  perform pg_advisory_xact_lock(hashtext('belle-bookings-' || p_date::text));
  select count(*) into booking_count from belle_bookings where appointment_date = p_date and status = 'confirmed';
  if booking_count >= 5 then raise exception 'BELLE_FULL'; end if;
  return query
  with inserted as (
    insert into belle_bookings (first_name, surname, client_phone, service, appointment_date, appointment_time, notes)
    values (p_first_name, p_surname, p_phone, p_service, p_date, p_time, p_notes)
    returning belle_bookings.id, belle_bookings.cancellation_token
  )
  select inserted.id, inserted.cancellation_token, 5 - booking_count - 1 from inserted;
end;
$$;

create or replace function public.belle_cancel_booking(p_token uuid)
returns table(first_name text, surname text, service text, appointment_date date, appointment_time time)
language plpgsql security definer set search_path = public as $$
begin
  return query
  update belle_bookings
  set status = 'cancelled', cancelled_at = now()
  where cancellation_token = p_token and status = 'confirmed'
  returning belle_bookings.first_name, belle_bookings.surname, belle_bookings.service, belle_bookings.appointment_date, belle_bookings.appointment_time;
end;
$$;

revoke all on public.belle_bookings from anon, authenticated;
revoke all on function public.belle_availability(date), public.belle_create_booking(text, text, text, text, date, time, text), public.belle_cancel_booking(uuid) from anon, authenticated;
