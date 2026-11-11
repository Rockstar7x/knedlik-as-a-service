import { ClockIcon, InfoIcon, UsersIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MacroBar } from "@/components/macro-bar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { findMockMeal } from "@/lib/mock/recipes";

type RecipePageProps = PageProps<"/plans/[id]/meals/[mealId]">;

export async function generateMetadata({
  params,
}: RecipePageProps): Promise<Metadata> {
  const { mealId } = await params;
  const found = findMockMeal(mealId);
  return { title: found?.meal.name ?? "Recipe" };
}

async function Recipe({ params }: { params: RecipePageProps["params"] }) {
  const { id, mealId } = await params;
  const found = findMockMeal(mealId);

  if (!found) {
    notFound();
  }

  const { meal, dayName, recipe } = found;

  return (
    <>
      <div className="grid justify-items-start gap-3">
        <Link
          href={`/plans/${id}`}
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          ← Back to plan
        </Link>
        <Badge variant="secondary">{meal.category}</Badge>
        <h1 className="text-2xl font-semibold">{meal.name}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span>{dayName}</span>
          <span className="flex items-center gap-1.5">
            <ClockIcon className="size-4" />
            {meal.preparationTime} min
          </span>
          <span className="flex items-center gap-1.5">
            <UsersIcon className="size-4" />
            {meal.servings} {meal.servings === 1 ? "serving" : "servings"}
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nutrition per serving</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-3xl font-semibold text-primary">
            ≈ {meal.kcal} kcal
          </p>
          <MacroBar protein={meal.protein} carbs={meal.carbs} fat={meal.fat} />
          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <InfoIcon className="mt-px size-3.5 shrink-0" />
            Approximate values estimated by AI for one serving. They are not
            exact nutritional data.
          </p>
        </CardContent>
      </Card>

      {recipe ? (
        <div className="grid gap-8 md:grid-cols-[2fr_3fr]">
          <section className="grid content-start gap-2">
            <h2 className="text-lg font-semibold">Ingredients</h2>
            <p className="text-sm text-muted-foreground">
              For {meal.servings} {meal.servings === 1 ? "serving" : "servings"}
            </p>
            <ul className="divide-y">
              {recipe.ingredients.map((ingredient) => (
                <li
                  key={ingredient.name}
                  className="flex items-center justify-between gap-4 py-2.5"
                >
                  <span className="min-w-0 break-words">{ingredient.name}</span>
                  <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
                    {ingredient.quantity} {ingredient.unit}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="grid content-start gap-4">
            <h2 className="text-lg font-semibold">Steps</h2>
            <ol className="grid gap-4">
              {recipe.steps.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-medium text-secondary-foreground">
                    {index + 1}
                  </span>
                  <p className="pt-0.5 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Ingredients and steps for this meal are not available yet.
        </p>
      )}
    </>
  );
}

function RecipeSkeleton() {
  return (
    <>
      <div className="grid gap-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-44 rounded-xl" />
    </>
  );
}

export default function RecipePage({ params }: RecipePageProps) {
  return (
    <main className="mx-auto grid w-full max-w-4xl gap-8 px-6 pb-6">
      <Suspense fallback={<RecipeSkeleton />}>
        <Recipe params={params} />
      </Suspense>
    </main>
  );
}
