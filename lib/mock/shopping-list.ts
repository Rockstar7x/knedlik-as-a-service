export type ShoppingItem = {
  id: string;
  name: string;
  quantity: number;
  unit: "g" | "ml" | "pcs";
  checked: boolean;
};

export const mockShoppingList: ShoppingItem[] = [
  { id: "eggs", name: "Eggs", quantity: 10, unit: "pcs", checked: true },
  { id: "tvaroh", name: "Tvaroh", quantity: 500, unit: "g", checked: false },
  {
    id: "blueberries",
    name: "Blueberries",
    quantity: 250,
    unit: "g",
    checked: false,
  },
  {
    id: "red-lentils",
    name: "Red lentils",
    quantity: 200,
    unit: "g",
    checked: true,
  },
  {
    id: "chicken-thighs",
    name: "Chicken thighs",
    quantity: 600,
    unit: "g",
    checked: false,
  },
  {
    id: "turkey-breast",
    name: "Turkey breast",
    quantity: 300,
    unit: "g",
    checked: false,
  },
  {
    id: "pork-shoulder",
    name: "Pork shoulder",
    quantity: 500,
    unit: "g",
    checked: false,
  },
  {
    id: "minced-beef",
    name: "Minced beef",
    quantity: 300,
    unit: "g",
    checked: false,
  },
  { id: "tofu", name: "Firm tofu", quantity: 200, unit: "g", checked: false },
  {
    id: "potatoes",
    name: "Potatoes",
    quantity: 1500,
    unit: "g",
    checked: true,
  },
  {
    id: "sweet-potatoes",
    name: "Sweet potatoes",
    quantity: 2,
    unit: "pcs",
    checked: false,
  },
  {
    id: "chickpeas",
    name: "Chickpeas, canned",
    quantity: 400,
    unit: "g",
    checked: false,
  },
  {
    id: "cauliflower",
    name: "Cauliflower",
    quantity: 1,
    unit: "pcs",
    checked: false,
  },
  {
    id: "red-cabbage",
    name: "Red cabbage, pickled",
    quantity: 700,
    unit: "g",
    checked: false,
  },
  {
    id: "sauerkraut",
    name: "Sauerkraut",
    quantity: 300,
    unit: "g",
    checked: false,
  },
  {
    id: "zucchini",
    name: "Zucchini",
    quantity: 2,
    unit: "pcs",
    checked: false,
  },
  {
    id: "cucumbers",
    name: "Cucumbers",
    quantity: 2,
    unit: "pcs",
    checked: false,
  },
  { id: "dill", name: "Fresh dill", quantity: 1, unit: "pcs", checked: false },
  {
    id: "whipping-cream",
    name: "Whipping cream 31%",
    quantity: 250,
    unit: "ml",
    checked: false,
  },
  {
    id: "white-yoghurt",
    name: "Plain white yoghurt",
    quantity: 400,
    unit: "ml",
    checked: false,
  },
  { id: "milk", name: "Milk", quantity: 500, unit: "ml", checked: false },
  {
    id: "rye-bread",
    name: "Rye bread with caraway",
    quantity: 1,
    unit: "pcs",
    checked: false,
  },
  {
    id: "bread-dumplings",
    name: "Bread dumplings",
    quantity: 2,
    unit: "pcs",
    checked: false,
  },
  {
    id: "plum-jam",
    name: "Plum jam (povidla)",
    quantity: 200,
    unit: "g",
    checked: false,
  },
];
