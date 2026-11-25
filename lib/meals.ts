import { UNIT_LABELS } from "@/lib/labels";
import { type Enums } from "@/lib/supabase/database.types";
import { addDays } from "@/lib/week";

// Domain types shared by server and client components. lib/data/* maps
// database rows to these, so the UI never depends on column names.

export type MealType = Enums<"meal_type">;
export type Category = Enums<"category">;
export type Unit = Enums<"unit">;

/** Nutrition values are approximate AI estimates for one serving. */
export type Meal = {
  id: string;
  date: string;
  mealType: MealType;
  name: string;
  category: Category;
  preparationTime: number;
  servings: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
};

/** Quantity is for all servings of the meal. */
export type Ingredient = {
  id: string;
  name: string;
  quantity: number;
  unit: Unit;
};

export type Recipe = Meal & {
  ingredients: Ingredient[];
  /** In the order they are done. */
  steps: string[];
};

export type ShoppingItem = {
  id: string;
  name: string;
  /** Total over all meals of the plan. */
  quantity: number;
  unit: Unit;
  checked: boolean;
};

export type PlanDay = {
  date: string;
  meals: Meal[];
};

// A fixed locale, so server and client render the same string.
const quantityFormat = new Intl.NumberFormat("en", {
  maximumFractionDigits: 1,
});

/** 1500, "G" -> "1,500 g" */
export function formatQuantity(quantity: number, unit: Unit): string {
  return `${quantityFormat.format(quantity)} ${UNIT_LABELS[unit]}`;
}

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
