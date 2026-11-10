"use client";

import { useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";

type ShoppingListItemProps = {
  name: string;
  quantity?: number;
  unit?: string;
  defaultChecked?: boolean | undefined;
};

export function ShoppingListItem({
  name,
  quantity,
  unit,
  defaultChecked,
}: ShoppingListItemProps) {
  const [checked, setChecked] = useState(defaultChecked ?? false);
  return (
    <div className="flex items-center justify-between">
      <Label className="flex items-center gap-3">
        <Checkbox
          checked={checked}
          onCheckedChange={(value) => setChecked(value)}
        />
        <span className={cn(checked && "text-muted-foreground line-through")}>
          {name}
        </span>
      </Label>
      {quantity !== undefined && (
        <span>
          {quantity} {unit}
        </span>
      )}
    </div>
  );
}
