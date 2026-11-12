type MacroBarProps = {
  protein: number;
  carbs: number;
  fat: number;
};

export function MacroBar({ protein, carbs, fat }: MacroBarProps) {
  const total = protein + carbs + fat;

  if (total === 0) {
    return <p className="text-sm text-muted-foreground">No nutrition data</p>;
  }

  const proteinPercent = Math.round((protein / total) * 100);
  const carbsPercent = Math.round((carbs / total) * 100);
  const fatPercent = Math.round((fat / total) * 100);

  return (
    <div className="grid gap-2">
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-chart-1"
          style={{ width: `${proteinPercent}%` }}
        />
        <div
          className="h-full bg-chart-2"
          style={{ width: `${carbsPercent}%` }}
        />
        <div
          className="h-full bg-chart-3"
          style={{ width: `${fatPercent}%` }}
        />
      </div>
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-chart-1" />
          Protein {protein} g
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-chart-2" />
          Carbs {carbs} g
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-chart-3" />
          Fat {fat} g
        </span>
      </div>
    </div>
  );
}
