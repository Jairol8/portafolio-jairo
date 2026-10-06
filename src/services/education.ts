import { supabase } from "../lib/supabase";

export async function getEducation() {
  const { data, error } = await supabase
    .from("education")
    .select("*")
    .eq("visible", true)
    .order("sort_order", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}