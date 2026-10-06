export type EducationStatus =
  | "En curso"
  | "Completado";

export type EducationItem = {
  id: string;
  period: string;
  institution: string;
  degree: string;
  description: string;
  status: EducationStatus;
  logoSvg?: string;
  website?: string;
  visible: boolean;
  sortOrder: number;
};