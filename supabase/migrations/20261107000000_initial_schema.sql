-- =============================================================================
-- Initial schema for Knedlík as a Service
--
-- Mapping from the UML diagram:
--   User                -> public.profiles (1:1 with auth.users, managed by Supabase Auth)
--   Account, Session    -> NOT created. Supabase Auth already stores these in
--                          auth.identities and auth.sessions.
--   Preferences         -> public.preferences
--   MealPlan            -> public.meal_plans
--   Meal                -> public.meals
--   MealStep            -> public.meal_steps   ("order" renamed to "position",
--                          because ORDER is a reserved SQL keyword)
--   MealIngredient      -> public.meal_ingredients
--   ShoppingItem        -> public.shopping_items
--
-- Columns use snake_case (Postgres convention): weekStart -> week_start, etc.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Enums
-- -----------------------------------------------------------------------------
create type public.meal_type as enum ('BREAKFAST', 'LUNCH', 'DINNER');
create type public.unit as enum ('G', 'ML', 'PCS');
create type public.category as enum ('QUICK', 'HIGH_PROTEIN', 'CZECH_CLASSIC', 'VEGETARIAN', 'BUDGET');
create type public.appliance as enum ('STOVE', 'OVEN', 'MICROWAVE', 'AIR_FRYER', 'BLENDER');

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  name        text,
  email       text not null,
  image       text,
  created_at  timestamptz not null default now()
);

create table public.preferences (
  user_id     uuid primary key references public.profiles (id) on delete cascade,
  meal_types  public.meal_type[] not null default '{}',
  categories  public.category[]  not null default '{}',
  appliances  public.appliance[] not null default '{}',
  servings    integer not null default 2 check (servings > 0),
  updated_at  timestamptz not null default now()
);

create table public.meal_plans (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  week_start  date not null,
  note        text,
  servings    integer not null default 2 check (servings > 0),
  created_at  timestamptz not null default now()
);

create table public.meals (
  id            uuid primary key default gen_random_uuid(),
  plan_id       uuid not null references public.meal_plans (id) on delete cascade,
  date          date not null,
  meal_type     public.meal_type not null,
  name          text not null,
  prep_minutes  integer not null default 0 check (prep_minutes >= 0),
  kcal          integer not null default 0 check (kcal >= 0),
  protein_g     real not null default 0 check (protein_g >= 0),
  carbs_g       real not null default 0 check (carbs_g >= 0),
  fat_g         real not null default 0 check (fat_g >= 0)
);

create table public.meal_steps (
  id        uuid primary key default gen_random_uuid(),
  meal_id   uuid not null references public.meals (id) on delete cascade,
  position  integer not null check (position > 0),
  text      text not null,
  unique (meal_id, position)
);

create table public.meal_ingredients (
  id        uuid primary key default gen_random_uuid(),
  meal_id   uuid not null references public.meals (id) on delete cascade,
  name      text not null,
  quantity  real not null check (quantity >= 0),
  unit      public.unit not null
);

create table public.shopping_items (
  id              uuid primary key default gen_random_uuid(),
  plan_id         uuid not null references public.meal_plans (id) on delete cascade,
  name            text not null,
  total_quantity  real not null check (total_quantity >= 0),
  unit            public.unit not null,
  have            boolean not null default false,
  bought          boolean not null default false
);

-- Postgres does not index foreign keys automatically.
create index meal_plans_user_id_idx       on public.meal_plans (user_id, week_start);
create index meals_plan_id_idx            on public.meals (plan_id);
create index meal_steps_meal_id_idx       on public.meal_steps (meal_id);
create index meal_ingredients_meal_id_idx on public.meal_ingredients (meal_id);
create index shopping_items_plan_id_idx   on public.shopping_items (plan_id);

-- -----------------------------------------------------------------------------
-- Triggers
-- -----------------------------------------------------------------------------

-- Create a profile row whenever someone registers through Supabase Auth.
-- `name` comes from the `data` option passed to supabase.auth.signUp().
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, name, image)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep preferences.updated_at current.
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger preferences_set_updated_at
  before update on public.preferences
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Row Level Security: every user sees and edits only their own data.
-- (select auth.uid()) is wrapped in a subquery so Postgres evaluates it once
-- per query instead of once per row.
-- -----------------------------------------------------------------------------
alter table public.profiles         enable row level security;
alter table public.preferences      enable row level security;
alter table public.meal_plans       enable row level security;
alter table public.meals            enable row level security;
alter table public.meal_steps       enable row level security;
alter table public.meal_ingredients enable row level security;
alter table public.shopping_items   enable row level security;

-- Profiles are created by the trigger and deleted via auth.users cascade,
-- so users may only read and update their own.
create policy "Users can read own profile" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy "Users can update own profile" on public.profiles
  for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "Users manage own preferences" on public.preferences
  for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy "Users manage own meal plans" on public.meal_plans
  for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy "Users manage meals in own plans" on public.meals
  for all to authenticated
  using (exists (
    select 1 from public.meal_plans p
    where p.id = plan_id and p.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.meal_plans p
    where p.id = plan_id and p.user_id = (select auth.uid())
  ));

create policy "Users manage shopping items in own plans" on public.shopping_items
  for all to authenticated
  using (exists (
    select 1 from public.meal_plans p
    where p.id = plan_id and p.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.meal_plans p
    where p.id = plan_id and p.user_id = (select auth.uid())
  ));

create policy "Users manage steps of own meals" on public.meal_steps
  for all to authenticated
  using (exists (
    select 1 from public.meals m
    join public.meal_plans p on p.id = m.plan_id
    where m.id = meal_id and p.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.meals m
    join public.meal_plans p on p.id = m.plan_id
    where m.id = meal_id and p.user_id = (select auth.uid())
  ));

create policy "Users manage ingredients of own meals" on public.meal_ingredients
  for all to authenticated
  using (exists (
    select 1 from public.meals m
    join public.meal_plans p on p.id = m.plan_id
    where m.id = meal_id and p.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.meals m
    join public.meal_plans p on p.id = m.plan_id
    where m.id = meal_id and p.user_id = (select auth.uid())
  ));

-- -----------------------------------------------------------------------------
-- Grants. Explicit, so the Data API works even if the project has
-- "automatically expose new tables" turned off. RLS still applies.
-- -----------------------------------------------------------------------------
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on
  public.preferences,
  public.meal_plans,
  public.meals,
  public.meal_steps,
  public.meal_ingredients,
  public.shopping_items
to authenticated;
grant all on all tables in schema public to service_role;
