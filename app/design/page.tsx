import { DayPlan, type Meal } from "@/components/day-plan";
import { MacroBar } from "@/components/macro-bar";
import { MealCard } from "@/components/meal-card";
import { ShoppingListItem } from "@/components/shopping-list-item";

const meals: Meal[] = [
  {
    id: "1",
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
        <ul className="divide-y">
          <li>
            <ShoppingListItem
              name="Smetana ke šlehání"
              quantity={250}
              unit="ml"
              defaultChecked
            />
          </li>
          <li>
            <ShoppingListItem name="Hovězí svíčková" quantity={500} unit="g" />
          </li>
        </ul>
      </section>

      <section className="grid gap-6">
        <h2 className="text-xl font-semibold">Day plan</h2>
        <DayPlan dayName="Pondělí" meals={meals} />
        <DayPlan dayName="Úterý" meals={[]} />
      </section>
    </main>
  );
}
