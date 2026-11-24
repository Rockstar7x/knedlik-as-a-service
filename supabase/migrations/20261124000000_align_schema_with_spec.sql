-- =============================================================================
-- Align the schema with the specification in README.md.
--
--   1. category enum   -> the eight meal categories from the spec
--   2. appliance enum  -> drop BLENDER, it is not in the spec
--   3. meals           -> category of each meal (the meal card shows it)
--   4. meal_plans      -> at most one plan per user and calendar week
--   5. meal_plans      -> snapshot of the preferences the plan was generated
--                         with; replacing a meal must use these, not the
--                         profile, because profile changes must not affect
--                         existing plans
--   6. shopping_items  -> one "have it / bought" flag instead of two, and
--                         identical ingredients merged into one item
--
-- Existing rows are migrated, not dropped. RLS policies and grants are per
-- table, so they already cover every new column.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1 + 2. Enums
--
-- Postgres cannot drop a value from an enum, so each type is recreated. The
-- removed values are stripped from existing arrays first: the USING clause of
-- ALTER COLUMN TYPE cannot contain a subquery that would filter them.
-- Only public.preferences uses these types at this point. The VEGETARIAN
-- category is covered by preferences.diet since 20261111000000.
-- -----------------------------------------------------------------------------
update public.preferences
set categories = array_remove(array_remove(categories, 'VEGETARIAN'), 'BUDGET'),
    appliances = array_remove(appliances, 'BLENDER');

alter type public.category rename to category_old;
create type public.category as enum (
  'QUICK',
  'LOW_CALORIE',
  'FAMILY_CLASSIC',
  'HEALTHY_COMFORT',
  'FAKEAWAY',
  'EASY_TO_DIGEST',
  'HIGH_PROTEIN',
  'CZECH_CLASSIC'
);

alter type public.appliance rename to appliance_old;
create type public.appliance as enum ('STOVE', 'OVEN', 'MICROWAVE', 'AIR_FRYER');

-- The column defaults are typed with the old enums and must be dropped
-- before the column type can change.
alter table public.preferences
  alter column categories drop default,
  alter column appliances drop default,
  alter column categories type public.category[]
    using categories::text[]::public.category[],
  alter column appliances type public.appliance[]
    using appliances::text[]::public.appliance[],
  alter column categories set default '{}',
  alter column appliances set default '{}';

drop type public.category_old;
drop type public.appliance_old;

-- -----------------------------------------------------------------------------
-- 3. Meal category
--
-- Meals exist only from the seed script so far (AI generation is not
-- implemented), so existing rows get a placeholder. Run `npm run db:seed` to
-- replace them with meals that have real categories. The default is dropped
-- right away: new meals must always state their category.
-- -----------------------------------------------------------------------------
alter table public.meals
  add column category public.category not null default 'FAMILY_CLASSIC';
alter table public.meals
  alter column category drop default;

-- -----------------------------------------------------------------------------
-- 4. One plan per user and week
--
-- week_start must be a Monday, otherwise two plans with different start days
-- could cover the same week and the unique constraint would not catch it.
-- The unique index replaces the plain index on the same columns.
-- -----------------------------------------------------------------------------
alter table public.meal_plans
  add constraint meal_plans_week_start_is_monday
    check (extract(isodow from week_start) = 1),
  add constraint meal_plans_user_id_week_start_key
    unique (user_id, week_start);

drop index public.meal_plans_user_id_idx;

-- -----------------------------------------------------------------------------
-- 5. Preferences snapshot on the plan
--
-- The plan gets every column of public.preferences, with the same types and
-- checks (servings is already there). Existing plans get the owner's current
-- preferences, the closest thing to what they were generated with.
-- The defaults only serve the backfill (and plans whose owner has no
-- preferences row); after it they are dropped, together with the one on
-- servings, so that creating a plan without the snapshot fails loudly. The
-- nullable columns have no default: null means "no limit", as in preferences.
--
-- A column added to public.preferences later must be added here as well.
-- -----------------------------------------------------------------------------
alter table public.meal_plans
  add column meal_types           public.meal_type[]   not null default '{}',
  add column categories           public.category[]    not null default '{}',
  add column appliances           public.appliance[]   not null default '{}',
  add column diet                 public.diet          not null default 'OMNIVORE',
  add column allergens            public.allergen[]    not null default '{}',
  add column disliked_ingredients text[]               not null default '{}'
    check (cardinality(disliked_ingredients) <= 20),
  add column max_prep_minutes     integer check (max_prep_minutes > 0),
  add column daily_kcal_target    integer check (daily_kcal_target > 0),
  add column cooking_skill        public.cooking_skill not null default 'BEGINNER',
  add column weekly_budget_czk    integer check (weekly_budget_czk > 0);

update public.meal_plans plan
set meal_types           = pref.meal_types,
    categories           = pref.categories,
    appliances           = pref.appliances,
    diet                 = pref.diet,
    allergens            = pref.allergens,
    disliked_ingredients = pref.disliked_ingredients,
    max_prep_minutes     = pref.max_prep_minutes,
    daily_kcal_target    = pref.daily_kcal_target,
    cooking_skill        = pref.cooking_skill,
    weekly_budget_czk    = pref.weekly_budget_czk
from public.preferences pref
where pref.user_id = plan.user_id;

alter table public.meal_plans
  alter column meal_types           drop default,
  alter column categories           drop default,
  alter column appliances           drop default,
  alter column diet                 drop default,
  alter column allergens            drop default,
  alter column disliked_ingredients drop default,
  alter column cooking_skill        drop default,
  alter column servings             drop default;

-- -----------------------------------------------------------------------------
-- 6. Shopping items
--
-- An item counts as checked if either old flag was set. The unique constraint
-- enforces merging of identical ingredients and gives an upsert target for
-- updating the list after a meal is replaced. Its index starts with plan_id,
-- so it replaces the plain index on plan_id.
-- -----------------------------------------------------------------------------
alter table public.shopping_items rename column have to checked;

update public.shopping_items
set checked = true
where bought;

alter table public.shopping_items
  drop column bought,
  add constraint shopping_items_plan_id_name_unit_key
    unique (plan_id, name, unit);

drop index public.shopping_items_plan_id_idx;

-- -----------------------------------------------------------------------------
-- Units of the nutrition and quantity columns, so the UI can say whether a
-- value applies to one serving or the whole meal.
-- -----------------------------------------------------------------------------
comment on column public.meals.kcal is
  'Approximate AI estimate for one serving.';
comment on column public.meals.protein_g is
  'Approximate AI estimate for one serving, in grams.';
comment on column public.meals.carbs_g is
  'Approximate AI estimate for one serving, in grams.';
comment on column public.meals.fat_g is
  'Approximate AI estimate for one serving, in grams.';
comment on column public.meal_ingredients.quantity is
  'Quantity for all servings of the plan (meal_plans.servings).';
comment on column public.shopping_items.total_quantity is
  'Sum of meal_ingredients.quantity over the plan, per name and unit.';
