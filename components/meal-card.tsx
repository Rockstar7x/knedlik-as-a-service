import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { ClockIcon } from "lucide-react";

type MealCardProps = {
  name: string;
  category?: string;
  preparationTime: number;
  servings?: number;
  kcal: number;
};

export function MealCard({
  name,
  category,
  preparationTime,
  servings,
  kcal,
}: MealCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
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
}
