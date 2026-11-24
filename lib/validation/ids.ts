import { z } from "zod";

// z.guid() accepts any 8-4-4-4-12 hex string, like the Postgres uuid type.
// z.uuid() would additionally require an RFC 9562 version and variant.
const idSchema = z.guid();

/**
 * Whether a route parameter can be a database id. Check it before querying,
 * so a malformed URL leads to a 404 instead of a Postgres error.
 */
export function isId(value: string): boolean {
  return idSchema.safeParse(value).success;
}
