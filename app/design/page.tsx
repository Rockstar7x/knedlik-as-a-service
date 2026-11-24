import { DayPlan } from "@/components/day-plan";
import { MacroBar } from "@/components/macro-bar";
import { MealCard } from "@/components/meal-card";
import { ShoppingList } from "@/components/shopping-list";
import { CATEGORY_LABELS } from "@/lib/labels";
import { type Meal, type ShoppingItem } from "@/lib/meals";

const meals: Meal[] = [
  {
    id: "1",
    date: "2026-11-16",
    mealType: "LUNCH",
    name: "Svíčková na smetaně",
    category: "CZECH_CLASSIC",
    preparationTime: 30,
    servings: 4,
    kcal: 500,
    protein: 30,
    carbs: 50,
    fat: 20,
  },
  {
    id: "2",
    date: "2026-11-16",
    mealType: "DINNER",
    name: "Vepřo knedlo zelo",
    category: "FAMILY_CLASSIC",
    preparationTime: 45,
    servings: 4,
    kcal: 600,
    protein: 35,
    carbs: 60,
    fat: 25,
  },
];

const shoppingItems: ShoppingItem[] = [
  { id: "1", name: "Eggs", quantity: 10, unit: "PCS", checked: true },
  { id: "2", name: "Potatoes", quantity: 1500, unit: "G", checked: false },
  { id: "3", name: "Milk", quantity: 500, unit: "ML", checked: false },
  { id: "4", name: "Butter", quantity: 12.5, unit: "G", checked: false },
];

export default function DesignPage() {
  return (
    <main className="mx-auto grid w-full max-w-4xl gap-8 px-6 pb-6">
      <h1 className="text-2xl font-semibold">Design</h1>

      <section className="grid gap-4">
        <h2 className="text-xl font-semibold">Meal cards</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MealCard
            mealType="LUNCH"
            name="Svíčková na smetaně"
            category={CATEGORY_LABELS.CZECH_CLASSIC}
            preparationTime={30}
            kcal={500}
          />
          <MealCard
            name="Vepřo knedlo zelo"
            category={CATEGORY_LABELS.FAMILY_CLASSIC}
            preparationTime={45}
            kcal={600}
            servings={4}
          />
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="text-xl font-semibold">Macro bar</h2>
        <MacroBar protein={30} carbs={50} fat={20} />
      </section>

      <section className="grid gap-4">
        <h2 className="text-xl font-semibold">Shopping list</h2>
        <ShoppingList items={shoppingItems} />
        <ShoppingList items={[]} />
      </section>

      <section className="grid gap-6">
        <h2 className="text-xl font-semibold">Day plan</h2>
        <DayPlan date="2026-11-16" meals={meals} />
        <DayPlan date="2026-11-17" meals={[]} />
      </section>
    </main>
  );
}
