import { supabase } from "../lib/supabase";

export async function getProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      project_technologies (
        technology:technologies (
          id,
          name,
          slug,
          website,
          icon_svg,
          active
        )
      ),
      project_languages (
        technology:technologies (
          id,
          name,
          slug,
          website,
          icon_svg,
          active
        )
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