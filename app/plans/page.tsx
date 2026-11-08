import { Suspense } from "react";
import { getMyMealPlans } from "@/lib/data/meal-plans";

// Protected page: getMyMealPlans() calls requireUser(), which redirects
// visitors to login. proxy.ts redirects earlier too, but this page does not
// depend on it.

async function MealPlanList() {
  const plans = await getMyMealPlans("/plans");

  if (plans.length === 0) {
    return <p className="text-sm text-muted-foreground">No meal plans yet.</p>;
  }

  return (
    <ul className="list-disc pl-5 text-sm">
      {plans.map((plan) => (
        <li key={plan.id}>
          Week of {plan.weekStart}: {plan.mealCount} meals
          {plan.note ? ` — ${plan.note}` : ""}
        </li>
      ))}
    </ul>
  );
}

export default function PlansPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-6 pb-6">
      <h1 className="text-2xl font-semibold">Your meal plans</h1>
      <Suspense
        fallback={<p className="text-sm text-muted-foreground">Loading…</p>}
      >
        <MealPlanList />
      </Suspense>
    </main>
  );
}
