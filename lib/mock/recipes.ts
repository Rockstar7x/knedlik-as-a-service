import { mockWeek } from "@/lib/mock/week-plan";

export type Ingredient = {
  name: string;
  quantity: number;
  unit: "g" | "ml" | "pcs";
};

export type RecipeDetail = {
  ingredients: Ingredient[];
  steps: string[];
};

export const mockRecipes: Record<string, RecipeDetail> = {
  "mon-breakfast": {
    ingredients: [
      { name: "Tvaroh", quantity: 250, unit: "g" },
      { name: "Eggs", quantity: 2, unit: "pcs" },
      { name: "Plain flour", quantity: 60, unit: "g" },
      { name: "Milk", quantity: 80, unit: "ml" },
      { name: "Blueberries", quantity: 150, unit: "g" },
      { name: "Honey", quantity: 20, unit: "g" },
    ],
    steps: [
      "Simmer the blueberries with the honey and a splash of water for 5 minutes until they burst.",
      "Whisk the tvaroh, eggs, flour and milk into a thick, smooth batter.",
      "Fry small pancakes on a lightly oiled pan, about 2 minutes on each side.",
      "Serve warm with the blueberry compote spooned over the top.",
    ],
  },
  "mon-lunch": {
    ingredients: [
      { name: "Red lentils", quantity: 200, unit: "g" },
      { name: "Onion", quantity: 1, unit: "pcs" },
      { name: "Garlic cloves", quantity: 2, unit: "pcs" },
      { name: "Sweet paprika", quantity: 10, unit: "g" },
      { name: "Caraway seeds", quantity: 3, unit: "g" },
      { name: "Vegetable stock", quantity: 600, unit: "ml" },
      { name: "Pickled cucumbers", quantity: 2, unit: "pcs" },
      { name: "Rye bread", quantity: 2, unit: "pcs" },
    ],
    steps: [
      "Fry the finely chopped onion in a little oil until golden.",
      "Stir in the garlic, paprika and caraway and fry for 30 seconds without burning the paprika.",
      "Add the rinsed lentils and the stock and simmer for 20 minutes until the lentils fall apart.",
      "Season with salt and a pinch of marjoram and let the goulash thicken for a few minutes.",
      "Serve with sliced pickled cucumbers and a slice of rye bread.",
    ],
  },
  "mon-dinner": {
    ingredients: [
      { name: "Chicken thighs", quantity: 600, unit: "g" },
      { name: "Carrots", quantity: 2, unit: "pcs" },
      { name: "Parsley root", quantity: 1, unit: "pcs" },
      { name: "Celeriac", quantity: 150, unit: "g" },
      { name: "Red onion", quantity: 1, unit: "pcs" },
      { name: "Olive oil", quantity: 20, unit: "ml" },
      { name: "Fresh thyme", quantity: 1, unit: "pcs" },
    ],
    steps: [
      "Preheat the oven to 200 °C.",
      "Cut the root vegetables and onion into large chunks and toss them with the oil, salt and thyme.",
      "Spread the vegetables on a baking tray and lay the seasoned chicken thighs on top, skin side up.",
      "Roast for 40 minutes until the skin is crispy and the vegetables are soft.",
    ],
  },
  "tue-dinner": {
    ingredients: [
      { name: "Fresh dill", quantity: 1, unit: "pcs" },
      { name: "Whipping cream 31%", quantity: 200, unit: "ml" },
      { name: "Milk", quantity: 200, unit: "ml" },
      { name: "Plain flour", quantity: 30, unit: "g" },
      { name: "Butter", quantity: 30, unit: "g" },
      { name: "Eggs", quantity: 4, unit: "pcs" },
      { name: "Bread dumplings", quantity: 1, unit: "pcs" },
      { name: "White wine vinegar", quantity: 15, unit: "ml" },
    ],
    steps: [
      "Boil the eggs for 9 minutes, cool them in cold water and peel them.",
      "Melt the butter, stir in the flour and cook the roux for 2 minutes.",
      "Whisk in the milk and cream and simmer until the sauce is smooth and thick.",
      "Season with salt, sugar and vinegar so the sauce is gently sweet and sour, then stir in the chopped dill.",
      "Steam the sliced dumplings and serve them with the sauce and halved eggs.",
    ],
  },
  "sun-lunch": {
    ingredients: [
      { name: "Pork shoulder", quantity: 500, unit: "g" },
      { name: "Caraway seeds", quantity: 5, unit: "g" },
      { name: "Garlic cloves", quantity: 3, unit: "pcs" },
      { name: "Onion", quantity: 1, unit: "pcs" },
      { name: "Red cabbage, pickled", quantity: 700, unit: "g" },
      { name: "Apple", quantity: 1, unit: "pcs" },
      { name: "Bread dumplings", quantity: 1, unit: "pcs" },
    ],
    steps: [
      "Rub the pork with salt, crushed garlic and caraway and leave it for at least 30 minutes.",
      "Put the pork on a bed of sliced onion, pour in a glass of water and roast covered at 170 °C for 70 minutes.",
      "Uncover, turn up the oven to 200 °C and roast for 20 more minutes until golden, basting with the juices.",
      "Warm the red cabbage with the grated apple and a little of the meat juices.",
      "Slice the pork and serve with the cabbage, steamed dumplings and the roasting juices.",
    ],
  },
};

export function findMockMeal(mealId: string) {
  for (const day of mockWeek) {
    const meal = day.meals.find((m) => m.id === mealId);
    if (meal) {
      return { meal, dayName: day.dayName, recipe: mockRecipes[mealId] };
    }
  }
  return undefined;
}
