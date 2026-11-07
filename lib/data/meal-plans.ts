import "server-only";
import { requireUser } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";

export type MealPlanSummaryDTO = {
  id: string;
  weekStart: string;
  note: string | null;
  mealCount: number;
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
