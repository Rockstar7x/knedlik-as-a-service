import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ShoppingList } from "@/components/shopping-list";
import { buttonVariants } from "@/components/ui/button";
import { mockShoppingList } from "@/lib/mock/shopping-list";

export const metadata: Metadata = {
  title: "Shopping list",
};

async function BackToPlan({
  params,
}: {
  params: PageProps<"/plans/[id]/shopping-list">["params"];
}) {
  const { id } = await params;
  return (
    <Link
      href={`/plans/${id}`}
      className={buttonVariants({ variant: "ghost", size: "sm" })}
    >
      ← Back to plan
    </Link>
  );
}

export default function ShoppingListPage({
  params,
}: PageProps<"/plans/[id]/shopping-list">) {
  return (
    <main className="mx-auto grid w-full max-w-4xl gap-6 px-6 pb-6">
      <div className="grid justify-items-start gap-2">
        <Suspense fallback={<div className="h-7" />}>
          <BackToPlan params={params} />
        </Suspense>
        <h1 className="text-2xl font-semibold">Shopping list</h1>
      </div>
      <ShoppingList items={mockShoppingList} />
    </main>
  );
}
