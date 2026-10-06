import { supabase } from "../lib/supabase";

export type AdminProjectType =
  | "personal"
  | "academic"
  | "client"
  | "company";

export type AdminWorkMode =
  | "individual"
  | "team";

export type AdminCaseStudyInput = {
  projectId: string;
  projectType: AdminProjectType;
  workMode: AdminWorkMode;
  company: string;
  role: string;
  idea: string;
  origin: string;
  objective: string;
  process: string;
  result: string;
  myContribution: string;
  visible: boolean;
};

export type AdminProjectMemberInput = {
  id?: string;
  name: string;
  role: string;
  description: string;
  website?: string;
  github?: string;
  sortOrder: number;
};

export type AdminCaseStudy = {
  id: string;
  projectId: string;
  projectType: AdminProjectType;
  workMode: AdminWorkMode;
  company: string;
  role: string;
  idea: string;
  origin: string;
  objective: string;
  process: string;
  result: string;
  myContribution: string;
  visible: boolean;
  members: AdminProjectMemberInput[];
};

function createCaseStudyId(
  projectId: string,
): string {
  return `case-${projectId}`;
}

function createProjectMemberId(): string {
  return `member-${crypto.randomUUID()}`;
}

export async function getAdminCaseStudy(
  projectId: string,
): Promise<AdminCaseStudy | null> {
  const { data, error } = await supabase
    .from("case_studies")
    .select(`
      id,
      project_id,
      project_type,
      work_mode,
      company,
      role,
      idea,
      origin,
      objective,
      process,
      result,
      my_contribution,
      visible,
      project_members (
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
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    projectId: data.project_id,
    projectType:
      data.project_type === "academic" ||
      data.project_type === "client" ||
      data.project_type === "company"
        ? data.project_type
        : "personal",
    workMode:
      data.work_mode === "team"
        ? "team"
        : "individual",
    company: data.company ?? "",
    role: data.role ?? "",
    idea: data.idea ?? "",
    origin: data.origin ?? "",
    objective: data.objective ?? "",
    process: data.process ?? "",
    result: data.result ?? "",
    myContribution:
      data.my_contribution ?? "",
    visible:
      data.visible ?? true,
    members:
      (data.project_members ?? []).map(
        (member) => ({
          id: member.id,
          name: member.name ?? "",
          role: member.role ?? "",
          description:
            member.description ?? "",
          website:
            member.website ?? "",
          github:
            member.github ?? "",
          sortOrder:
            member.sort_order ?? 1,
        }),
      ),
  };
}

export async function createCaseStudy(
  input: AdminCaseStudyInput,
): Promise<string> {
  const caseStudyId =
    createCaseStudyId(
      input.projectId,
    );

  const { data, error } = await supabase
    .from("case_studies")
    .insert({
      id: caseStudyId,
      project_id: input.projectId,
      project_type: input.projectType,
      work_mode: input.workMode,
      company: input.company.trim(),
      role: input.role.trim(),
      idea: input.idea.trim(),
      origin: input.origin.trim(),
      objective: input.objective.trim(),
      process: input.process.trim(),
      result: input.result.trim(),
      my_contribution:
        input.myContribution.trim(),
      visible: input.visible,
    })
    .select("id")
    .single();

  if (error) {
    console.error(
      "Error creando caso de estudio:",
      error,
    );

    throw error;
  }

  return data.id;
}

export async function updateCaseStudy(
  caseStudyId: string,
  input: AdminCaseStudyInput,
): Promise<void> {
  const { error } = await supabase
    .from("case_studies")
    .update({
      project_id: input.projectId,
      project_type: input.projectType,
      work_mode: input.workMode,
      company: input.company.trim(),
      role: input.role.trim(),
      idea: input.idea.trim(),
      origin: input.origin.trim(),
      objective: input.objective.trim(),
      process: input.process.trim(),
      result: input.result.trim(),
      my_contribution:
        input.myContribution.trim(),
      visible: input.visible,
    })
    .eq("id", caseStudyId);

  if (error) {
    console.error(
      "Error actualizando caso de estudio:",
      error,
    );

    throw error;
  }
}

export async function deleteCaseStudy(
  caseStudyId: string,
): Promise<void> {
  const { error } = await supabase
    .from("case_studies")
    .delete()
    .eq("id", caseStudyId);

  if (error) {
    throw error;
  }
}

export async function createProjectMember(
  caseStudyId: string,
  member: AdminProjectMemberInput,
): Promise<void> {
  const memberId =
    member.id ||
    createProjectMemberId();

  const { error } = await supabase
    .from("project_members")
    .insert({
      id: memberId,
      case_study_id: caseStudyId,
      name: member.name.trim(),
      role: member.role.trim(),
      description:
        member.description.trim(),
      website:
        member.website?.trim() || null,
      github:
        member.github?.trim() || null,
      sort_order: member.sortOrder,
    });

  if (error) {
    console.error(
      "Error creando integrante:",
      error,
    );

    throw error;
  }
}

export async function updateProjectMember(
  memberId: string,
  member: AdminProjectMemberInput,
): Promise<void> {
  const { error } = await supabase
    .from("project_members")
    .update({
      name: member.name.trim(),
      role: member.role.trim(),
      description:
        member.description.trim(),
      website:
        member.website?.trim() || null,
      github:
        member.github?.trim() || null,
      sort_order: member.sortOrder,
    })
    .eq("id", memberId);

  if (error) {
    console.error(
      "Error actualizando integrante:",
      error,
    );

    throw error;
  }
}

export async function deleteProjectMember(
  memberId: string,
): Promise<void> {
  const { error } = await supabase
    .from("project_members")
    .delete()
    .eq("id", memberId);

  if (error) {
    throw error;
  }
}

