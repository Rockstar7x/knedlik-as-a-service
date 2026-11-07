import type { NextRequest } from "next/server";
import { redirectPreservingSession, updateSession } from "@/lib/supabase/proxy";

/**
 * Proxy has two jobs:
 *   1. Refresh the Supabase session cookie (required by @supabase/ssr).
 *   2. Optimistic redirects, so visitors don't see a flash of a page they
 *      can't use.
 *
 * It is NOT the security boundary. Every protected page, Server Action and
 * Route Handler verifies the user itself via lib/auth/dal.ts, and Postgres
 * RLS limits every query to the user's own rows.
 */

/** Pages a signed-out visitor may open. */
function isPublicPath(pathname: string) {
  return pathname === "/" || pathname.startsWith("/auth/");
}

/** Pages that make no sense once signed in. */
const GUEST_ONLY_PATHS = ["/auth/login", "/auth/sign-up"];

export async function proxy(request: NextRequest) {
  const { response, userId } = await updateSession(request);

  // Server Action calls are POSTs to the current page. Let them through; the
  // action checks auth itself and a redirect here would break its response.
  if (request.method !== "GET" && request.method !== "HEAD") {
    return response;
  }

  const { pathname, search } = request.nextUrl;

  if (!userId && !isPublicPath(pathname)) {
    const login = new URL("/auth/login", request.url);
    login.searchParams.set("next", pathname + search);
    return redirectPreservingSession(login, response);
  }

  if (userId && GUEST_ONLY_PATHS.includes(pathname)) {
    return redirectPreservingSession(new URL("/", request.url), response);
  }

  return response;
}

export const config = {
  matcher: [
    // Everything except static assets and image files.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
