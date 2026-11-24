import { z } from "zod";
import { Constants } from "@/lib/supabase/database.types";

// Allowed values come from the database enums, so the form can never send
// something Postgres would reject.
const { meal_type, category, appliance, diet, allergen, cooking_skill } =
  Constants.public.Enums;

export const MAX_CATEGORIES = 3;
export const MAX_SERVINGS = 12;
export const MAX_DISLIKED_INGREDIENTS = 20;
export const MAX_INGREDIENT_LENGTH = 40;

/**
 * Optional whole number from a text input: an empty field means null
 * ("no limit"), anything else must be an integer in [min, max].
 */
function optionalInt(min: number, max: number, what: string) {
  return z
    .preprocess(
      (value) =>
        value === null || (typeof value === "string" && value.trim() === "")
          ? undefined
          : value,
      z.coerce
        .number({ error: `Enter ${what} as a number.` })
        .int(`${what} must be a whole number.`)
        .min(min, `${what} must be at least ${min}.`)
        .max(max, `${what} must be at most ${max}.`)
        .optional(),
    )
    .transform((value) => value ?? null);
}

/** "mushrooms, Coriander ,mushrooms" -> ["mushrooms", "coriander"] */
function splitIngredients(value: unknown) {
  if (typeof value !== "string") return value;
  const items = value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return [...new Set(items)];
}

export const preferencesSchema = z.object({
  mealTypes: z
    .array(z.enum(meal_type))
    .min(1, "Choose at least one meal of the day."),
  categories: z
    .array(z.enum(category))
    .max(MAX_CATEGORIES, `Choose at most ${MAX_CATEGORIES} categories.`),
  appliances: z
    .array(z.enum(appliance))
    .min(1, "Choose at least one appliance."),
  servings: z.coerce
    .number({ error: "Enter the number of servings." })
    .int("Servings must be a whole number.")
    .min(1, "At least 1 serving.")
    .max(MAX_SERVINGS, `At most ${MAX_SERVINGS} servings.`),
  diet: z.enum(diet, { error: "Choose your diet." }),
  allergens: z.array(z.enum(allergen)),
  dislikedIngredients: z.preprocess(
    splitIngredients,
    z
      .array(
        z
          .string()
          .max(
            MAX_INGREDIENT_LENGTH,
            `Each ingredient can have at most ${MAX_INGREDIENT_LENGTH} characters.`,
          ),
      )
      .max(
        MAX_DISLIKED_INGREDIENTS,
        `List at most ${MAX_DISLIKED_INGREDIENTS} ingredients.`,
      ),
  ),
  maxPrepMinutes: optionalInt(5, 600, "Cooking time"),
  dailyKcalTarget: optionalInt(800, 6000, "Daily calories"),
  cookingSkill: z.enum(cooking_skill, { error: "Choose your cooking skill." }),
  weeklyBudgetCzk: optionalInt(100, 50000, "Weekly budget"),
});

export type PreferencesInput = z.infer<typeof preferencesSchema>;

/**
 * FormData -> plain object for preferencesSchema.
 * Checkboxes send one entry per checked box under the same name, so they must
 * be read with getAll(); Object.fromEntries() would keep only the last one.
 */
export function preferencesFromFormData(formData: FormData) {
  return {
    mealTypes: formData.getAll("mealTypes"),
    categories: formData.getAll("categories"),
    appliances: formData.getAll("appliances"),
    servings: formData.get("servings"),
    diet: formData.get("diet"),
    allergens: formData.getAll("allergens"),
    dislikedIngredients: formData.get("dislikedIngredients") ?? "",
    maxPrepMinutes: formData.get("maxPrepMinutes"),
    dailyKcalTarget: formData.get("dailyKcalTarget"),
    cookingSkill: formData.get("cookingSkill"),
    weeklyBudgetCzk: formData.get("weeklyBudgetCzk"),
  };
}
