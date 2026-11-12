"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ShoppingListItemProps = {
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function ShoppingListItem({
  name,
  quantity,
  unit,
  checked,
  onCheckedChange,
}: ShoppingListItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <Label className="min-w-0 flex-1 gap-3 leading-snug">
        <Checkbox
          checked={checked}
          onCheckedChange={(value) => onCheckedChange(value)}
        />
        <span
          className={cn(
            "min-w-0 break-words",
            checked && "text-muted-foreground line-through",
          )}
        >
          {name}
        </span>
      </Label>
      <span
        className={cn(
          "shrink-0 text-sm tabular-nums",
          checked && "text-muted-foreground",
        )}
      >
        {quantity} {unit}
      </span>
    </div>
  );
}
