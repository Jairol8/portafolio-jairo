import { supabase } from "../lib/supabase";

export type SiteSettings = {
  id: number;
  name: string;
  profession: string;
  footer_description: string;
  email: string;
  github_url: string;
  linkedin_url: string;
  footer_text: string;
  show_github: boolean;
  show_linkedin: boolean;
  show_email: boolean;
  cv_url: string | null;
  updated_at: string;
};

export type UpdateSiteSettingsData = {
  name: string;
  profession: string;
  footer_description: string;
  email: string;
  github_url: string;
  linkedin_url: string;
  footer_text: string;
  show_github: boolean;
  show_linkedin: boolean;
  show_email: boolean;
  cv_url?: string | null;
};

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase
    .from("site_settings")
    .select(
      `
        id,
        name,
        profession,
        footer_description,
        email,
        github_url,
        linkedin_url,
        footer_text,
        show_github,
        show_linkedin,
        show_email,
        cv_url,
        updated_at
      `,
    )
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateSiteSettings(
  settings: UpdateSiteSettingsData,
) {
  const { error } = await supabase
    .from("site_settings")
    .update({
      name: settings.name.trim(),
      profession: settings.profession.trim(),
      footer_description: settings.footer_description.trim(),
      email: settings.email.trim(),
      github_url: settings.github_url.trim(),
      linkedin_url: settings.linkedin_url.trim(),
      footer_text: settings.footer_text.trim(),
      show_github: settings.show_github,
      show_linkedin: settings.show_linkedin,
      show_email: settings.show_email,
      cv_url: settings.cv_url ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) {
    throw error;
  }
}