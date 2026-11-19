"use server";

import { redirect, unstable_rethrow } from "next/navigation";
import { z } from "zod";
import { saveMyPreferences } from "@/lib/data/preferences";
import {
  preferencesFromFormData,
  preferencesSchema,
} from "@/lib/validation/preferences";

/** Form values as the inputs hold them: checkbox groups as arrays, the rest as text. */
export type PreferencesFormValues = {
  mealTypes: string[];
  categories: string[];
  appliances: string[];
  servings: string;
  diet: string;
  allergens: string[];
  /** Comma-separated, e.g. "mushrooms, coriander". */
  dislikedIngredients: string;
  maxPrepMinutes: string;
  dailyKcalTarget: string;
  cookingSkill: string;
  weeklyBudgetCzk: string;
};

export type PreferencesFormState = {
  /** Error not tied to one field, e.g. a database failure. */
  formError?: string;
  /** Validation messages per form field. */
  fieldErrors?: Partial<Record<string, string[]>>;
  /** Submitted values to refill the form with after an error. */
  values?: PreferencesFormValues;
};

function asStrings(entries: FormDataEntryValue[]) {
  return entries.filter((entry): entry is string => typeof entry === "string");
}

function asString(entry: FormDataEntryValue | null) {
  return typeof entry === "string" ? entry : "";
}

export async function savePreferences(
  _prev: PreferencesFormState,
  formData: FormData,
): Promise<PreferencesFormState> {
  const raw = preferencesFromFormData(formData);
  const values: PreferencesFormValues = {
    mealTypes: asStrings(raw.mealTypes),
    categories: asStrings(raw.categories),
    appliances: asStrings(raw.appliances),
    servings: asString(raw.servings),
    diet: asString(raw.diet),
    allergens: asStrings(raw.allergens),
    dislikedIngredients: asString(raw.dislikedIngredients),
    maxPrepMinutes: asString(raw.maxPrepMinutes),
    dailyKcalTarget: asString(raw.dailyKcalTarget),
    cookingSkill: asString(raw.cookingSkill),
    weeklyBudgetCzk: asString(raw.weeklyBudgetCzk),
  };

  const parsed = preferencesSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors, values };
  }

  try {
    // Checks the signed-in user itself (requireUser), and RLS limits the
    // write to the user's own row.
    await saveMyPreferences(parsed.data);
  } catch (error) {
    // Let Next.js handle its own control flow, e.g. requireUser()'s redirect
    // to login when the session expired while the form was open.
    unstable_rethrow(error);
    return {
      formError: "Could not save your preferences. Please try again.",
      values,
    };
  }

  // Outside try/catch: redirect() works by throwing.
  redirect("/plans");
}
