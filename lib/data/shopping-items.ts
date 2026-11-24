import "server-only";
import { requireUser } from "@/lib/auth/dal";
import { type ShoppingItem } from "@/lib/meals";
import { createClient } from "@/lib/supabase/server";
import { isId } from "@/lib/validation/ids";

/**
 * Shopping list of a plan, sorted by name. Null if the plan does not exist or
 * is not the signed-in user's; an empty array if the plan has no items.
 */
export async function getMyShoppingList(
  planId: string,
): Promise<ShoppingItem[] | null> {
  const user = await requireUser(`/plans/${planId}/shopping-list`);
  if (!isId(planId)) return null;

  // Queried through the plan, so a missing plan (null) can be told apart from
  // an empty list.
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("meal_plans")
    .select("shopping_items(id, name, total_quantity, unit, checked)")
    .eq("id", planId)
    .eq("user_id", user.id)
    .order("name", { referencedTable: "shopping_items" })
    .maybeSingle();
  if (error) throw new Error(`Failed to load shopping list: ${error.message}`);
  if (!data) return null;

  return data.shopping_items.map((item) => ({
    id: item.id,
    name: item.name,
    quantity: item.total_quantity,
    unit: item.unit,
    checked: item.checked,
  }));
}
