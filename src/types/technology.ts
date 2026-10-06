import type {
  ComponentType,
  SVGProps,
} from "react";

export type TechnologyIcon =
  ComponentType<SVGProps<SVGSVGElement>>;

export type Technology = {
  id: string;

  name: string;

  slug: string;

  icon?: TechnologyIcon;

  iconSvg?: string;

  website?: string;

  active: boolean;
};