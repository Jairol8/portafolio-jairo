import { supabase } from "../lib/supabase";

export async function getAreas() {
  const { data, error } = await supabase
    .from("areas")
    .select(`
      *,
      tools:area_tools (
        id,
        name,
        slug,
        icon_svg,
        website,
        active,
        sort_order
      )
    `)
    .eq("visible", true)
    .order("sort_order", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}