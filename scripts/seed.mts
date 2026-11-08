import {
  createClient,
  type PostgrestSingleResponse,
} from "@supabase/supabase-js";
import type {
  Database,
  Enums,
  TablesInsert,
} from "../lib/supabase/database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey =
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !secretKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local",
  );
  process.exit(1);
}

const supabase = createClient<Database>(url, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEMO_PASSWORD = "knedlik123";

const DEMO_USERS: {
  email: string;
  name: string;
  preferences: Omit<TablesInsert<"preferences">, "user_id">;
}[] = [
  {
    email: "joe@knedlik.test",
    name: "Joe Smith",
    preferences: {
      meal_types: ["LUNCH", "DINNER"],
      categories: ["CZECH_CLASSIC", "HIGH_PROTEIN"],
      appliances: ["STOVE", "OVEN"],
      servings: 2,
    },
  },
  {
    email: "jane@knedlik.test",
    name: "Jane Doe",
    preferences: {
      meal_types: ["BREAKFAST", "LUNCH", "DINNER"],
      categories: ["VEGETARIAN", "QUICK", "BUDGET"],
      appliances: ["STOVE", "MICROWAVE", "BLENDER"],
      servings: 1,
    },
  },
];

type Recipe = {
  name: string;
  mealType: Enums<"meal_type">;
  vegetarian: boolean;
  prepMinutes: number;
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  /** Quantities are per one serving. */
  ingredients: { name: string; quantity: number; unit: Enums<"unit"> }[];
  steps: string[];
};

const RECIPES: Recipe[] = [
  {
    name: "Oatmeal with banana",
    mealType: "BREAKFAST",
    vegetarian: true,
    prepMinutes: 10,
    kcal: 380,
    proteinG: 12,
    carbsG: 62,
    fatG: 8,
    ingredients: [
      { name: "Rolled oats", quantity: 60, unit: "G" },
      { name: "Milk", quantity: 250, unit: "ML" },
      { name: "Banana", quantity: 1, unit: "PCS" },
    ],
    steps: [
      "Pour the milk over the oats and bring to a boil.",
      "Simmer for 5 minutes, stirring constantly.",
      "Serve topped with sliced banana.",
    ],
  },
  {
    name: "Scrambled eggs with bread",
    mealType: "BREAKFAST",
    vegetarian: true,
    prepMinutes: 10,
    kcal: 420,
    proteinG: 22,
    carbsG: 30,
    fatG: 22,
    ingredients: [
      { name: "Eggs", quantity: 3, unit: "PCS" },
      { name: "Butter", quantity: 10, unit: "G" },
      { name: "Bread", quantity: 80, unit: "G" },
    ],
    steps: [
      "Melt the butter in a pan.",
      "Whisk the eggs with a pinch of salt and pour them into the pan.",
      "Stir until set and serve with bread.",
    ],
  },
  {
    name: "Beef sirloin in cream sauce with dumplings",
    mealType: "LUNCH",
    vegetarian: false,
    prepMinutes: 180,
    kcal: 850,
    proteinG: 42,
    carbsG: 78,
    fatG: 38,
    ingredients: [
      { name: "Beef sirloin", quantity: 200, unit: "G" },
      { name: "Root vegetables", quantity: 150, unit: "G" },
      { name: "Heavy cream", quantity: 100, unit: "ML" },
      { name: "Bread dumpling slices", quantity: 4, unit: "PCS" },
    ],
    steps: [
      "Season the beef and sear it on all sides.",
      "Add the chopped vegetables and sauté.",
      "Add water and braise in the oven for 2.5 hours.",
      "Remove the meat, blend the sauce and finish it with cream.",
      "Serve with dumplings and cranberries.",
    ],
  },
  {
    name: "Beef goulash with bread",
    mealType: "LUNCH",
    vegetarian: false,
    prepMinutes: 120,
    kcal: 720,
    proteinG: 40,
    carbsG: 45,
    fatG: 36,
    ingredients: [
      { name: "Beef shoulder", quantity: 200, unit: "G" },
      { name: "Onion", quantity: 1, unit: "PCS" },
      { name: "Sweet paprika", quantity: 5, unit: "G" },
      { name: "Bread", quantity: 100, unit: "G" },
    ],
    steps: [
      "Chop the onion and fry until golden.",
      "Add the cubed beef and brown it.",
      "Sprinkle with paprika, add water and simmer for 1.5 hours.",
      "Serve with bread.",
    ],
  },
  {
    name: "Fried cheese with fries",
    mealType: "LUNCH",
    vegetarian: true,
    prepMinutes: 25,
    kcal: 900,
    proteinG: 35,
    carbsG: 70,
    fatG: 52,
    ingredients: [
      { name: "Edam cheese", quantity: 120, unit: "G" },
      { name: "Eggs", quantity: 1, unit: "PCS" },
      { name: "Breadcrumbs", quantity: 40, unit: "G" },
      { name: "Potatoes", quantity: 250, unit: "G" },
    ],
    steps: [
      "Coat the cheese in flour, egg and breadcrumbs.",
      "Cut the potatoes into fries and bake them in the oven.",
      "Fry the cheese on both sides until golden.",
    ],
  },
  {
    name: "Sour lentils with a fried egg",
    mealType: "DINNER",
    vegetarian: true,
    prepMinutes: 40,
    kcal: 540,
    proteinG: 28,
    carbsG: 68,
    fatG: 14,
    ingredients: [
      { name: "Lentils", quantity: 100, unit: "G" },
      { name: "Onion", quantity: 1, unit: "PCS" },
      { name: "Eggs", quantity: 1, unit: "PCS" },
      { name: "Pickled gherkin", quantity: 1, unit: "PCS" },
    ],
    steps: [
      "Rinse the lentils and cook until soft.",
      "Fry the onion and stir it into the lentils.",
      "Season with vinegar and salt.",
      "Serve with a fried egg and a gherkin.",
    ],
  },
  {
    name: "Chicken breast with rice",
    mealType: "DINNER",
    vegetarian: false,
    prepMinutes: 30,
    kcal: 560,
    proteinG: 48,
    carbsG: 60,
    fatG: 10,
    ingredients: [
      { name: "Chicken breast", quantity: 180, unit: "G" },
      { name: "Rice", quantity: 80, unit: "G" },
      { name: "Broccoli", quantity: 150, unit: "G" },
    ],
    steps: [
      "Cook the rice according to the package.",
      "Season the chicken with salt and pepper and pan-fry it.",
      "Boil the broccoli in salted water for 4 minutes.",
    ],
  },
  {
    name: "Potato pancakes",
    mealType: "DINNER",
    vegetarian: true,
    prepMinutes: 35,
    kcal: 610,
    proteinG: 12,
    carbsG: 72,
    fatG: 30,
    ingredients: [
      { name: "Potatoes", quantity: 300, unit: "G" },
      { name: "Eggs", quantity: 1, unit: "PCS" },
      { name: "Plain flour", quantity: 40, unit: "G" },
      { name: "Garlic cloves", quantity: 2, unit: "PCS" },
    ],
    steps: [
      "Grate the potatoes and squeeze out the liquid.",
      "Mix in the egg, flour, garlic, marjoram and salt.",
      "Fry the pancakes in hot oil on both sides.",
    ],
  },
];

/** Monday of the current week, as YYYY-MM-DD. */
function currentMonday(): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  const day = (d.getUTCDay() + 6) % 7; // 0 = Monday
  d.setUTCDate(d.getUTCDate() - day);
  return d;
}

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, days: number) {
  const copy = new Date(d);
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

/** Unwraps a Supabase response or throws with a readable message. */
function must<T>(result: PostgrestSingleResponse<T>, what: string) {
  if (result.error) {
    throw new Error(`${what}: ${result.error.message}`);
  }
  return result.data;
}

async function deleteDemoUsers() {
  // Also remove demo users from earlier versions of this script.
  const legacyEmails = ["pepa@knedlik.test", "jana@knedlik.test"];
  const emails = new Set([...DEMO_USERS.map((u) => u.email), ...legacyEmails]);
  const { data, error } = await supabase.auth.admin.listUsers({
    perPage: 1000,
  });
  if (error) throw new Error(`listUsers: ${error.message}`);

  for (const user of data.users) {
    if (user.email && emails.has(user.email)) {
      const { error: delError } = await supabase.auth.admin.deleteUser(user.id);
      if (delError)
        throw new Error(`deleteUser ${user.email}: ${delError.message}`);
      console.log(`  removed existing ${user.email}`);
    }
  }
}

async function seedUser(demo: (typeof DEMO_USERS)[number]) {
  // Creating the user through the Admin API fires the handle_new_user()
  // trigger, which inserts the matching public.profiles row.
  const { data: created, error } = await supabase.auth.admin.createUser({
    email: demo.email,
    password: DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: { name: demo.name },
  });
  if (error) throw new Error(`createUser ${demo.email}: ${error.message}`);
  const userId = created.user.id;

  must(
    await supabase
      .from("preferences")
      .insert({ user_id: userId, ...demo.preferences })
      .select()
      .single(),
    "insert preferences",
  );

  const servings = demo.preferences.servings ?? 2;
  const vegetarianOnly = demo.preferences.categories?.includes("VEGETARIAN");
  const mealTypes = demo.preferences.meal_types ?? ["LUNCH", "DINNER"];
  const weekStart = currentMonday();

  const plan = must(
    await supabase
      .from("meal_plans")
      .insert({
        user_id: userId,
        week_start: isoDate(weekStart),
        servings,
        note: "Sample meal plan from the seed script",
      })
      .select()
      .single(),
    "insert meal plan",
  );

  // Pick recipes for each day, rotating through the matching ones.
  const planned: { recipe: Recipe; date: string }[] = [];
  for (let day = 0; day < 7; day++) {
    for (const mealType of mealTypes) {
      const options = RECIPES.filter(
        (r) => r.mealType === mealType && (!vegetarianOnly || r.vegetarian),
      );
      if (options.length === 0) continue;
      planned.push({
        recipe: options[day % options.length],
        date: isoDate(addDays(weekStart, day)),
      });
    }
  }

  const meals = must(
    await supabase
      .from("meals")
      .insert(
        planned.map(({ recipe, date }) => ({
          plan_id: plan.id,
          date,
          meal_type: recipe.mealType,
          name: recipe.name,
          prep_minutes: recipe.prepMinutes,
          kcal: recipe.kcal,
          protein_g: recipe.proteinG,
          carbs_g: recipe.carbsG,
          fat_g: recipe.fatG,
        })),
      )
      .select("id"),
    "insert meals",
  );

  const steps: TablesInsert<"meal_steps">[] = [];
  const ingredients: TablesInsert<"meal_ingredients">[] = [];
  const shopping = new Map<string, TablesInsert<"shopping_items">>();

  meals.forEach((meal, i) => {
    const { recipe } = planned[i];
    recipe.steps.forEach((text, idx) =>
      steps.push({ meal_id: meal.id, position: idx + 1, text }),
    );
    for (const ing of recipe.ingredients) {
      const quantity = ing.quantity * servings;
      ingredients.push({
        meal_id: meal.id,
        name: ing.name,
        quantity,
        unit: ing.unit,
      });

      // Shopping list = all ingredients of the plan, summed by name + unit.
      const key = `${ing.name}|${ing.unit}`;
      const item = shopping.get(key);
      if (item) {
        item.total_quantity += quantity;
      } else {
        shopping.set(key, {
          plan_id: plan.id,
          name: ing.name,
          total_quantity: quantity,
          unit: ing.unit,
          // Bulk inserts send NULL (not the column default) for keys that are
          // missing from some rows, so every row must set the same keys.
          have: false,
          bought: false,
        });
      }
    }
  });

  must(
    await supabase.from("meal_steps").insert(steps).select("id"),
    "insert steps",
  );
  must(
    await supabase.from("meal_ingredients").insert(ingredients).select("id"),
    "insert ingredients",
  );

  const shoppingItems = [...shopping.values()];
  // Mark a couple of items as already at home / bought, for UI testing.
  if (shoppingItems[0]) shoppingItems[0].have = true;
  if (shoppingItems[1]) shoppingItems[1].bought = true;
  must(
    await supabase.from("shopping_items").insert(shoppingItems).select("id"),
    "insert shopping items",
  );

  console.log(
    `  ${demo.email}: ${meals.length} meals, ${steps.length} steps, ` +
      `${ingredients.length} ingredients, ${shoppingItems.length} shopping items`,
  );
}

console.log("Seeding Supabase…");
await deleteDemoUsers();
for (const demo of DEMO_USERS) {
  await seedUser(demo);
}
console.log(
  `Done. Log in with any demo e-mail and password "${DEMO_PASSWORD}".`,
);
