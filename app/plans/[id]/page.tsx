import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { DayPlan } from "@/components/day-plan";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { mockWeek } from "@/lib/mock/week-plan";

export const metadata: Metadata = {
  title: "Meal plan",
};

async function WeekPlan({
  params,
}: {
  params: PageProps<"/plans/[id]">["params"];
}) {
  const { id } = await params;

  return (
    <>
      <div className="grid gap-2">
        <Link
          href="/plans"
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
            className: "justify-self-start",
          })}
        >
          ← All plans
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">Meal plan</h1>
          <Link
            href={`/plans/${id}/shopping-list`}
            className={buttonVariants({ variant: "outline" })}
          >
            Shopping list
          </Link>
        </div>
      </div>

      {mockWeek.map((day) => (
        <DayPlan
          key={day.dayName}
          dayName={day.dayName}
          meals={day.meals}
          planId={id}
        />
      ))}
    </>
  );
}

function WeekPlanSkeleton() {
  return (
    <>
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
      </div>
    </>
  );
}

export default function MealPlanPage({ params }: PageProps<"/plans/[id]">) {
  return (
    <main className="mx-auto grid w-full max-w-4xl gap-8 px-6 pb-6">
      <Suspense fallback={<WeekPlanSkeleton />}>
        <WeekPlan params={params} />
      </Suspense>
    </main>
  );
}
