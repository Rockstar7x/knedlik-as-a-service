"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { signIn, type AuthFormState } from "@/app/auth/actions";
import { FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const initialState: AuthFormState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);
  // Where proxy.ts / requireUser() wanted to send the user. The server
  // validates it, so a tampered value only falls back to "/".
  const next = useSearchParams().get("next") ?? "/";

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Log in</CardTitle>
        <CardDescription>Enter your email and password.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* noValidate: validation messages come from the zod schema on the server. */}
        <form action={formAction} noValidate className="flex flex-col gap-4">
          <input type="hidden" name="next" value={next} />
          <FormField
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            defaultValue={state.values?.email}
            errors={state.fieldErrors?.email}
          />
          <FormField
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            errors={state.fieldErrors?.password}
          />
          {state.formError && (
            <p role="alert" className="text-sm text-destructive">
              {state.formError}
            </p>
          )}
          <Button type="submit" disabled={pending}>
            {pending ? "Logging in…" : "Log in"}
          </Button>
          <p className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/sign-up" className="underline underline-offset-4">
              Sign up
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
