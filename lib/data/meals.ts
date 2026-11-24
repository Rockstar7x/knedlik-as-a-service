import "server-only";
import { cache } from "react";
import { requireUser } from "@/lib/auth/dal";
import { type Meal, type Recipe } from "@/lib/meals";
import type { Tables } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";
import { isId } from "@/lib/validation/ids";

/** Columns of public.meals that make up a Meal. Shared by every meal query. */
export const MEAL_COLUMNS =
  "id, date, meal_type, name, category, prep_minutes, kcal, protein_g, carbs_g, fat_g" as const;

type MealRow = Pick<
  Tables<"meals">,
  | "id"
  | "date"
  | "meal_type"
  | "name"
  | "category"
  | "prep_minutes"
  | "kcal"
  | "protein_g"
  | "carbs_g"
  | "fat_g"
>;

/** A meal has no servings of its own; it is cooked for the plan's servings. */
export function toMeal(row: MealRow, servings: number): Meal {
  return {
    id: row.id,
    date: row.date,
    mealType: row.meal_type,
    name: row.name,
    category: row.category,
    preparationTime: row.prep_minutes,
    servings,
    kcal: row.kcal,
    protein: row.protein_g,
    carbs: row.carbs_g,
    fat: row.fat_g,
  };
}

/**
 * A meal with its ingredients and steps, or null if it does not exist, does
 * not belong to the plan, or the plan is not the signed-in user's.
 *
 * cache(): generateMetadata and the page share one query per request.
 */
export const getMyMeal = cache(
  async (planId: string, mealId: string): Promise<Recipe | null> => {
    const user = await requireUser(`/plans/${planId}/meals/${mealId}`);
    if (!isId(planId) || !isId(mealId)) return null;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("meals")
      .select(
        `${MEAL_COLUMNS}, meal_plans!inner(servings), meal_ingredients(id, name, quantity, unit), meal_steps(position, text)`,
      )
      .eq("id", mealId)
      .eq("plan_id", planId)
      .eq("meal_plans.user_id", user.id)
      .order("name", { referencedTable: "meal_ingredients" })
      .order("position", { referencedTable: "meal_steps" })
      .maybeSingle();
    if (error) throw new Error(`Failed to load meal: ${error.message}`);
    if (!data) return null;

    return {
      ...toMeal(data, data.meal_plans.servings),
      ingredients: data.meal_ingredients,
      steps: data.meal_steps.map((step) => step.text),
    };
  },
);
