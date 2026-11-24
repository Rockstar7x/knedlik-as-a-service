"use client";

import { CheckIcon } from "lucide-react";
import { useActionState, type ReactNode } from "react";
import {
  savePreferences,
  type PreferencesFormState,
  type PreferencesFormValues,
} from "@/app/onboarding/actions";
import { FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ALLERGEN_LABELS,
  APPLIANCE_LABELS,
  CATEGORY_LABELS,
  COOKING_SKILL_LABELS,
  DIET_LABELS,
  MEAL_TYPE_LABELS,
} from "@/lib/preferences-labels";
import {
  MAX_CATEGORIES,
  MAX_DISLIKED_INGREDIENTS,
  MAX_SERVINGS,
} from "@/lib/validation/preferences";

const initialState: PreferencesFormState = {};

// Diet is its own question now, so the VEGETARIAN category would duplicate it.
// The enum value stays in the database for existing rows.
const FORM_CATEGORY_LABELS = Object.fromEntries(
  Object.entries(CATEGORY_LABELS).filter(([value]) => value !== "VEGETARIAN"),
);

type ChoiceGroupProps = {
  name: string;
  legend: string;
  hint?: string;
  /** checkbox = pick any number, radio = pick exactly one. */
  type?: "checkbox" | "radio";
  options: Record<string, string>;
  checked: string[];
  errors?: string[];
};

/** A group of checkboxes or radio buttons that all submit under one name. */
function ChoiceGroup({
  name,
  legend,
  hint,
  type = "checkbox",
  options,
  checked,
  errors,
}: ChoiceGroupProps) {
  const hintId = `${name}-hint`;
  const errorId = `${name}-error`;
  const hasErrors = !!errors?.length;
  const describedBy =
    [hint && hintId, hasErrors && errorId].filter(Boolean).join(" ") ||
    undefined;

  return (
    <fieldset
      className="grid gap-2"
      aria-describedby={describedBy}
      aria-invalid={hasErrors || undefined}
    >
      <legend className="mb-2 text-sm font-medium">{legend}</legend>
      {hint && (
        <p id={hintId} className="-mt-1 text-sm text-muted-foreground">
          {hint}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {Object.entries(options).map(([value, label]) => (
          <label
            key={value}
            className="group inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-4xl border border-input bg-card px-3 text-sm font-medium transition-colors select-none hover:bg-muted has-checked:border-primary has-checked:bg-primary has-checked:text-primary-foreground has-checked:hover:bg-primary/90 has-focus-visible:ring-3 has-focus-visible:ring-ring/50"
          >
            {/* Native input keeps FormData and keyboard support; the chip is its visual. */}
            <input
              type={type}
              name={name}
              value={value}
              defaultChecked={checked.includes(value)}
              className="sr-only"
            />
            <CheckIcon
              aria-hidden
              className="hidden size-3.5 group-has-checked:block"
            />
            {label}
          </label>
        ))}
      </div>
      {hasErrors && (
        <p id={errorId} className="text-sm text-destructive">
          {errors.join(" ")}
        </p>
      )}
    </fieldset>
  );
}

/** A titled group of related questions, one card per group. */
function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>
          <h2 className="text-lg font-semibold">{title}</h2>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">{children}</CardContent>
    </Card>
  );
}

export function OnboardingForm({
  defaults,
  isEditing,
}: {
  /** Saved preferences, or sensible defaults for a first-time user. */
  defaults: PreferencesFormValues;
  /** True if the user already has preferences and is changing them. */
  isEditing: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    savePreferences,
    initialState,
  );
  // After a failed submit, show what the user sent, not the saved values.
  const values = state.values ?? defaults;
  const errors = state.fieldErrors;

  return (
    <>
      <div className="grid gap-1">
        <h1 className="text-2xl font-semibold">
          {isEditing ? "Your preferences" : "Let's set up your meal plans"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isEditing
            ? "Changes apply to the next meal plan you generate. Existing plans stay as they are."
            : "Tell us what you eat and how you cook. You can change this later."}
        </p>
      </div>

      {/* noValidate: validation messages come from the zod schema on the server. */}
      <form action={formAction} noValidate className="grid gap-6">
        <Section
          title="What you eat"
          description="Diet, allergies and what you'd rather skip."
        >
          <ChoiceGroup
            name="diet"
            type="radio"
            legend="Diet"
            options={DIET_LABELS}
            checked={[values.diet]}
            errors={errors?.diet}
          />
          <ChoiceGroup
            name="allergens"
            legend="Allergies and intolerances"
            hint="We will never plan a meal containing these."
            options={ALLERGEN_LABELS}
            checked={values.allergens}
            errors={errors?.allergens}
          />
          <FormField
            name="dislikedIngredients"
            label="Ingredients you don't like"
            hint={`Optional. Separate with commas, at most ${MAX_DISLIKED_INGREDIENTS}.`}
            placeholder="e.g. mushrooms, coriander"
            defaultValue={values.dislikedIngredients}
            errors={errors?.dislikedIngredients}
          />
          <ChoiceGroup
            name="categories"
            legend="Preferred categories"
            hint={`Optional, at most ${MAX_CATEGORIES}.`}
            options={FORM_CATEGORY_LABELS}
            checked={values.categories}
            errors={errors?.categories}
          />
          <FormField
            name="dailyKcalTarget"
            label="Daily calorie target (kcal)"
            hint="Optional. Leave empty if you don't count calories."
            type="number"
            inputMode="numeric"
            min={800}
            max={6000}
            className="w-32"
            defaultValue={values.dailyKcalTarget}
            errors={errors?.dailyKcalTarget}
          />
        </Section>

        <Section
          title="Your plan"
          description="Which meals to plan, for how many people and how much to spend."
        >
          <ChoiceGroup
            name="mealTypes"
            legend="Meals of the day"
            hint="Which meals should we plan? At least one."
            options={MEAL_TYPE_LABELS}
            checked={values.mealTypes}
            errors={errors?.mealTypes}
          />
          <FormField
            name="servings"
            label="Number of servings"
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_SERVINGS}
            className="w-24"
            defaultValue={values.servings}
            errors={errors?.servings}
          />
          <FormField
            name="weeklyBudgetCzk"
            label="Weekly budget (CZK)"
            hint="Optional. Leave empty for no limit."
            type="number"
            inputMode="numeric"
            min={100}
            className="w-32"
            defaultValue={values.weeklyBudgetCzk}
            errors={errors?.weeklyBudgetCzk}
          />
        </Section>

        <Section
          title="How you cook"
          description="So the recipes match your kitchen and your time."
        >
          <ChoiceGroup
            name="cookingSkill"
            type="radio"
            legend="Cooking skill"
            options={COOKING_SKILL_LABELS}
            checked={[values.cookingSkill]}
            errors={errors?.cookingSkill}
          />
          <ChoiceGroup
            name="appliances"
            legend="Available appliances"
            hint="What can you cook with? At least one."
            options={APPLIANCE_LABELS}
            checked={values.appliances}
            errors={errors?.appliances}
          />
          <FormField
            name="maxPrepMinutes"
            label="Maximum cooking time per meal (minutes)"
            hint="Optional. Leave empty for no limit."
            type="number"
            inputMode="numeric"
            min={5}
            max={600}
            className="w-32"
            defaultValue={values.maxPrepMinutes}
            errors={errors?.maxPrepMinutes}
          />
        </Section>

        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" size="lg" disabled={pending}>
            {pending
              ? "Saving…"
              : isEditing
                ? "Save preferences"
                : "Finish onboarding"}
          </Button>
          {state.formError && (
            <p role="alert" className="text-sm text-destructive">
              {state.formError}
            </p>
          )}
        </div>
      </form>
    </>
  );
}
