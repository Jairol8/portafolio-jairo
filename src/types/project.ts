import type { Technology } from "./technology";

export type ProjectType =
  | "individual"
  | "team"
  | "company";

export type ProjectColor =
  | "programming"
  | "design"
  | "marketing";

export type ProjectStatus =
  | "Completado"
  | "En desarrollo"
  | "En pausa"
  | "Próximamente";

export type Project = {
  id: string;

  number: string;

  category: string;

  title: string;

  description: string;

  technologies: Technology[];

  languages: Technology[];

  status: ProjectStatus;

  color: ProjectColor;

  progress: number;

  projectType: ProjectType;

  demo: string;

  github: string;

  githubPublic: boolean;

  caseStudy: boolean;

  visible: boolean;

  featured: boolean;

  sortOrder: number;
};