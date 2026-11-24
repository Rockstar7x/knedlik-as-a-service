import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ShoppingList } from "@/components/shopping-list";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyShoppingList } from "@/lib/data/shopping-items";

export const metadata: Metadata = {
  title: "Shopping list",
};

type ShoppingListPageProps = PageProps<"/plans/[id]/shopping-list">;

async function BackToPlan({
  params,
}: {
  params: ShoppingListPageProps["params"];
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

async function PlanShoppingList({
  params,
}: {
  params: ShoppingListPageProps["params"];
}) {
  const { id } = await params;
  const items = await getMyShoppingList(id);

  if (!items) {
    notFound();
  }

  return <ShoppingList items={items} />;
}

function ShoppingListSkeleton() {
  return (
    <div className="grid gap-3">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-10" />
      <Skeleton className="h-10" />
      <Skeleton className="h-10" />
    </div>
  );
}

export default function ShoppingListPage({ params }: ShoppingListPageProps) {
  return (
    <main className="mx-auto grid w-full max-w-4xl gap-6 px-6 pb-6">
      <div className="grid justify-items-start gap-2">
        <Suspense fallback={<div className="h-7" />}>
          <BackToPlan params={params} />
        </Suspense>
        <h1 className="text-2xl font-semibold">Shopping list</h1>
      </div>
      <Suspense fallback={<ShoppingListSkeleton />}>
        <PlanShoppingList params={params} />
      </Suspense>
    </main>
  );
}
