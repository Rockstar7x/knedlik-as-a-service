import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type MealPlanSummaryDTO } from "@/lib/data/meal-plans";
import { formatWeek } from "@/lib/week";

type WeekCardProps = {
  label: string;
  weekStart: string;
  plan?: MealPlanSummaryDTO;
};

export function WeekCard({ label, weekStart, plan }: WeekCardProps) {
  if (!plan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{label}</CardTitle>
          <CardDescription>{formatWeek(weekStart)}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 text-muted-foreground">
          No plan yet.
        </CardContent>
        <CardFooter>
          <Link
            href={`/plans/new?week=${weekStart}`}
            className={buttonVariants()}
          >
            Create plan
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        <CardDescription>{formatWeek(weekStart)}</CardDescription>
      </CardHeader>
      <CardContent className="grid flex-1 content-start gap-1">
        <p>
          {plan.mealCount} {plan.mealCount === 1 ? "meal" : "meals"}
        </p>
        {plan.note && (
          <p className="text-muted-foreground italic">“{plan.note}”</p>
        )}
      </CardContent>
      <CardFooter>
        <Link
          href={`/plans/${plan.id}`}
          className={buttonVariants({ variant: "outline" })}
        >
          Open plan
        </Link>
      </CardFooter>
    </Card>
  );
}
