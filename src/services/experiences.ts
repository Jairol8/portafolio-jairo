import { supabase } from "../lib/supabase";

import type {
  Experience,
  ExperienceColor,
  ExperienceTool,
} from "../types/experience";

type SupabaseExperienceTool = {
  id: string;
  name: string;
  slug: string;
  icon_svg: string | null;
  website: string | null;
  active: boolean;
  sort_order: number;
};

type SupabaseExperience = {
  id: string;
  period: string;
  company: string;
  role: string;
  description: string;
  logo_svg: string | null;
  color: ExperienceColor;
  visible: boolean;
  sort_order: number;
  tools: SupabaseExperienceTool[] | null;
};

export async function getExperiences(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from("experiences")
    .select(`
      *,
      tools:experience_tools (
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

  const experiences = (data ?? []) as SupabaseExperience[];
  console.log("EXPERIENCIAS RECIBIDAS DESDE SUPABASE:", data);

  return experiences.map((experience) => {
    const tools: ExperienceTool[] = (experience.tools ?? [])
      .filter((tool) => tool.active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((tool) => ({
        id: tool.id,
        name: tool.name,
        iconSvg: tool.icon_svg ?? "",
        website: tool.website ?? "",
        active: tool.active,
        sortOrder: tool.sort_order,
      }));

    return {
      id: experience.id,
      period: experience.period,
      company: experience.company,
      role: experience.role,
      description: experience.description,
      tools,
      logoSvg: experience.logo_svg ?? "",
      color: experience.color,
      visible: experience.visible,
      sortOrder: experience.sort_order,
    };
  });
}