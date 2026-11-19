-- =============================================================================
-- Extend preferences with dietary restrictions and cooking constraints.
--
-- New columns:
--   diet                  hard restriction (replaces the VEGETARIAN category in
--                         the onboarding form; the enum value stays in
--                         public.category so existing rows keep working)
--   allergens             never plan a meal containing these
--   disliked_ingredients  free text, e.g. {"mushrooms", "coriander"}
--   max_prep_minutes      compared with meals.prep_minutes; null = no limit
--   daily_kcal_target     compared with meals.kcal; null = no target
--   cooking_skill         how demanding the recipes may be
--   weekly_budget_czk     null = no budget
--
-- RLS and grants on public.preferences already cover the new columns.
-- =============================================================================

create type public.diet as enum ('OMNIVORE', 'VEGETARIAN', 'VEGAN', 'PESCATARIAN');
create type public.allergen as enum (
  'GLUTEN', 'LACTOSE', 'EGGS', 'NUTS', 'PEANUTS', 'FISH',
  'SHELLFISH', 'SOY', 'SESAME', 'CELERY', 'MUSTARD'
);
create type public.cooking_skill as enum ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

alter table public.preferences
  add column diet                 public.diet          not null default 'OMNIVORE',
  add column allergens            public.allergen[]    not null default '{}',
  add column disliked_ingredients text[]               not null default '{}'
    check (cardinality(disliked_ingredients) <= 20),
  add column max_prep_minutes     integer check (max_prep_minutes > 0),
  add column daily_kcal_target    integer check (daily_kcal_target > 0),
  add column cooking_skill        public.cooking_skill not null default 'BEGINNER',
  add column weekly_budget_czk    integer check (weekly_budget_czk > 0);
