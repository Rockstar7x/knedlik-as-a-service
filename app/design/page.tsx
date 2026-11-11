import { DayPlan } from "@/components/day-plan";
import { MacroBar } from "@/components/macro-bar";
import { MealCard } from "@/components/meal-card";
import { ShoppingList } from "@/components/shopping-list";
import { type Meal } from "@/lib/meals";
import { mockShoppingList } from "@/lib/mock/shopping-list";

const meals: Meal[] = [
  {
    id: "1",
    date: "2026-11-16",
    mealType: "LUNCH",
    name: "Svíčková na smetaně",
    category: "Hlavní jídlo",
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
    category: "Hlavní jídlo",
    preparationTime: 45,
    servings: 4,
    kcal: 600,
    protein: 35,
    carbs: 60,
    fat: 25,
  },
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
            category="Hlavní jídlo"
            preparationTime={30}
            kcal={500}
          />
          <MealCard
            name="Vepřo knedlo zelo"
            category="Hlavní jídlo"
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
        <ShoppingList items={mockShoppingList.slice(0, 4)} />
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
