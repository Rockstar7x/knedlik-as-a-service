import "server-only";
import { cache } from "react";
import { getCurrentUser } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";

/** What the UI may know about the signed-in user. Keep it narrow. */
export type ProfileDTO = { name: string | null; email: string };

/**
 * Profile of the signed-in user, or null for visitors.
 * cache(): the header and the page share one query per request.
 */
export const getMyProfile = cache(async (): Promise<ProfileDTO | null> => {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("name, email")
    .eq("id", user.id)
    .maybeSingle();
  if (error) throw new Error(`Failed to load profile: ${error.message}`);

  // A missing row means the signup trigger failed; still show who is signed in.
  return data ?? { name: null, email: user.email ?? "" };
});
