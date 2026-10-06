import { React as ReactIcon } from "../components/Icons/React";
import { Vite as ViteIcon } from "../components/Icons/Vite";
import { Meta as MetaIcon } from "../components/Icons/Meta";
import { GoogleAnalytics as GoogleAnalyticsIcon } from "../components/Icons/GoogleAnalytics";
import { Supabase as SupabaseIcon } from "../components/Icons/Supabase";
import { JavaScript as JavaScriptIcon } from "../components/Icons/JavaScript";
import { Vercel as VercelIcon } from "../components/Icons/Vercel";
import { MongoDB as MongoDBIcon } from "../components/Icons/MongoDB";
import { Expressjs as ExpressIcon } from "../components/Icons/Expressjs";
import { JWT as JWTIcon } from "../components/Icons/JWT";
import { Gemini as GeminiIcon } from "../components/Icons/Gemini";
import { ClaudeAI as ClaudeIcon } from "../components/Icons/Claude";

import { CSS as CSSIcon } from "../components/Icons/CSS3";
import { HTML5 as HTMLIcon } from "../components/Icons/HTML5";
import { Python as PythonIcon } from "../components/Icons/Python";
import { SQL as SQLIcon } from "../components/Icons/SQL";

import type { Project } from "../types/project";
import type { Technology } from "../types/technology";

/* =========================================================
   CATÁLOGO TEMPORAL DE TECNOLOGÍAS
   ========================================================= */

const technologyCatalog: Record<string, Technology> = {
  React: {
    id: "react",
    name: "React",
    slug: "react",
    icon: ReactIcon,
    website: "https://react.dev",
    active: true,
  },

  Vite: {
    id: "vite",
    name: "Vite",
    slug: "vite",
    icon: ViteIcon,
    website: "https://vite.dev",
    active: true,
  },

  Supabase: {
    id: "supabase",
    name: "Supabase",
    slug: "supabase",
    icon: SupabaseIcon,
    website: "https://supabase.com",
    active: true,
  },

  JavaScript: {
    id: "javascript",
    name: "JavaScript",
    slug: "javascript",
    icon: JavaScriptIcon,
    website:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    active: true,
  },

  Vercel: {
    id: "vercel",
    name: "Vercel",
    slug: "vercel",
    icon: VercelIcon,
    website: "https://vercel.com",
    active: true,
  },

  MongoDB: {
    id: "mongodb",
    name: "MongoDB",
    slug: "mongodb",
    icon: MongoDBIcon,
    website: "https://www.mongodb.com",
    active: true,
  },

  Express: {
    id: "express",
    name: "Express",
    slug: "express",
    icon: ExpressIcon,
    website: "https://expressjs.com",
    active: true,
  },

  JWT: {
    id: "jwt",
    name: "JWT",
    slug: "jwt",
    icon: JWTIcon,
    website: "https://jwt.io",
    active: true,
  },

  "Meta Business": {
    id: "meta-business",
    name: "Meta Business",
    slug: "meta-business",
    icon: MetaIcon,
    website: "https://business.facebook.com",
    active: true,
  },

  Analytics: {
    id: "analytics",
    name: "Google Analytics",
    slug: "google-analytics",
    icon: GoogleAnalyticsIcon,
    website: "https://analytics.google.com",
    active: true,
  },

  Gemini: {
    id: "gemini",
    name: "Gemini",
    slug: "gemini",
    icon: GeminiIcon,
    website: "https://gemini.google.com",
    active: true,
  },

  Claude: {
    id: "claude",
    name: "Claude",
    slug: "claude",
    icon: ClaudeIcon,
    website: "https://claude.ai",
    active: true,
  },

  HTML: {
    id: "html",
    name: "HTML",
    slug: "html",
    icon: HTMLIcon,
    website:
      "https://developer.mozilla.org/en-US/docs/Web/HTML",
    active: true,
  },

  CSS: {
    id: "css",
    name: "CSS",
    slug: "css",
    icon: CSSIcon,
    website:
      "https://developer.mozilla.org/en-US/docs/Web/CSS",
    active: true,
  },

  Python: {
    id: "python",
    name: "Python",
    slug: "python",
    icon: PythonIcon,
    website: "https://www.python.org",
    active: true,
  },

  SQL: {
    id: "sql",
    name: "SQL",
    slug: "sql",
    icon: SQLIcon,
    website: undefined,
    active: true,
  },
};

/* =========================================================
   HELPER
   ========================================================= */

function getTechnology(name: string): Technology {
  return (
    technologyCatalog[name] ?? {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      active: true,
    }
  );
}

/* =========================================================
   PROYECTOS
   ========================================================= */

export const projects: Project[] = [
  {
    id: "rosas-amarillas",
    number: "01",
    category: "PROGRAMACIÓN",
    title: "Rosas Amarillas",

    description:
      "Aplicación web interactiva para crear y compartir una experiencia digital personalizada mediante un enlace público.",

    technologies: [
      getTechnology("React"),
      getTechnology("Vite"),
      getTechnology("Supabase"),
    ],

    languages: [
      getTechnology("JavaScript"),
      getTechnology("HTML"),
      getTechnology("CSS"),
    ],

    status: "Completado",
    color: "programming",
    progress: 100,
    projectType: "individual",

    github:
      "https://github.com/Jairol8/rosas-amarillas",

    githubPublic: true,

    demo:
      "https://rosas-amarillas-three.vercel.app/",

    caseStudy: true,
    visible: true,
    featured: true,
    sortOrder: 1,
  },

  {
    id: "nutrin",
    number: "02",
    category: "PROGRAMACIÓN",
    title: "Nutrin",

    description:
      "Proyecto web desarrollado en equipo, enfocado en una experiencia digital relacionada con perfiles, planes y funcionalidades personalizadas.",

    technologies: [
      getTechnology("React"),
      getTechnology("Vite"),
      getTechnology("Vercel"),
      getTechnology("Gemini"),
    ],

    languages: [
      getTechnology("JavaScript"),
      getTechnology("HTML"),
      getTechnology("CSS"),
    ],

    status: "Completado",
    color: "programming",
    progress: 100,
    projectType: "team",

    github: "",
    githubPublic: false,

    demo:
      "https://www.nutrin.online/LandingPage",

    caseStudy: true,
    visible: true,
    featured: true,
    sortOrder: 2,
  },

  {
    id: "nxtit-todoparaoficina",
    number: "03",
    category: "MARKETING DIGITAL",
    title: "NXT.IT + TodoparaOficina",

    description:
      "Proyecto de marketing digital enfocado en creación de contenido visual, planeación de publicaciones y desarrollo de calendarios editoriales.",

    technologies: [
      getTechnology("Meta Business"),
      getTechnology("Analytics"),
      getTechnology("Gemini"),
      getTechnology("Claude"),
    ],

    languages: [],

    status: "Completado",
    color: "marketing",
    progress: 100,
    projectType: "company",

    github: "",
    githubPublic: false,

    demo: "",

    caseStudy: true,
    visible: true,
    featured: true,
    sortOrder: 3,
  },

  {
    id: "sistema-abonos",
    number: "04",
    category: "PROGRAMACIÓN",
    title: "Sistema de abonos",

    description:
      "Sistema web para gestionar clientes, pagos y abonos con diferentes roles de usuario y autenticación.",

    technologies: [
      getTechnology("React"),
      getTechnology("Express"),
      getTechnology("MongoDB"),
      getTechnology("JWT"),
    ],

    languages: [
      getTechnology("JavaScript"),
      getTechnology("HTML"),
      getTechnology("CSS"),
    ],

    status: "En desarrollo",
    color: "programming",
    progress: 60,
    projectType: "individual",

    github: "",
    githubPublic: false,

    demo: "",

    caseStudy: true,
    visible: true,
    featured: false,
    sortOrder: 4,
  },
];

