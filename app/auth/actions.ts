"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { publicEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, signUpSchema } from "@/lib/validation/auth";

export type AuthFormState = {
  /** Error not tied to one field, e.g. "Invalid login credentials". */
  formError?: string;
  /** Validation messages per form field. */
  fieldErrors?: Partial<Record<string, string[]>>;
  /** Submitted values to refill the form with (never the password). */
  values?: { name?: string; email?: string };
};

function submittedValues(formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  return {
    name: typeof name === "string" ? name : undefined,
    email: typeof email === "string" ? email : undefined,
  };
}

export async function signUp(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const values = submittedValues(formData);
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      values,
    };
  }
  const { name, email, password } = parsed.data;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Read by the handle_new_user() trigger to fill profiles.name.
      data: { name },
      // Configured URL rather than the request's Origin header, so the link
      // always points at our own site. Must be allowed in Supabase Auth's
      // redirect URL list.
      emailRedirectTo: `${publicEnv().NEXT_PUBLIC_SITE_URL}/auth/confirm?next=/`,
    },
  });

  if (error) {
    return { formError: error.message, values };
  }

  // If "Confirm email" is disabled in Supabase, the user is signed in already.
  if (data.session) {
    redirect("/");
  }
  redirect("/auth/sign-up-success");
}

export async function signIn(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const values = submittedValues(formData);
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      values,
    };
  }

  const { email, password, next } = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { formError: error.message, values };
  }
  // `next` is validated by safeRedirectPath, so this cannot leave the site.
  redirect(next);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
