"use client";

import { createContext, use, type ReactNode } from "react";
import type { ProfileDTO } from "@/lib/data/profiles";

/**
 * Shares the signed-in user with Client Components.
 *
 * This is for DISPLAY only (user menu, avatar, "Hi, Joe"). It is not an auth
 * guard: protected pages and Server Actions verify the user on the server via
 * lib/auth/dal.ts, and RLS protects the data. Hiding something in a Client
 * Component does not stop its data from reaching the browser.
 *
 * The value is a Promise created on the server (not awaited), so the page
 * streams immediately and each consumer suspends behind its own <Suspense>.
 * Pattern: Next.js docs, "Authentication with Cache Components", step 3.
 *
 * Server Components should not use this; they call the DAL directly.
 */
const UserContext = createContext<Promise<ProfileDTO | null> | null>(null);

export function UserProvider({
  userPromise,
  children,
}: {
  userPromise: Promise<ProfileDTO | null>;
  children: ReactNode;
}) {
  return <UserContext value={userPromise}>{children}</UserContext>;
}

/**
 * The signed-in user's profile, or null for visitors. Suspends until it is
 * loaded, so render the calling component inside <Suspense>.
 */
export function useUser(): ProfileDTO | null {
  const userPromise = use(UserContext);
  if (!userPromise) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return use(userPromise);
}
