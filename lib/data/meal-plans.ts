import "server-only";
import { cache } from "react";
import { requireUser } from "@/lib/auth/dal";
import { MEAL_COLUMNS, toMeal } from "@/lib/data/meals";
import { type Meal } from "@/lib/meals";
import { createClient } from "@/lib/supabase/server";
import { isId } from "@/lib/validation/ids";

export type MealPlanSummaryDTO = {
  id: string;
  weekStart: string;
  note: string | null;
  mealCount: number;
};

export type MealPlanDTO = {
  id: string;
  weekStart: string;
  meals: Meal[];
};

/**
 * Meal plans of the signed-in user, newest first.
 *
 * The explicit user_id filter and RLS both limit this to the user's own rows:
 * if one of them is ever wrong, the other still protects the data.
 */
export async function getMyMealPlans(
  returnTo = "/plans",
): Promise<MealPlanSummaryDTO[]> {
  const user = await requireUser(returnTo);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("meal_plans")
    .select("id, week_start, note, meals(count)")
    .eq("user_id", user.id)
    .order("week_start", { ascending: false });
  if (error) throw new Error(`Failed to load meal plans: ${error.message}`);

  return data.map((plan) => ({
    id: plan.id,
    weekStart: plan.week_start,
    note: plan.note,
    mealCount: plan.meals[0]?.count ?? 0,
  }));
}

/**
 * A meal plan with its meals, or null if it does not exist or is not the
 * signed-in user's.
 *
 * cache(): generateMetadata and the page share one query per request.
 */
export const getMyMealPlan = cache(
  async (planId: string): Promise<MealPlanDTO | null> => {
    const user = await requireUser(`/plans/${planId}`);
    if (!isId(planId)) return null;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("meal_plans")
      .select(`id, week_start, servings, meals(${MEAL_COLUMNS})`)
      .eq("id", planId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) throw new Error(`Failed to load meal plan: ${error.message}`);
    if (!data) return null;

    return {
      id: data.id,
      weekStart: data.week_start,
      meals: data.meals.map((meal) => toMeal(meal, data.servings)),
    };
  },
);
