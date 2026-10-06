import {
  FileText,
  Palette,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Meta as MetaIcon } from "../components/Icons/Meta";
import { Illustrator as IllustratorIcon } from "../components/Icons/Illustrator";
import { Photoshop as PhotoshopIcon } from "../components/Icons/Photoshop";

import type { Experience } from "../types/experience";

export const experiences: Experience[] = [
  {
    id: "nxt-it-todoparaoficina",

    period: "2026",

    company: "NXT.IT + TodoparaOficina",

    role: "Marketing Digital, Desarrollo Web y Contenido Digital",

    description:
      "Participación en la organización del departamento de marketing, creación de contenido digital, elaboración de calendarios editoriales, publicaciones para redes sociales y análisis de métricas mediante herramientas digitales.",

    tools: [
      {
        id: "marketing-digital",
        name: "Marketing Digital",
        icon: TrendingUp,
        active: true,
        sortOrder: 1,
      },
      {
        id: "contenido",
        name: "Contenido",
        icon: FileText,
        active: true,
        sortOrder: 2,
      },
      {
        id: "meta-business",
        name: "Meta Business",
        icon: MetaIcon,
        active: true,
        sortOrder: 3,
      },
      {
        id: "ia",
        name: "IA",
        icon: Sparkles,
        active: true,
        sortOrder: 4,
      },
    ],

    // Logo oficial pendiente.
    // Cuando tengas el SVG podremos agregar:
    // logoSvg: "<svg>...</svg>",

    color: "technology",

    visible: true,

    sortOrder: 1,
  },

  {
    id: "hypnos-media",

    period: "2024",

    company: "Hypnos Media",

    role: "Diseño Digital",

    description:
      "Participación en la creación de materiales visuales y contenido digital para diferentes proyectos y clientes, utilizando herramientas de diseño y composición gráfica.",

    tools: [
      {
        id: "diseno-digital",
        name: "Diseño Digital",
        icon: Palette,
        active: true,
        sortOrder: 1,
      },
      {
        id: "contenido-visual",
        name: "Contenido Visual",
        icon: FileText,
        active: true,
        sortOrder: 2,
      },
      {
        id: "illustrator",
        name: "Illustrator",
        icon: IllustratorIcon,
        active: true,
        sortOrder: 3,
      },
      {
        id: "photoshop",
        name: "Photoshop",
        icon: PhotoshopIcon,
        active: true,
        sortOrder: 4,
      },
    ],

    // Logo oficial pendiente.
    // Cuando tengas el SVG podremos agregar:
    // logoSvg: "<svg>...</svg>",

    color: "design",

    visible: true,

    sortOrder: 2,
  },
];