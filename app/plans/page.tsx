import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { WeekCard } from "@/components/week-card";
import { getMyMealPlans } from "@/lib/data/meal-plans";
import { addWeeks, formatWeek, getWeekStart } from "@/lib/week";

export const metadata: Metadata = {
  title: "Meal plans",
};

// Protected page: getMyMealPlans() calls requireUser(), which redirects
// visitors to login. proxy.ts redirects earlier too, but this page does not
// depend on it.

async function MealPlanList() {
  const plans = await getMyMealPlans("/plans");

  const thisWeek = getWeekStart(new Date());
  const nextWeek = addWeeks(thisWeek, 1);

  const thisWeekPlan = plans.find((plan) => plan.weekStart === thisWeek);
  const nextWeekPlan = plans.find((plan) => plan.weekStart === nextWeek);
  const pastPlans = plans.filter((plan) => plan.weekStart < thisWeek);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <WeekCard label="This week" weekStart={thisWeek} plan={thisWeekPlan} />
        <WeekCard label="Next week" weekStart={nextWeek} plan={nextWeekPlan} />
      </div>

      <section className="grid gap-2">
        <h2 className="text-lg font-semibold">Past plans</h2>
        {pastPlans.length === 0 ? (
          <p className="text-sm text-muted-foreground">No past plans yet.</p>
        ) : (
          <ul className="divide-y">
            {pastPlans.map((plan) => (
              <li key={plan.id}>
                <Link
                  href={`/plans/${plan.id}`}
                  className="flex items-center justify-between gap-4 py-3 hover:text-primary"
                >
                  <span>{formatWeek(plan.weekStart)}</span>
                  <span className="text-sm text-muted-foreground">
                    {plan.mealCount} {plan.mealCount === 1 ? "meal" : "meals"} →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function MealPlanListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Skeleton className="h-44 rounded-xl" />
      <Skeleton className="h-44 rounded-xl" />
    </div>
  );
}

export default function PlansPage() {
  return (
    <main className="mx-auto grid w-full max-w-4xl gap-8 px-6 pb-6">
      <h1 className="text-2xl font-semibold">Your meal plans</h1>
      <Suspense fallback={<MealPlanListSkeleton />}>
        <MealPlanList />
      </Suspense>
    </main>
  );
}
