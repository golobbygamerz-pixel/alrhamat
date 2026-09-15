-- ============================================================
-- AL RAHAMAT HOTEL — SUPABASE DATABASE
-- Real booking + availability + admin system
-- ============================================================
create extension if not exists pgcrypto;
-- ============================================================
-- ENUM TYPES
-- ============================================================
do $$
begin
  if not exists (
    select 1 from pg_type where typname = 'booking_status'
  ) then
    create type booking_status as enum (
      'pending',
      'confirmed',
      'checked_in',
      'checked_out',
      'cancelled'
    );
  end if;
  if not exists (
    select 1 from pg_type where typname = 'payment_status'
  ) then
    create type payment_status as enum (
      'pending',
      'paid',
      'failed',
      'refunded'
    );
  end if;
  if not exists (
    select 1 from pg_type where typname = 'room_unit_status'
  ) then
    create type room_unit_status as enum (
      'available',
      'occupied',
      'cleaning',
      'maintenance'
    );
  end if;
end
$$;
-- ============================================================
-- ROOMS
-- ============================================================
create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null,
  price_per_night numeric(12,2) not null check (price_per_night >= 0),
  room_size integer not null check (room_size > 0),
  max_guests integer not null check (max_guests > 0),
  bed_type text not null check (
    bed_type in (
      'King Bed',
      'Queen Bed',
      'Twin Beds',
      'Single Bed'
    )
  ),
  total_units integer not null default 0 check (total_units >= 0),
  image_url text not null,
  gallery jsonb not null default '[]'::jsonb,
  amenities jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- ============================================================
-- PHYSICAL ROOM UNITS
-- Example: Deluxe Room → 101, 102, 103...
-- ============================================================
create table if not exists public.room_units (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id)
    on delete cascade,
  room_number text unique not null,
  status room_unit_status not null default 'available',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists room_units_room_id_idx
  on public.room_units(room_id);
create index if not exists room_units_status_idx
  on public.room_units(status);
-- ============================================================
-- BOOKINGS
-- ============================================================
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_code text unique not null,
  room_id uuid not null references public.rooms(id),
  guest_first_name text not null,
  guest_last_name text not null,
  phone text not null,
  email text not null,
  check_in date not null,
  check_out date not null,
  adults integer not null default 1
    check (adults > 0),
  children integer not null default 0
    check (children >= 0),
  rooms_count integer not null default 1
    check (rooms_count > 0),
  bed_type text not null check (
    bed_type in (
      'King Bed',
      'Queen Bed',
      'Twin Beds',
      'Single Bed'
    )
  ),
  special_request text,
  nights integer not null
    check (nights > 0),
  price_per_night numeric(12,2) not null
    check (price_per_night >= 0),
  total_amount numeric(12,2) not null
    check (total_amount >= 0),
  status booking_status not null default 'pending',
  payment_status payment_status not null default 'pending',
  payment_method text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_booking_dates
    check (check_out > check_in)
);
create index if not exists bookings_room_id_idx
  on public.bookings(room_id);
create index if not exists bookings_dates_idx
  on public.bookings(check_in, check_out);
create index if not exists bookings_status_idx
  on public.bookings(status);
create index if not exists bookings_booking_code_idx
  on public.bookings(booking_code);
create index if not exists bookings_phone_idx
  on public.bookings(phone);
-- ============================================================
-- BOOKING ↔ ROOM ASSIGNMENTS
-- Used by admin to assign actual room numbers.
-- ============================================================
create table if not exists public.booking_room_assignments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id)
    on delete cascade,
  room_unit_id uuid not null references public.room_units(id)
    on delete restrict,
  created_at timestamptz not null default now(),
  unique (booking_id, room_unit_id)
);
create index if not exists booking_assignments_booking_idx
  on public.booking_room_assignments(booking_id);
create index if not exists booking_assignments_room_idx
  on public.booking_room_assignments(room_unit_id);
-- ============================================================
-- ADMIN USERS
-- ============================================================
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id)
    on delete cascade,
  email text,
  created_at timestamptz not null default now()
);
-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists rooms_updated_at on public.rooms;
create trigger rooms_updated_at
before update on public.rooms
for each row
execute function public.set_updated_at();
drop trigger if exists room_units_updated_at on public.room_units;
create trigger room_units_updated_at
before update on public.room_units
for each row
execute function public.set_updated_at();
drop trigger if exists bookings_updated_at on public.bookings;
create trigger bookings_updated_at
before update on public.bookings
for each row
execute function public.set_updated_at();
-- ============================================================
-- ADMIN CHECK FUNCTION
-- ============================================================
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;
-- ============================================================
-- ROOM AVAILABILITY
-- ============================================================
create or replace function public.get_room_availability(
  p_check_in date,
  p_check_out date,
  p_adults integer,
  p_children integer,
  p_rooms integer,
  p_bed_type text default null
)
returns table (
  room_id uuid,
  room_name text,
  price_per_night numeric,
  max_guests integer,
  bed_type text,
  total_units integer,
  booked_units bigint,
  available_units bigint
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_check_in is null or p_check_out is null then
    raise exception 'Check-in and check-out dates are required';
  end if;
  if p_check_out <= p_check_in then
    raise exception 'Check-out must be after check-in';
  end if;
  if p_check_in < current_date then
    raise exception 'Check-in date cannot be in the past';
  end if;
  if p_adults <= 0 then
    raise exception 'At least one adult is required';
  end if;
  if p_children < 0 then
    raise exception 'Children cannot be negative';
  end if;
  if p_rooms <= 0 then
    raise exception 'At least one room is required';
  end if;
  return query
  select
    r.id,
    r.name,
    r.price_per_night,
    r.max_guests,
    r.bed_type,
    r.total_units,
    coalesce(
      sum(
        case
          when b.id is not null then b.rooms_count
          else 0
        end
      ),
      0
    )::bigint as booked_units,
    greatest(
      r.total_units -
      coalesce(
        sum(
          case
            when b.id is not null then b.rooms_count
            else 0
          end
        ),
        0
      ),
      0
    )::bigint as available_units
  from public.rooms r
  left join public.bookings b
    on b.room_id = r.id
    and b.status <> 'cancelled'
    and b.check_in < p_check_out
    and b.check_out > p_check_in
  where
    (
      p_bed_type is null
      or r.bed_type = p_bed_type
    )
    and r.max_guests * p_rooms >=
      (p_adults + p_children)
  group by
    r.id,
    r.name,
    r.price_per_night,
    r.max_guests,
    r.bed_type,
    r.total_units
  having
    greatest(
      r.total_units -
      coalesce(
        sum(
          case
            when b.id is not null then b.rooms_count
            else 0
          end
        ),
        0
      ),
      0
    ) >= p_rooms
  order by r.price_per_night asc;
end;
$$;
-- ============================================================
-- CREATE REAL BOOKING
-- Atomic transaction + room row lock
-- Prevents double booking when two users book simultaneously.
-- ============================================================
create or replace function public.create_booking(
  p_room_id uuid,
  p_guest_first_name text,
  p_guest_last_name text,
  p_phone text,
  p_email text,
  p_check_in date,
  p_check_out date,
  p_adults integer,
  p_children integer,
  p_rooms_count integer,
  p_bed_type text,
  p_special_request text default null
)
returns table (
  booking_id uuid,
  booking_code text,
  total_amount numeric,
  nights integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_room public.rooms%rowtype;
  v_booked_units integer;
  v_available_units integer;
  v_nights integer;
  v_total numeric(12,2);
  v_booking_code text;
  v_booking_id uuid;
begin
  -- ----------------------------
  -- Basic validation
  -- ----------------------------
  if p_check_in is null or p_check_out is null then
    raise exception 'Check-in and check-out dates are required';
  end if;
  if p_check_in < current_date then
    raise exception 'Check-in date cannot be in the past';
  end if;
  if p_check_out <= p_check_in then
    raise exception 'Check-out must be after check-in';
  end if;
  if p_adults <= 0 then
    raise exception 'At least one adult is required';
  end if;
  if p_children < 0 then
    raise exception 'Children cannot be negative';
  end if;
  if p_rooms_count <= 0 then
    raise exception 'At least one room is required';
  end if;
  if nullif(trim(p_guest_first_name), '') is null then
    raise exception 'Guest first name is required';
  end if;
  if nullif(trim(p_guest_last_name), '') is null then
    raise exception 'Guest last name is required';
  end if;
  if nullif(trim(p_phone), '') is null then
    raise exception 'Phone number is required';
  end if;
  if nullif(trim(p_email), '') is null then
    raise exception 'Email is required';
  end if;
  -- ----------------------------
  -- Lock the selected room type.
  -- This is the important part for
  -- concurrent booking protection.
  -- ----------------------------
  select *
  into v_room
  from public.rooms
  where id = p_room_id
  for update;
  if not found then
    raise exception 'Room type not found';
  end if;
  if v_room.bed_type <> p_bed_type then
    raise exception 'Selected bed type is not available for this room';
  end if;
  if (p_adults + p_children) >
     (v_room.max_guests * p_rooms_count) then
    raise exception
      'Number of guests is too high for the selected number of rooms';
  end if;
  -- ----------------------------
  -- Calculate already booked rooms
  -- ----------------------------
  select coalesce(sum(b.rooms_count), 0)
  into v_booked_units
  from public.bookings b
  where b.room_id = p_room_id
    and b.status <> 'cancelled'
    and b.check_in < p_check_out
    and b.check_out > p_check_in;
  v_available_units :=
    v_room.total_units - v_booked_units;
  if v_available_units < p_rooms_count then
    raise exception
      'Only % room(s) are available for the selected dates',
      greatest(v_available_units, 0);
  end if;
  -- ----------------------------
  -- Calculate price
  -- ----------------------------
  v_nights := p_check_out - p_check_in;
  v_total :=
    v_nights *
    v_room.price_per_night *
    p_rooms_count;
  -- ----------------------------
  -- Generate real booking ID
  -- ----------------------------
  v_booking_code :=
    'ARH-' ||
    upper(
      substr(
        replace(gen_random_uuid()::text, '-', ''),
        1,
        8
      )
    );
  -- ----------------------------
  -- Insert booking
  -- ----------------------------
  insert into public.bookings (
    booking_code,
    room_id,
    guest_first_name,
    guest_last_name,
    phone,
    email,
    check_in,
    check_out,
    adults,
    children,
    rooms_count,
    bed_type,
    special_request,
    nights,
    price_per_night,
    total_amount,
    status,
    payment_status
  )
  values (
    v_booking_code,
    p_room_id,
    trim(p_guest_first_name),
    trim(p_guest_last_name),
    trim(p_phone),
    lower(trim(p_email)),
    p_check_in,
    p_check_out,
    p_adults,
    p_children,
    p_rooms_count,
    p_bed_type,
    nullif(trim(p_special_request), ''),
    v_nights,
    v_room.price_per_night,
    v_total,
    'pending',
    'pending'
  )
  returning id
  into v_booking_id;
  return query
  select
    v_booking_id,
    v_booking_code,
    v_total,
    v_nights;
end;
$$;
-- ============================================================
-- FIND MY BOOKING
-- Customer needs BOTH booking code + phone.
-- ============================================================
create or replace function public.find_booking(
  p_booking_code text,
  p_phone text
)
returns table (
  id uuid,
  booking_code text,
  room_id uuid,
  room_name text,
  room_image_url text,
  guest_first_name text,
  guest_last_name text,
  phone text,
  email text,
  check_in date,
  check_out date,
  adults integer,
  children integer,
  rooms_count integer,
  bed_type text,
  special_request text,
  nights integer,
  price_per_night numeric,
  total_amount numeric,
  status booking_status,
  payment_status payment_status,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    b.id,
    b.booking_code,
    r.id,
    r.name,
    r.image_url,
    b.guest_first_name,
    b.guest_last_name,
    b.phone,
    b.email,
    b.check_in,
    b.check_out,
    b.adults,
    b.children,
    b.rooms_count,
    b.bed_type,
    b.special_request,
    b.nights,
    b.price_per_night,
    b.total_amount,
    b.status,
    b.payment_status,
    b.created_at
  from public.bookings b
  join public.rooms r
    on r.id = b.room_id
  where
    upper(b.booking_code) = upper(trim(p_booking_code))
    and b.phone = trim(p_phone)
  limit 1;
$$;
-- ============================================================
-- ADMIN: HOTEL STATS
-- ============================================================
create or replace function public.get_admin_stats()
returns table (
  total_rooms bigint,
  available_rooms bigint,
  occupied_rooms bigint,
  pending_bookings bigint,
  today_check_ins bigint,
  today_check_outs bigint,
  today_revenue numeric
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;
  return query
  select
    (
      select count(*)
      from public.room_units
      where active = true
    ),
    (
      select count(*)
      from public.room_units
      where active = true
        and status = 'available'
    ),
    (
      select count(*)
      from public.room_units
      where active = true
        and status = 'occupied'
    ),
    (
      select count(*)
      from public.bookings
      where status = 'pending'
    ),
    (
      select count(*)
      from public.bookings
      where check_in = current_date
        and status in ('pending', 'confirmed')
    ),
    (
      select count(*)
      from public.bookings
      where check_out = current_date
        and status in ('confirmed', 'checked_in')
    ),
    (
      select coalesce(sum(total_amount), 0)
      from public.bookings
      where check_in = current_date
        and status <> 'cancelled'
    );
end;
$$;
-- ============================================================
-- ADMIN: UPDATE BOOKING STATUS
-- ============================================================
create or replace function public.admin_update_booking_status(
  p_booking_id uuid,
  p_status booking_status
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;
  update public.bookings
  set status = p_status
  where id = p_booking_id;
  if not found then
    raise exception 'Booking not found';
  end if;
  return true;
end;
$$;
-- ============================================================
-- ADMIN: UPDATE PAYMENT STATUS
-- ============================================================
create or replace function public.admin_update_payment_status(
  p_booking_id uuid,
  p_payment_status payment_status
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;
  update public.bookings
  set payment_status = p_payment_status
  where id = p_booking_id;
  if not found then
    raise exception 'Booking not found';
  end if;
  return true;
end;
$$;
-- ============================================================
-- ADMIN: ASSIGN ROOM
-- ============================================================
create or replace function public.admin_assign_room(
  p_booking_id uuid,
  p_room_unit_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking public.bookings%rowtype;
  v_room_id uuid;
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;
  select *
  into v_booking
  from public.bookings
  where id = p_booking_id
  for update;
  if not found then
    raise exception 'Booking not found';
  end if;
  select room_id
  into v_room_id
  from public.room_units
  where id = p_room_unit_id
    and active = true;
  if v_room_id is null then
    raise exception 'Room unit not found';
  end if;
  if v_room_id <> v_booking.room_id then
    raise exception 'Room does not match booking room type';
  end if;
  if exists (
    select 1
    from public.booking_room_assignments bra
    join public.bookings b
      on b.id = bra.booking_id
    where bra.room_unit_id = p_room_unit_id
      and bra.booking_id <> p_booking_id
      and b.status <> 'cancelled'
      and b.check_in < v_booking.check_out
      and b.check_out > v_booking.check_in
  ) then
    raise exception 'This room is already assigned for overlapping dates';
  end if;
  insert into public.booking_room_assignments (
    booking_id,
    room_unit_id
  )
  values (
    p_booking_id,
    p_room_unit_id
  )
  on conflict (booking_id, room_unit_id)
  do nothing;
  return true;
end;
$$;
-- ============================================================
-- ADMIN: REMOVE ROOM ASSIGNMENT
-- ============================================================
create or replace function public.admin_remove_room_assignment(
  p_booking_id uuid,
  p_room_unit_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;
  delete from public.booking_room_assignments
  where booking_id = p_booking_id
    and room_unit_id = p_room_unit_id;
  return true;
end;
$$;
-- ============================================================
-- ADMIN: CHANGE ROOM UNIT STATUS
-- ============================================================
create or replace function public.admin_update_room_status(
  p_room_unit_id uuid,
  p_status room_unit_status
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;
  update public.room_units
  set status = p_status
  where id = p_room_unit_id;
  if not found then
    raise exception 'Room unit not found';
  end if;
  return true;
end;
$$;
-- ============================================================
-- GRANTS
-- ============================================================
grant execute on function public.get_room_availability(
  date,
  date,
  integer,
  integer,
  integer,
  text
) to anon, authenticated;
grant execute on function public.create_booking(
  uuid,
  text,
  text,
  text,
  text,
  date,
  date,
  integer,
  integer,
  integer,
  text,
  text
) to anon, authenticated;
grant execute on function public.find_booking(
  text,
  text
) to anon, authenticated;
grant execute on function public.get_admin_stats()
to authenticated;
grant execute on function public.admin_update_booking_status(
  uuid,
  booking_status
) to authenticated;
grant execute on function public.admin_update_payment_status(
  uuid,
  payment_status
) to authenticated;
grant execute on function public.admin_assign_room(
  uuid,
  uuid
) to authenticated;
grant execute on function public.admin_remove_room_assignment(
  uuid,
  uuid
) to authenticated;
grant execute on function public.admin_update_room_status(
  uuid,
  room_unit_status
) to authenticated;
-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.rooms enable row level security;
alter table public.room_units enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_room_assignments enable row level security;
alter table public.admin_users enable row level security;
-- ----------------------------
-- ROOMS
-- ----------------------------
drop policy if exists "Public can view rooms"
on public.rooms;
create policy "Public can view rooms"
on public.rooms
for select
to anon, authenticated
using (true);
drop policy if exists "Admins can manage rooms"
on public.rooms;
create policy "Admins can manage rooms"
on public.rooms
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
-- ----------------------------
-- ROOM UNITS
-- ----------------------------
drop policy if exists "Admins can view room units"
on public.room_units;
create policy "Admins can view room units"
on public.room_units
for select
to authenticated
using (public.is_admin());
drop policy if exists "Admins can manage room units"
on public.room_units;
create policy "Admins can manage room units"
on public.room_units
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
-- ----------------------------
-- BOOKINGS
-- ----------------------------
drop policy if exists "Admins can view bookings"
on public.bookings;
create policy "Admins can view bookings"
on public.bookings
for select
to authenticated
using (public.is_admin());
drop policy if exists "Admins can update bookings"
on public.bookings;
create policy "Admins can update bookings"
on public.bookings
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());
-- Booking creation is intentionally handled
-- through create_booking() RPC instead of
-- public INSERT access.
-- ----------------------------
-- BOOKING ASSIGNMENTS
-- ----------------------------
drop policy if exists "Admins can view assignments"
on public.booking_room_assignments;
create policy "Admins can view assignments"
on public.booking_room_assignments
for select
to authenticated
using (public.is_admin());
drop policy if exists "Admins can manage assignments"
on public.booking_room_assignments;
create policy "Admins can manage assignments"
on public.booking_room_assignments
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
-- ----------------------------
-- ADMIN USERS
-- ----------------------------
drop policy if exists "Admins can view admin users"
on public.admin_users;
create policy "Admins can view admin users"
on public.admin_users
for select
to authenticated
using (public.is_admin());
-- ============================================================
-- SEED ROOM TYPES
-- ============================================================
insert into public.rooms (
  slug,
  name,
  description,
  price_per_night,
  room_size,
  max_guests,
  bed_type,
  total_units,
  image_url,
  gallery,
  amenities
)
values
(
  'deluxe-room',
  'Deluxe Room',
  'A calm and refined room designed for a comfortable city stay, with contemporary interiors and thoughtful amenities.',
  3500,
  280,
  2,
  'King Bed',
  6,
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1600&q=85',
  '[
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1587985064135-0366536eab42?auto=format&fit=crop&w=1600&q=85"
  ]'::jsonb,
  '[
    "King Bed",
    "Free Wi-Fi",
    "Air Conditioning",
    "Smart TV",
    "Room Service",
    "Private Bathroom"
  ]'::jsonb
),
(
  'premium-room',
  'Premium Room',
  'A spacious premium stay combining warm hospitality, generous space and modern comforts.',
  4500,
  340,
  3,
  'King Bed',
  5,
  'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=1600&q=85',
  '[
    "https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1600&q=85"
  ]'::jsonb,
  '[
    "King Bed",
    "Free Wi-Fi",
    "Air Conditioning",
    "Smart TV",
    "Mini Fridge",
    "Room Service",
    "Private Bathroom"
  ]'::jsonb
),
(
  'family-room',
  'Family Room',
  'Comfortable and spacious accommodation designed for families and small groups.',
  5500,
  420,
  4,
  'Twin Beds',
  4,
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1600&q=85',
  '[
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1600&q=85"
  ]'::jsonb,
  '[
    "Twin Beds",
    "Free Wi-Fi",
    "Air Conditioning",
    "Smart TV",
    "Room Service",
    "Private Bathroom",
    "Extra Seating"
  ]'::jsonb
),
(
  'executive-suite',
  'Executive Suite',
  'An elevated suite with separate living space, refined interiors and premium hotel services.',
  7500,
  560,
  4,
  'King Bed',
  2,
  'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1600&q=85',
  '[
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85"
  ]'::jsonb,
  '[
    "King Bed",
    "Separate Living Area",
    "Free Wi-Fi",
    "Air Conditioning",
    "Smart TV",
    "Mini Fridge",
    "Room Service",
    "Premium Bathroom"
  ]'::jsonb
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  price_per_night = excluded.price_per_night,
  room_size = excluded.room_size,
  max_guests = excluded.max_guests,
  bed_type = excluded.bed_type,
  total_units = excluded.total_units,
  image_url = excluded.image_url,
  gallery = excluded.gallery,
  amenities = excluded.amenities,
  updated_at = now();
-- ============================================================
-- SEED ACTUAL ROOM NUMBERS
-- ============================================================
insert into public.room_units (
  room_id,
  room_number
)
select r.id, v.room_number
from (
  values
    ('deluxe-room', '101'),
    ('deluxe-room', '102'),
    ('deluxe-room', '103'),
    ('deluxe-room', '104'),
    ('deluxe-room', '105'),
    ('deluxe-room', '106'),
    ('premium-room', '201'),
    ('premium-room', '202'),
    ('premium-room', '203'),
    ('premium-room', '204'),
    ('premium-room', '205'),
    ('family-room', '301'),
    ('family-room', '302'),
    ('family-room', '303'),
    ('family-room', '304'),
    ('executive-suite', '401'),
    ('executive-suite', '402')
) as v(slug, room_number)
join public.rooms r
  on r.slug = v.slug
on conflict (room_number) do nothing;
-- ============================================================
-- KEEP TOTAL UNITS SYNCHRONIZED
-- ============================================================
update public.rooms r
set total_units = (
  select count(*)
  from public.room_units ru
  where ru.room_id = r.id
    and ru.active = true
);
-- ============================================================
-- IMPORTANT:
--
-- After running this SQL:
--
-- 1. Create an admin user in Supabase Authentication.
-- 2. Copy that user's UUID.
-- 3. Insert it into public.admin_users.
--
-- Example:
--
-- insert into public.admin_users (user_id, email)
-- values (
--   'YOUR-AUTH-USER-UUID',
--   'YOUR-ADMIN-EMAIL'
-- );
--
-- DO NOT put the admin user's UUID here unless you
-- actually know the Supabase Auth user UUID.
-- ============================================================