import Link from "next/link";
import { Suspense } from "react";
import { buttonVariants } from "@/components/ui/button";
import { getMyProfile } from "@/lib/data/profiles";

const FEATURES = [
  {
    title: "Weekly meal plans",
    text: "Breakfast, lunch and dinner for the whole week, matched to your preferences.",
  },
  {
    title: "Step-by-step recipes",
    text: "Every meal comes with ingredients, steps, prep time and macros.",
  },
  {
    title: "Automatic shopping list",
    text: "Ingredients from the whole plan, summed up and ready to tick off.",
  },
];

async function UserSection() {
  const profile = await getMyProfile();

  if (!profile) {
    return (
      <Link href="/auth/sign-up" className={buttonVariants({ size: "lg" })}>
        Get started for free
      </Link>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <p className="text-lg font-medium">
        Welcome back, {profile.name ?? profile.email}!
      </p>
      <Link href="/plans" className={buttonVariants({ size: "lg" })}>
        Open your meal plans
      </Link>
    </div>
  );
}

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-12 px-6 pb-6">
      <main className="flex flex-col gap-12">
        <section className="flex flex-col items-start gap-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Stop deciding what to cook.
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Tell us what you like and which appliances you have. We plan your
            week of meals and write the shopping list for you.
          </p>
          <Suspense fallback={null}>
            <UserSection />
          </Suspense>
        </section>

        <section className="grid gap-6 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="flex flex-col gap-1">
              <h2 className="font-medium">{feature.title}</h2>
              <p className="text-sm text-muted-foreground">{feature.text}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
