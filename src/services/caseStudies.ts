import { supabase } from "../lib/supabase";

export async function getCaseStudy(
  projectId: string,
) {
  const { data, error } = await supabase
    .from("case_studies")
    .select(`
      *,
      members:project_members (
        id,
        name,
        role,
        description,
        website,
        github,
        sort_order
      )
    `)
    .eq("project_id", projectId)
    .eq("visible", true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}