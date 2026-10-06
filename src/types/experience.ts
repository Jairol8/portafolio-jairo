import type { ComponentType, SVGProps } from "react";

export type ExperienceColor =
  | "technology"
  | "design"
  | "marketing";

export type ExperienceTool = {
  id: string;
  name: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  iconSvg?: string;
  website?: string;
  active: boolean;
  sortOrder: number;
};

export type Experience = {
  id: string;

  period: string;

  company: string;

  role: string;

  description: string;

  tools: ExperienceTool[];

  logoSvg?: string;

  color: ExperienceColor;

  visible: boolean;

  sortOrder: number;
};