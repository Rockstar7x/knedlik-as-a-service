"use client";

import { useState } from "react";
import { ShoppingListItem } from "@/components/shopping-list-item";
import { type ShoppingItem } from "@/lib/mock/shopping-list";

type ShoppingListProps = {
  items: ShoppingItem[];
};

export function ShoppingList({ items }: ShoppingListProps) {
  const [checkedIds, setCheckedIds] = useState<string[]>(
    items.filter((item) => item.checked).map((item) => item.id),
  );

  function toggleItem(id: string, checked: boolean) {
    if (checked) {
      setCheckedIds([...checkedIds, id]);
    } else {
      setCheckedIds(checkedIds.filter((checkedId) => checkedId !== id));
    }
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Your shopping list is empty.
      </p>
    );
  }

  return (
    <div className="grid gap-2">
      <p className="text-sm text-muted-foreground">
        {checkedIds.length} of {items.length} items bought
      </p>
      <ul className="divide-y">
        {items.map((item) => (
          <li key={item.id}>
            <ShoppingListItem
              name={item.name}
              quantity={item.quantity}
              unit={item.unit}
              checked={checkedIds.includes(item.id)}
              onCheckedChange={(checked) => toggleItem(item.id, checked)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
