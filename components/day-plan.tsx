import { MacroBar } from "@/components/macro-bar";
import { MealCard } from "@/components/meal-card";

export type Meal = {
  id: string;
  name: string;
  category: string;
  preparationTime: number;
  servings: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
};

type DayPlanProps = {
  dayName: string;
  meals: Meal[];
  planId?: string;
};

export function DayPlan({ dayName, meals, planId }: DayPlanProps) {
  if (meals.length === 0) {
    return (
      <section className="grid gap-2">
        <h2 className="text-lg font-semibold">{dayName}</h2>
        <p className="text-sm text-muted-foreground">
          No meals planned for this day.
        </p>
      </section>
    );
  }

  const totalKcal = meals.reduce((sum, meal) => sum + meal.kcal, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);

  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{dayName}</h2>
        <span className="text-sm text-muted-foreground">{totalKcal} kcal</span>
      </div>
      <MacroBar protein={totalProtein} carbs={totalCarbs} fat={totalFat} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {meals.map((meal) => (
          <MealCard
            key={meal.id}
            name={meal.name}
            category={meal.category}
            preparationTime={meal.preparationTime}
            servings={meal.servings}
            kcal={meal.kcal}
            href={planId ? `/plans/${planId}/meals/${meal.id}` : undefined}
          />
        ))}
      </div>
    </section>
  );
}
