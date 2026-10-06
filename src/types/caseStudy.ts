export type ProjectMember = {
  id: string;

  name: string;

  role: string;

  description: string;

  website?: string;

  github?: string;

  sortOrder: number;
};

export type ProjectCaseStudy = {
  id: string;

  projectId: string;

  idea: string;

  origin: string;

  objective: string;

  process: string;

  result: string;

  myContribution: string;

  members: ProjectMember[];

  visible: boolean;
};