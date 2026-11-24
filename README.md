# Knedlík as a Service (KaaS)

AI-powered weekly meal planner. Set your preferences once, let KaaS generate a meal plan for the week with recipes, approximate nutritional values and an automatically merged shopping list.

**Live:** https://knedlik-as-a-service.vercel.app

Team project for the course PV247 (Modern Development of User Interfaces) at FI MUNI, autumn 2026.

## Team

- Patrik
- Jan
- Filip
- Katarína

## Specification and scope

### Roles

- **User:** sets their preferences after the first sign-in. For a selected week, they let AI generate a meal plan with recipes and ingredients. A shopping list is created for the meal plan.

### Onboarding and profile

- After the first sign-in, the user goes through onboarding and sets their preferences:
  - meals of the day to plan: breakfast, lunch, dinner (at least one)
  - preferred meal categories, at most 3: quick meals, low-calorie, family classics, healthy comfort food, "fakeaway", easy to digest, high-protein, Czech classics
  - available appliances: stovetop, oven, microwave, air fryer (at least one)
  - number of servings
- Completing onboarding saves the preferences. A meal plan is generated separately for a selected week.
- Preferences can be changed later in the profile. Changes do not affect existing meal plans; they are used for the next generation.

### Meal plan overview

- A page with past meal plans and meal plans for the current and next week.
- Each meal plan belongs to a calendar week (Monday to Sunday). A user has at most one meal plan per week.
- If a plan for the current or next week does not exist, the app offers to create it. Plans cannot be generated for past or more distant future weeks.
- An existing plan cannot be regenerated as a whole. It can be deleted and generated again, or a single meal in it can be replaced.

### Meal plan generation

- The user selects the current or next week and fills in a form prefilled with profile preferences (meals of the day, categories, appliances, servings).
- An optional note specifies wishes for that week, e.g. "use up the zucchini, no fish this week".
- **Current week:** AI generates meals from today (inclusive) until Sunday. Past days are not filled in retroactively.
- **Next week:** AI generates the whole week, Monday to Sunday.
- Generated meals include recipes, ingredients, quantities and approximate nutritional values. A shopping list is created only for the generated meals.

### Weekly meal plan detail

- Days covered by the plan with the chosen meals for each day. A meal card shows the name, category tag, preparation time and number of servings.
- Daily total of kcal and macros.
- Link to the shopping list of the plan.

### Recipe detail

- Name, kcal, preparation time, number of servings and macros (carbohydrates, protein, fat).
- Ingredients with quantities for the chosen number of servings, numbered steps.
- Nutritional values are marked as approximate AI estimates, and it is clear whether they apply to one serving or the whole meal.
- Replacing a meal (current or next week only) offers two options:
  - **Suggestion based on a note:** the user describes what to change, AI suggests a different meal based on the note and the plan's preferences.
  - **Completion by name:** the user enters a meal name, AI fills in ingredients, quantities, steps, preparation time, kcal and macros.

### Shopping list

- Contains ingredients and their total quantities for the plan. Identical ingredients are merged into one item.
- Each item has a "have it / bought" checkbox. The checked state is saved.
- When a meal is replaced, the list is updated. New items and items with a changed quantity become unchecked.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Cache Components) with server and client rendering
- React 19, TypeScript
- Tailwind CSS v4
- [shadcn/ui](https://ui.shadcn.com) on top of Base UI
- [Supabase](https://supabase.com): Postgres with Row Level Security, Auth (e-mail and password)
- AI generation: _TBD_
- Hosted on [Vercel](https://vercel.com)

## Getting started

### Prerequisites

- Node.js in the version from `.nvmrc` (with nvm: `nvm use`)
- npm
- Access to the team's Supabase project (ask a teammate to invite you)

### Install and run

```bash
git clone https://github.com/Rockstar7x/knedlik-as-a-service.git
cd knedlik-as-a-service
npm ci
cp .env.example .env.local   # then fill in the values, see below
npm run dev
```

The app runs at http://localhost:3000.

### Environment variables

Copy `.env.example` to `.env.local` and fill in the values from the Supabase dashboard (**Project Settings → API Keys**). Never commit `.env.local`.

| Variable                               | Required           | Description                                                                         |
| -------------------------------------- | ------------------ | ----------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | yes                | Project URL, `https://<project-ref>.supabase.co`                                    |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | yes                | Publishable key (`sb_publishable_…`). Safe in the browser, RLS protects the data.   |
| `SUPABASE_SECRET_KEY`                  | only for `db:seed` | Secret key (`sb_secret_…`). Bypasses RLS. Server-only, never prefix `NEXT_PUBLIC_`. |
| `NEXT_PUBLIC_SITE_URL`                 | no                 | Base URL for the e-mail confirmation link. Defaults to `http://localhost:3000`.     |

The public variables are validated at runtime in `lib/env.ts`.

## Database

The schema lives in `supabase/migrations/` and is applied to the Supabase project with the Supabase CLI (a dev dependency, run it with `npx supabase`). Link your checkout to the project once:

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
```

### Data model

| Table              | Contents                                                                                                                                                                          |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `profiles`         | One row per user, created by a trigger on sign-up                                                                                                                                 |
| `preferences`      | The user's current preferences: meals of the day, categories, appliances, servings, diet, allergens, disliked ingredients, cooking time, daily kcal, cooking skill, weekly budget |
| `meal_plans`       | One plan per user and week (`week_start` is a Monday), with a snapshot of the preferences it was generated with                                                                   |
| `meals`            | Meals of a plan by date and meal of the day, with category, preparation time, kcal and macros per serving                                                                         |
| `meal_ingredients` | Ingredients of a meal, quantities for all servings of the plan                                                                                                                    |
| `meal_steps`       | Numbered steps of a meal                                                                                                                                                          |
| `shopping_items`   | Merged ingredients of a plan (one row per name and unit) with a checked flag                                                                                                      |

Every table has RLS enabled: a user can read and write only their own rows. The plan keeps its own copy of all preference columns because changing the profile must not affect existing plans, and replacing a meal must use the preferences the plan was generated with.

### Changing the schema

1. Add a new migration with `npx supabase migration new <name>` and write the SQL. Never edit a migration that has already been applied.
2. Apply it with `npm run db:push`.
3. Regenerate the TypeScript types with `npm run db:types` and commit them together with the migration.

### Demo data

`npm run db:seed` creates two confirmed demo users with preferences and a meal plan for the current week: `joe@knedlik.test` and `jane@knedlik.test`, both with the password `knedlik123`. Running it again deletes and recreates only these demo users. It needs `SUPABASE_SECRET_KEY` in `.env.local`.

## Scripts

| Script                 | Description                                  |
| ---------------------- | -------------------------------------------- |
| `npm run dev`          | Start the development server                 |
| `npm run build`        | Production build                             |
| `npm run start`        | Run the production build locally             |
| `npm run lint`         | ESLint                                       |
| `npm run format`       | Format all files with Prettier               |
| `npm run format:check` | Check formatting (used in CI)                |
| `npm run typecheck`    | Generate route types and run the TS compiler |
| `npm run db:push`      | Apply new migrations to the Supabase project |
| `npm run db:types`     | Regenerate `lib/supabase/database.types.ts`  |
| `npm run db:seed`      | Recreate the demo users and their data       |

## Workflow

### Branches

Never push directly to `main`. Create a branch from an up-to-date `main`:

| Prefix      | Use for                           | Example                    |
| ----------- | --------------------------------- | -------------------------- |
| `feat/`     | new functionality                 | `feat/onboarding-form`     |
| `fix/`      | bug fixes                         | `fix/shopping-list-merge`  |
| `chore/`    | tooling, config, dependencies     | `chore/update-deps`        |
| `docs/`     | documentation                     | `docs/readme-and-metadata` |
| `refactor/` | code changes without new behavior | `refactor/meal-card`       |

### Pull requests

1. Open a PR into `main`.
2. CI must pass: lint, format check, typecheck and build.
3. At least one approval from another team member.
4. Merge with **Squash and merge**. The branch is deleted automatically.

Every PR gets a Vercel preview deployment, use it for reviewing UI changes.

### Before pushing

```bash
npm run format
npm run lint
npm run typecheck
```

## Conventions

### Metadata

Every page exports its own metadata with at least a `title`. The root layout adds the suffix `| KaaS` automatically.

```tsx
export const metadata: Metadata = {
  title: "Shopping list",
};
```

Dynamic pages (e.g. recipe detail) use `generateMetadata` so the title contains the actual data, such as the meal name.

### UI components

- shadcn components live in `components/ui/` and are added with `npx shadcn@latest add <component>`.
- The project uses **Base UI**, not Radix. When copying examples from the shadcn docs, make sure they are for Base UI.
- Use `cn()` from `lib/utils.ts` to combine Tailwind classes.

### Data access

- Pages and Server Actions read and write data only through functions in `lib/data/`, never with the Supabase client directly.
- Every such function checks the user with `requireUser()` from `lib/auth/dal.ts` and filters by their id explicitly, even though RLS does the same. If one of them is ever wrong, the other still protects the data.
- They return plain objects with camelCase fields, not database rows, so components do not depend on column names. Types shared with client components live in `lib/meals.ts`.
- A function that loads one record returns `null` when it does not exist or belongs to someone else. The page then calls `notFound()`.

## Project structure

```
app/                   routes, layouts and pages
components/ui/         shadcn/ui components
components/            app-specific components
lib/                   utilities and shared logic
lib/auth/              who the current user is (data access layer)
lib/data/              database queries, return types the UI uses
lib/supabase/          Supabase clients and generated database types
scripts/               seed script
supabase/migrations/   database schema
```
