import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyPreferences, type PreferencesDTO } from "@/lib/data/preferences";
import type { PreferencesFormValues } from "./actions";
import { OnboardingForm } from "./onboarding-form";

export const metadata: Metadata = {
  title: "Onboarding",
};

// Protected page: getMyPreferences() calls requireUser(), which redirects
// visitors to login. proxy.ts redirects earlier too, but this page does not
// depend on it.

/** Starting values for someone who has not saved preferences yet. */
const FIRST_TIME_DEFAULTS: PreferencesFormValues = {
  mealTypes: ["LUNCH", "DINNER"],
  categories: [],
  appliances: ["STOVE"],
  servings: "2",
  diet: "OMNIVORE",
  allergens: [],
  dislikedIngredients: "",
  maxPrepMinutes: "",
  dailyKcalTarget: "",
  cookingSkill: "BEGINNER",
  weeklyBudgetCzk: "",
};

/** Saved preferences -> values the form inputs understand. */
function toFormValues(preferences: PreferencesDTO): PreferencesFormValues {
  const text = (value: number | null) => (value === null ? "" : String(value));
  return {
    ...preferences,
    servings: String(preferences.servings),
    dislikedIngredients: preferences.dislikedIngredients.join(", "),
    maxPrepMinutes: text(preferences.maxPrepMinutes),
    dailyKcalTarget: text(preferences.dailyKcalTarget),
    weeklyBudgetCzk: text(preferences.weeklyBudgetCzk),
  };
}

async function PreferencesFormLoader() {
  const preferences = await getMyPreferences("/onboarding");

  if (!preferences) {
    return <OnboardingForm defaults={FIRST_TIME_DEFAULTS} isEditing={false} />;
  }

  return <OnboardingForm defaults={toFormValues(preferences)} isEditing />;
}

function PreferencesFormSkeleton() {
  return (
    <div className="grid gap-6">
      <Skeleton className="h-14 w-2/3" />
      <Skeleton className="h-96 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <main className="mx-auto grid w-full max-w-4xl gap-8 px-6 pb-6">
      {/* Reads the session cookie, which is request-time data. */}
      <Suspense fallback={<PreferencesFormSkeleton />}>
        <PreferencesFormLoader />
      </Suspense>
    </main>
  );
}
