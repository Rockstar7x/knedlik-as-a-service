import { type Enums } from "@/lib/supabase/database.types";
import { addDays } from "@/lib/week";

export type MealType = Enums<"meal_type">;

export type Meal = {
  id: string;
  date: string;
  mealType: MealType;
  name: string;
  category: string;
  preparationTime: number;
  servings: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type PlanDay = {
  date: string;
  meals: Meal[];
};

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
};

const MEAL_TYPE_ORDER: MealType[] = ["BREAKFAST", "LUNCH", "DINNER"];

export function groupMealsByDay(weekStart: string, meals: Meal[]): PlanDay[] {
  return [0, 1, 2, 3, 4, 5, 6].map((offset) => {
    const date = addDays(weekStart, offset);
    const dayMeals = meals
      .filter((meal) => meal.date === date)
      .sort(
        (a, b) =>
          MEAL_TYPE_ORDER.indexOf(a.mealType) -
          MEAL_TYPE_ORDER.indexOf(b.mealType),
      );
    return { date, meals: dayMeals };
  });
}
