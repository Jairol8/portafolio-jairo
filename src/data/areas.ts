import {
  Code2,
  Palette,
  TrendingUp,
} from "lucide-react";

import { React as ReactIcon } from "../components/Icons/React";
import { TypeScript as TypeScriptIcon } from "../components/Icons/TypeScript";
import { Vite as ViteIcon } from "../components/Icons/Vite";
import { Nodejs as NodejsIcon } from "../components/Icons/Nodejs";
import { Expressjs as ExpressjsIcon } from "../components/Icons/Expressjs";
import { PostgreSQL as PostgreSQLIcon } from "../components/Icons/PostgreSQL";
import { JavaScript as JavaScriptIcon } from "../components/Icons/JavaScript";
import { MongoDB as MongoDBIcon } from "../components/Icons/MongoDB";
import { JWT as JWTIcon } from "../components/Icons/JWT";
import { Vercel as VercelIcon } from "../components/Icons/Vercel";
import { GitHub as GitHubIcon } from "../components/Icons/GitHub";
import { HTML5 as HTMLIcon } from "../components/Icons/HTML5";
import { CSS as CSSIcon } from "../components/Icons/CSS3";
import { Php as PHPIcon } from "../components/Icons/PHP";
import { Python as PythonIcon } from "../components/Icons/Python";
import { SQL as SQLIcon } from "../components/Icons/SQL";
import { Illustrator as IllustratorIcon } from "../components/Icons/Illustrator";
import { Photoshop as PhotoshopIcon } from "../components/Icons/Photoshop";
import { Canva as CanvaIcon } from "../components/Icons/Canva";
import { Meta as MetaIcon } from "../components/Icons/Meta";
import { ClaudeAI as ClaudeIcon } from "../components/Icons/Claude";
import { Gemini as GeminiIcon } from "../components/Icons/Gemini";
import { Adobe as AdobeIcon } from "../components/Icons/Adobe";
import { GoogleAnalytics as GoogleAnalyticsIcon } from "../components/Icons/GoogleAnalytics";

import type {
  Area,
  AreaTool,
  IconComponent,
} from "../types/area";

function createTool(
  id: string,
  name: string,
  icon?: IconComponent,
  sortOrder = 1,
  website?: string,
): AreaTool {
  return {
    id,
    name,
    slug: id,
    icon,
    website,
    active: true,
    sortOrder,
  };
}

export const areas: Area[] = [
  {
    id: "programacion",
    number: "01",
    slug: "programacion",
    title: "Programación",
    subtitle: "Desarrollo web",
    description:
      "Desarrollo de aplicaciones y soluciones web combinando frontend, backend, bases de datos y herramientas modernas para construir productos digitales funcionales.",
    icon: Code2,
    color: "programming",
    visible: true,
    sortOrder: 1,
    link: "#proyectos",
    tools: [
      createTool(
        "javascript",
        "JavaScript",
        JavaScriptIcon,
        1,
      ),
      createTool(
        "typescript",
        "TypeScript",
        TypeScriptIcon,
        2,
      ),
      createTool(
        "react",
        "React",
        ReactIcon,
        3,
      ),
      createTool(
        "vite",
        "Vite",
        ViteIcon,
        4,
      ),
      createTool(
        "html5",
        "HTML5",
        HTMLIcon,
        5,
      ),
      createTool(
        "css3",
        "CSS3",
        CSSIcon,
        6,
      ),
      createTool(
        "nodejs",
        "Node.js",
        NodejsIcon,
        7,
      ),
      createTool(
        "express",
        "Express",
        ExpressjsIcon,
        8,
      ),
      createTool(
        "mongodb",
        "MongoDB",
        MongoDBIcon,
        9,
      ),
      createTool(
        "postgresql",
        "PostgreSQL",
        PostgreSQLIcon,
        10,
      ),
      createTool(
        "sql",
        "SQL",
        SQLIcon,
        11,
      ),
      createTool(
        "php",
        "PHP",
        PHPIcon,
        12,
      ),
      createTool(
        "laravel",
        "Laravel",
        undefined,
        13,
      ),
      createTool(
        "python",
        "Python",
        PythonIcon,
        14,
      ),
      createTool(
        "jwt",
        "JWT",
        JWTIcon,
        15,
      ),
      createTool(
        "git",
        "Git",
        undefined,
        16,
      ),
      createTool(
        "github",
        "GitHub",
        GitHubIcon,
        17,
        "https://github.com",
      ),
      createTool(
        "vercel",
        "Vercel",
        VercelIcon,
        18,
        "https://vercel.com",
      ),
    ],
  },

  {
    id: "diseno",
    number: "02",
    slug: "diseno",
    title: "Diseño",
    subtitle: "Diseño digital",
    description:
      "Creación de piezas visuales, contenido digital y experiencias gráficas enfocadas en comunicación, identidad, presentación y experiencia de usuario.",
    icon: Palette,
    color: "design",
    visible: true,
    sortOrder: 2,
    link: "#proyectos",
    tools: [
      createTool(
        "illustrator",
        "Illustrator",
        IllustratorIcon,
        1,
      ),
      createTool(
        "photoshop",
        "Photoshop",
        PhotoshopIcon,
        2,
      ),
      createTool(
        "maya",
        "Maya",
        undefined,
        3,
      ),
      createTool(
        "sketchup",
        "SketchUp",
        undefined,
        4,
      ),
      createTool(
        "canva",
        "Canva",
        CanvaIcon,
        5,
      ),
      createTool(
        "capcut",
        "CapCut",
        undefined,
        6,
      ),
    ],
  },

  {
    id: "marketing-digital",
    number: "03",
    slug: "marketing-digital",
    title: "Marketing Digital",
    subtitle: "Contenido y estrategia",
    description:
      "Planeación de contenido, creación de publicaciones, herramientas de inteligencia artificial y análisis de resultados para fortalecer la presencia digital.",
    icon: TrendingUp,
    color: "marketing",
    visible: true,
    sortOrder: 3,
    link: "#proyectos",
    tools: [
      createTool(
        "meta-business",
        "Meta Business",
        MetaIcon,
        1,
      ),
      createTool(
        "chatgpt",
        "ChatGPT",
        undefined,
        2,
      ),
      createTool(
        "claude",
        "Claude",
        ClaudeIcon,
        3,
      ),
      createTool(
        "gemini",
        "Gemini",
        GeminiIcon,
        4,
      ),
      createTool(
        "adobe-firefly",
        "Adobe Firefly",
        AdobeIcon,
        5,
      ),
      createTool(
        "google-analytics",
        "Google Analytics",
        GoogleAnalyticsIcon,
        6,
      ),
    ],
  },
];