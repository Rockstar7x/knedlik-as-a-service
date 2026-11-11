import { ClockIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MEAL_TYPE_LABELS, type MealType } from "@/lib/meals";

type MealCardProps = {
  mealType?: MealType;
  name: string;
  category?: string;
  preparationTime: number;
  servings?: number;
  kcal: number;
  href?: string;
};

export function MealCard({
  mealType,
  name,
  category,
  preparationTime,
  servings,
  kcal,
  href,
}: MealCardProps) {
  const card = (
    <Card className="h-full transition-shadow group-hover:ring-primary/50">
      <CardHeader>
        {mealType && (
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {MEAL_TYPE_LABELS[mealType]}
          </p>
        )}
        <CardTitle className="group-hover:text-primary">{name}</CardTitle>
        {category && <Badge variant="secondary">{category}</Badge>}
        <CardDescription>
          <span>
            <ClockIcon className="mr-2 inline h-4 w-4" />
            {preparationTime} min | {kcal} kcal
          </span>
          {servings && <span> | {servings} servings</span>}
        </CardDescription>
      </CardHeader>
    </Card>
  );

  if (!href) {
    return card;
  }

  return (
    <Link
      href={href}
      className="group rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {card}
    </Link>
  );
}
