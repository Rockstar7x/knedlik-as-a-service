import type { Enums } from "@/lib/supabase/database.types";

// Human-readable labels for the preference enums. Typed as Record<Enum, string>,
// so adding a value to a database enum is a type error here until it gets a label.

export const MEAL_TYPE_LABELS: Record<Enums<"meal_type">, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
};

export const CATEGORY_LABELS: Record<Enums<"category">, string> = {
  QUICK: "Quick meals",
  HIGH_PROTEIN: "High-protein",
  CZECH_CLASSIC: "Czech classics",
  VEGETARIAN: "Vegetarian",
  BUDGET: "Budget-friendly",
};

export const APPLIANCE_LABELS: Record<Enums<"appliance">, string> = {
  STOVE: "Stovetop",
  OVEN: "Oven",
  MICROWAVE: "Microwave",
  AIR_FRYER: "Air fryer",
  BLENDER: "Blender",
};

export const DIET_LABELS: Record<Enums<"diet">, string> = {
  OMNIVORE: "I eat everything",
  VEGETARIAN: "Vegetarian",
  VEGAN: "Vegan",
  PESCATARIAN: "Pescatarian",
};

export const ALLERGEN_LABELS: Record<Enums<"allergen">, string> = {
  GLUTEN: "Gluten",
  LACTOSE: "Lactose",
  EGGS: "Eggs",
  NUTS: "Tree nuts",
  PEANUTS: "Peanuts",
  FISH: "Fish",
  SHELLFISH: "Shellfish",
  SOY: "Soy",
  SESAME: "Sesame",
  CELERY: "Celery",
  MUSTARD: "Mustard",
};

export const COOKING_SKILL_LABELS: Record<Enums<"cooking_skill">, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};
