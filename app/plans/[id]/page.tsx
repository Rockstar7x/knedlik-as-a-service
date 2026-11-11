import { DayPlan } from "@/components/day-plan";
import { buttonVariants } from "@/components/ui/button";
import { mockWeek } from "@/lib/mock/week-plan";
import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Meal plan",
};

async function WeekHeading({
  params,
}: {
  params: PageProps<"/plans/[id]">["params"];
}) {
  const { id } = await params;
  return (
    <div className="flex items-center justify-between">
      <Link
        href="/plans"
        className={buttonVariants({ variant: "ghost", size: "sm" })}
      >
        ← All plans
      </Link>

      <h1 className="text-2xl font-semibold">Plan {id}</h1>
      <Link
        href={`/plans/${id}/shopping-list`}
        className={buttonVariants({ variant: "ghost", size: "sm" })}
      >
        Shopping list
      </Link>
    </div>
  );
}

export default function MealPlanPage({ params }: PageProps<"/plans/[id]">) {
  return (
    <main className="mx-auto grid w-full max-w-4xl gap-8 px-6 pb-6">
      <Suspense fallback={<h1 className="text-2xl font-semibold">Loading…</h1>}>
        <WeekHeading params={params} />
      </Suspense>

      {mockWeek.map((day) => (
        <DayPlan key={day.dayName} dayName={day.dayName} meals={day.meals} />
      ))}
    </main>
  );
}
