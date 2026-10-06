import type { ComponentType, SVGProps } from "react";

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export type AreaColor =
  | "programming"
  | "design"
  | "marketing";

export type AreaTool = {
  id: string;
  name: string;
  slug: string;
  icon?: IconComponent;
  iconSvg?: string;
  website?: string;
  active: boolean;
  sortOrder: number;
};

export type Area = {
  id: string;
  number: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  icon: IconComponent;
  iconSvg?: string;
  color: AreaColor;
  visible: boolean;
  sortOrder: number;
  link: string;
  tools: AreaTool[];
};