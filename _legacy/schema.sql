-- Create a table for public profiles
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint username_length check (char_length(username) >= 3)
);

-- Create a table for travel dots
create table if not exists dots (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  latitude float8 not null,
  longitude float8 not null,
  place_name text,
  content jsonb, -- Rich text content
  media jsonb default '[]'::jsonb, -- List of {type, url}
  is_public boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;
alter table dots enable row level security;

-- Profiles policies
-- Note: "create policy if not exists" is not standard PostgreSQL, so we drop to ensure idempotency or ignore errors
drop policy if exists "Public profiles are viewable by everyone." on profiles;
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Dots policies
drop policy if exists "Public dots are viewable by everyone." on dots;
create policy "Public dots are viewable by everyone." on dots
  for select using (is_public = true);

drop policy if exists "Users can view their own dots." on dots;
create policy "Users can view their own dots." on dots
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert their own dots." on dots;
create policy "Users can insert their own dots." on dots
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update their own dots." on dots;
create policy "Users can update their own dots." on dots
  for update using (auth.uid() = user_id);

drop policy if exists "Users can delete their own dots." on dots;
create policy "Users can delete their own dots." on dots
  for delete using (auth.uid() = user_id);
