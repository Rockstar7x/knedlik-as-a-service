"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUp, type AuthFormState } from "@/app/auth/actions";
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

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>Create a new account.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* noValidate: validation messages come from the zod schema on the server. */}
        <form action={formAction} noValidate className="flex flex-col gap-4">
          <FormField
            name="name"
            label="Name"
            autoComplete="name"
            defaultValue={state.values?.name}
            errors={state.fieldErrors?.name}
          />
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
            autoComplete="new-password"
            errors={state.fieldErrors?.password}
          />
          <FormField
            name="repeatPassword"
            label="Repeat password"
            type="password"
            autoComplete="new-password"
            errors={state.fieldErrors?.repeatPassword}
          />
          {state.formError && (
            <p role="alert" className="text-sm text-destructive">
              {state.formError}
            </p>
          )}
          <Button type="submit" disabled={pending}>
            {pending ? "Creating account…" : "Sign up"}
          </Button>
          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline underline-offset-4">
              Log in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
