import "server-only";
import { cache } from "react";
import { requireUser } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import type { PreferencesInput } from "@/lib/validation/preferences";

export type PreferencesDTO = PreferencesInput;

/**
 * Preferences of the signed-in user, or null if they have not finished
 * onboarding yet. Redirects visitors to login.
 *
 * cache(): the page and its children share one query per request.
 */
export const getMyPreferences = cache(
  async (returnTo = "/onboarding"): Promise<PreferencesDTO | null> => {
    const user = await requireUser(returnTo);

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("preferences")
      .select(
        "meal_types, categories, appliances, servings, diet, allergens, disliked_ingredients, max_prep_minutes, daily_kcal_target, cooking_skill, weekly_budget_czk",
      )
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) throw new Error(`Failed to load preferences: ${error.message}`);
    if (!data) return null;

    return {
      mealTypes: data.meal_types,
      categories: data.categories,
      appliances: data.appliances,
      servings: data.servings,
      diet: data.diet,
      allergens: data.allergens,
      dislikedIngredients: data.disliked_ingredients,
      maxPrepMinutes: data.max_prep_minutes,
      dailyKcalTarget: data.daily_kcal_target,
      cookingSkill: data.cooking_skill,
      weeklyBudgetCzk: data.weekly_budget_czk,
    };
  },
);

/** Creates or replaces the signed-in user's preferences. */
export async function saveMyPreferences(input: PreferencesInput) {
  const user = await requireUser("/onboarding");

  const supabase = await createClient();
  const { error } = await supabase.from("preferences").upsert({
    user_id: user.id,
    meal_types: input.mealTypes,
    categories: input.categories,
    appliances: input.appliances,
    servings: input.servings,
    diet: input.diet,
    allergens: input.allergens,
    disliked_ingredients: input.dislikedIngredients,
    max_prep_minutes: input.maxPrepMinutes,
    daily_kcal_target: input.dailyKcalTarget,
    cooking_skill: input.cookingSkill,
    weekly_budget_czk: input.weeklyBudgetCzk,
  });
  if (error) throw new Error(`Failed to save preferences: ${error.message}`);
}
