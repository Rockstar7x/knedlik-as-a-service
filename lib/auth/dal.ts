import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * Data Access Layer: the one place that decides who the current user is.
 *
 * Call it from every protected page, Server Action and Route Handler. Do not
 * rely on proxy.ts for this: proxy can be misconfigured (matcher) or skipped,
 * and layouts don't re-render on client navigation.
 */

export type SessionUser = { id: string; email: string | null };

/**
 * The signed-in user, or null for visitors.
 *
 * Uses getClaims(), which verifies the JWT signature (locally when the project
 * uses asymmetric signing keys) without a round trip to Supabase Auth. A token
 * stays valid until it expires (1 hour by default), even if the user signs out
 * elsewhere. For sensitive operations (changing email/password, deleting the
 * account) call supabase.auth.getUser() instead, which asks the Auth server.
 *
 * cache() dedupes calls within one render. Server Actions and Route Handlers
 * are not a render pass, so there every call runs again (which is fine).
 */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data) return null;

  const { sub, email } = data.claims;
  return { id: sub, email: typeof email === "string" ? email : null };
});

/**
 * The signed-in user. Redirects visitors to the login page, then back to
 * `returnTo` after they log in.
 */
export async function requireUser(returnTo = "/"): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/auth/login?next=${encodeURIComponent(returnTo)}`);
  }
  return user;
}
