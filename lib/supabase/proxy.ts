import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { publicEnv } from "@/lib/env";
import type { Database } from "./database.types";

/**
 * Refreshes the Supabase session cookie. Must run in proxy.ts on every
 * request, because Server Components cannot write cookies.
 *
 * Returns the response to continue with (carrying any refreshed cookies) and
 * the user id from the JWT. The id is only good for optimistic routing
 * decisions; real authorization happens in lib/auth/dal.ts and in RLS.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const env = publicEnv();
  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          // Cache-Control: private, no-store, ... so a CDN never serves one
          // user's fresh session cookie to someone else.
          Object.entries(headers).forEach(([key, value]) =>
            response.headers.set(key, value),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and getClaims(): getClaims()
  // is what triggers the token refresh and the setAll() call above.
  const { data } = await supabase.auth.getClaims();

  return { response, userId: data?.claims.sub ?? null };
}

/**
 * Redirect that keeps refreshed session cookies and no-cache headers from
 * `from`. Returning a bare NextResponse.redirect() would drop them, and the
 * browser would keep sending the old, expired token.
 */
export function redirectPreservingSession(url: URL, from: NextResponse) {
  const redirect = NextResponse.redirect(url);
  from.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  // The cache headers @supabase/ssr passed to setAll (see Supabase docs,
  // "Hook up proxy").
  for (const header of ["cache-control", "expires", "pragma"]) {
    const value = from.headers.get(header);
    if (value) redirect.headers.set(header, value);
  }
  return redirect;
}
