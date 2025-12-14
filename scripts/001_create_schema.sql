-- Create profiles table for user information
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  is_trainer boolean default false,
  bio text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create fitness plans table
create table if not exists public.fitness_plans (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  price numeric(10, 2) not null,
  duration_days integer not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create subscriptions table
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id uuid not null references public.fitness_plans(id) on delete cascade,
  subscribed_at timestamp with time zone default now(),
  unique(user_id, plan_id)
);

-- Create follows table for trainer following
create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references public.profiles(id) on delete cascade,
  trainer_id uuid not null references public.profiles(id) on delete cascade,
  followed_at timestamp with time zone default now(),
  unique(follower_id, trainer_id)
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.fitness_plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.follows enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Fitness plans policies
create policy "All plans are viewable by everyone"
  on public.fitness_plans for select
  using (true);

create policy "Trainers can insert their own plans"
  on public.fitness_plans for insert
  with check (
    auth.uid() = trainer_id 
    and exists (
      select 1 from public.profiles 
      where id = auth.uid() and is_trainer = true
    )
  );

create policy "Trainers can update their own plans"
  on public.fitness_plans for update
  using (
    auth.uid() = trainer_id
    and exists (
      select 1 from public.profiles 
      where id = auth.uid() and is_trainer = true
    )
  );

create policy "Trainers can delete their own plans"
  on public.fitness_plans for delete
  using (
    auth.uid() = trainer_id
    and exists (
      select 1 from public.profiles 
      where id = auth.uid() and is_trainer = true
    )
  );

-- Subscriptions policies
create policy "Users can view their own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Trainers can view subscriptions to their plans"
  on public.subscriptions for select
  using (
    exists (
      select 1 from public.fitness_plans 
      where id = plan_id and trainer_id = auth.uid()
    )
  );

create policy "Users can create their own subscriptions"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own subscriptions"
  on public.subscriptions for delete
  using (auth.uid() = user_id);

-- Follows policies
create policy "All follows are viewable by everyone"
  on public.follows for select
  using (true);

create policy "Users can follow trainers"
  on public.follows for insert
  with check (auth.uid() = follower_id);

create policy "Users can unfollow trainers"
  on public.follows for delete
  using (auth.uid() = follower_id);

-- Create indexes for performance
create index if not exists idx_fitness_plans_trainer_id on public.fitness_plans(trainer_id);
create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_subscriptions_plan_id on public.subscriptions(plan_id);
create index if not exists idx_follows_follower_id on public.follows(follower_id);
create index if not exists idx_follows_trainer_id on public.follows(trainer_id);
