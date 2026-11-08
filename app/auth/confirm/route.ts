import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { confirmParamsSchema } from "@/lib/validation/auth";

// Target of the link in the confirmation e-mail.
// Supports both link styles Supabase can send:
//   ?token_hash=...&type=email  (recommended custom template)
//   ?code=...                   (default {{ .ConfirmationURL }} with PKCE)
export async function GET(request: NextRequest) {
  const parsed = confirmParamsSchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  );
  if (!parsed.success) {
    redirect(
      `/auth/error?error=${encodeURIComponent("Invalid confirmation link.")}`,
    );
  }
  const { token_hash, type, code, next } = parsed.data;

  const supabase = await createClient();
  let errorMessage = "Missing verification token.";

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) redirect(next);
    errorMessage = error.message;
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) redirect(next);
    errorMessage = error.message;
  }

  redirect(`/auth/error?error=${encodeURIComponent(errorMessage)}`);
}
