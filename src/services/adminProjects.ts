import { supabase } from "../lib/supabase";

export type AdminProjectInput = {
  id: string;
  number: string;
  category: string;
  title: string;
  description: string;
  status:
    | "Completado"
    | "En desarrollo"
    | "En pausa"
    | "Próximamente";
  color:
    | "programming"
    | "design"
    | "marketing";
  progress: number;
  projectType:
    | "individual"
    | "team"
    | "company";
  demo: string;
  github: string;
  githubPublic: boolean;
  caseStudy: boolean;
  visible: boolean;
  featured: boolean;
  sortOrder: number;
  technologies: string[];
  languages: string[];
};

export async function createProject(
  project: AdminProjectInput,
) {
  const { data, error } = await supabase
    .from("projects")
    .insert({
      id: project.id,
      number: project.number,
      category: project.category.trim(),
      title: project.title.trim(),
      description: project.description.trim(),
      status: project.status,
      color: project.color,
      progress: Math.min(
        100,
        Math.max(0, project.progress),
      ),
      project_type: project.projectType,
      demo: project.demo.trim(),
      github: project.github.trim(),
      github_public: project.githubPublic,
      case_study: project.caseStudy,
      visible: project.visible,
      featured: project.featured,
      sort_order: project.sortOrder,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(
      `No se pudo crear el proyecto: ${error.message}`,
    );
  }

  if (!data?.id) {
    throw new Error(
      "Supabase no devolvió el ID del proyecto creado.",
    );
  }

  await saveProjectRelations({
    ...project,
    id: data.id,
  });

  return data.id;
}

export async function updateProject(
  project: AdminProjectInput,
) {
  const { error } = await supabase
    .from("projects")
    .update({
      number: project.number,
      category: project.category.trim(),
      title: project.title.trim(),
      description: project.description.trim(),
      status: project.status,
      color: project.color,
      progress: Math.min(
        100,
        Math.max(0, project.progress),
      ),
      project_type: project.projectType,
      demo: project.demo.trim(),
      github: project.github.trim(),
      github_public: project.githubPublic,
      case_study: project.caseStudy,
      visible: project.visible,
      featured: project.featured,
      sort_order: project.sortOrder,
    })
    .eq("id", project.id);

  if (error) {
    throw new Error(
      `No se pudo actualizar el proyecto: ${error.message}`,
    );
  }

  await saveProjectRelations(project);
}

async function saveProjectRelations(
  project: AdminProjectInput,
) {
  const { error: technologyDeleteError } =
    await supabase
      .from("project_technologies")
      .delete()
      .eq("project_id", project.id);

  if (technologyDeleteError) {
    throw new Error(
      `No se pudieron actualizar las tecnologías: ${technologyDeleteError.message}`,
    );
  }

  const { error: languageDeleteError } =
    await supabase
      .from("project_languages")
      .delete()
      .eq("project_id", project.id);

  if (languageDeleteError) {
    throw new Error(
      `No se pudieron actualizar los lenguajes: ${languageDeleteError.message}`,
    );
  }

  const technologyIds = [
    ...new Set(project.technologies),
  ].filter(Boolean);

  const languageIds = [
    ...new Set(project.languages),
  ].filter(Boolean);

  if (technologyIds.length > 0) {
    const { error } = await supabase
      .from("project_technologies")
      .insert(
        technologyIds.map(
          (technologyId) => ({
            project_id: project.id,
            technology_id: technologyId,
          }),
        ),
      );

    if (error) {
      throw new Error(
        `No se pudieron guardar las tecnologías: ${error.message}`,
      );
    }
  }

  if (languageIds.length > 0) {
    const { error } = await supabase
      .from("project_languages")
      .insert(
        languageIds.map(
          (technologyId) => ({
            project_id: project.id,
            technology_id: technologyId,
          }),
        ),
      );

    if (error) {
      throw new Error(
        `No se pudieron guardar los lenguajes: ${error.message}`,
      );
    }
  }
}

export async function deleteProject(
  projectId: string,
) {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) {
    throw new Error(
      `No se pudo eliminar el proyecto: ${error.message}`,
    );
  }
}

export async function getAdminProjects() {
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
          active,
          category
        )
      ),
      project_languages (
        technology:technologies (
          id,
          name,
          slug,
          website,
          icon_svg,
          active,
          category
        )
      )
    `)
    .order("sort_order", {
      ascending: true,
    });

  if (error) {
    throw new Error(
      `No se pudieron cargar los proyectos: ${error.message}`,
    );
  }

  return data ?? [];
}

export async function getAdminTechnologies() {
  const { data, error } = await supabase
    .from("technologies")
    .select(`
      id,
      name,
      slug,
      website,
      icon_svg,
      active,
      category
    `)
    .eq("active", true)
    .order("name", {
      ascending: true,
    });

  if (error) {
    throw new Error(
      `No se pudieron cargar las tecnologías: ${error.message}`,
    );
  }

  return data ?? [];
}

