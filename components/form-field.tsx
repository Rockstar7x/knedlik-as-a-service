import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormFieldProps = ComponentProps<typeof Input> & {
  name: string;
  label: string;
  /** Short help text shown under the label. */
  hint?: string;
  errors?: string[];
};

/** Label + input + validation messages, wired up for screen readers. */
export function FormField({
  name,
  label,
  hint,
  errors,
  ...inputProps
}: FormFieldProps) {
  const hintId = `${name}-hint`;
  const errorId = `${name}-error`;
  const hasErrors = !!errors?.length;
  const describedBy =
    [hint && hintId, hasErrors && errorId].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      {hint && (
        <p id={hintId} className="-mt-1 text-sm text-muted-foreground">
          {hint}
        </p>
      )}
      <Input
        id={name}
        name={name}
        aria-invalid={hasErrors || undefined}
        aria-describedby={describedBy}
        {...inputProps}
      />
      {hasErrors && (
        <p id={errorId} className="text-sm text-destructive">
          {errors.join(" ")}
        </p>
      )}
    </div>
  );
}
