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
- Database and authentication: _TBD (Fiwell)_
- AI generation: _TBD_
- Hosted on [Vercel](https://vercel.com)

## Getting started

### Prerequisites

- Node.js in the version from `.nvmrc` (with nvm: `nvm use`)
- npm

### Install and run

```bash
git clone https://github.com/Rockstar7x/knedlik-as-a-service.git
cd knedlik-as-a-service
npm ci
npm run dev
```

The app runs at http://localhost:3000.

### Environment variables

_TBD: will be added together with the database and authentication. Copy `.env.example` to `.env.local` and fill in the values. Never commit `.env.local`._

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

## Project structure

```
app/              routes, layouts and pages
components/ui/    shadcn/ui components
components/       app-specific components
lib/              utilities and shared logic
_
```
