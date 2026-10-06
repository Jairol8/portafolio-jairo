import {
  ArrowUpRight,
  ExternalLink,
  Code2,
  Check,
  Users,
  BriefcaseBusiness,
  UserRound,
  BarChart3,
  LockKeyhole,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  useEffect,
  useState,
} from "react";

import { GitHub as GitHubIcon } from "../Icons/GitHub";

import { React as ReactIcon } from "../Icons/React";
import { Vite as ViteIcon } from "../Icons/Vite";
import { Supabase as SupabaseIcon } from "../Icons/Supabase";
import { JavaScript as JavaScriptIcon } from "../Icons/JavaScript";
import { Vercel as VercelIcon } from "../Icons/Vercel";
import { MongoDB as MongoDBIcon } from "../Icons/MongoDB";
import { Expressjs as ExpressIcon } from "../Icons/Expressjs";
import { JWT as JWTIcon } from "../Icons/JWT";
import { Meta as MetaIcon } from "../Icons/Meta";
import { GoogleAnalytics as GoogleAnalyticsIcon } from "../Icons/GoogleAnalytics";
import { Gemini as GeminiIcon } from "../Icons/Gemini";
import { ClaudeAI as ClaudeIcon } from "../Icons/Claude";
import { HTML5 as HTMLIcon } from "../Icons/HTML5";
import { CSS as CSSIcon } from "../Icons/CSS3";
import { Illustrator as IllustratorIcon } from "../Icons/Illustrator";
import { Photoshop as PhotoshopIcon } from "../Icons/Photoshop";
import { Canva as CanvaIcon } from "../Icons/Canva";

import { getProjects } from "../../services/projects";

import type {
  Project,
  ProjectType,
} from "../../types/project";
import type { Technology } from "../../types/technology";

import "./Projects.css";

type SupabaseProjectTechnology = {
  technology:
    | Technology
    | null;
};

type SupabaseProject = {
  id: string;
  number: string;
  category: string;
  title: string;
  description: string;
  status: Project["status"];
  color: Project["color"];
  progress: number;
  project_type: ProjectType;
  demo: string | null;
  github: string | null;
  github_public: boolean;
  case_study: boolean;
  visible: boolean;
  featured: boolean;
  sort_order: number;
  project_technologies:
    | SupabaseProjectTechnology[]
    | null;
  project_languages:
    | SupabaseProjectTechnology[]
    | null;
};

function TechnologyLogo({
  technology,
}: {
  technology: Technology;
}) {
  const iconMap: Record<
    string,
    React.ComponentType<{
      width?: number;
      height?: number;
      "aria-hidden"?: boolean;
    }>
  > = {
    React: ReactIcon,
    Vite: ViteIcon,
    Supabase: SupabaseIcon,
    JavaScript: JavaScriptIcon,
    Vercel: VercelIcon,
    MongoDB: MongoDBIcon,
    Express: ExpressIcon,
    Expressjs: ExpressIcon,
    JWT: JWTIcon,
    Meta: MetaIcon,
    "Meta Business": MetaIcon,
    "Google Analytics":
      GoogleAnalyticsIcon,
    Gemini: GeminiIcon,
    Claude: ClaudeIcon,
    "Claude AI": ClaudeIcon,
    HTML: HTMLIcon,
    HTML5: HTMLIcon,
    CSS: CSSIcon,
    Illustrator: IllustratorIcon,
    Photoshop: PhotoshopIcon,
    Canva: CanvaIcon,
  };

  const Icon = iconMap[technology.name];

  if (Icon) {
    return (
      <Icon
        width={18}
        height={18}
        aria-hidden={true}
      />
    );
  }

  if (technology.iconSvg) {
    return (
      <span
        className="project__technology-svg"
        dangerouslySetInnerHTML={{
          __html: technology.iconSvg,
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <span className="project__technology-fallback">
      {technology.name
        .charAt(0)
        .toUpperCase()}
    </span>
  );
}

function ProjectTypeIcon({
  type,
}: {
  type: ProjectType;
}) {
  if (type === "team") {
    return (
      <Users
        size={15}
        strokeWidth={1.8}
      />
    );
  }

  if (type === "company") {
    return (
      <BriefcaseBusiness
        size={15}
        strokeWidth={1.8}
      />
    );
  }

  return (
    <UserRound
      size={15}
      strokeWidth={1.8}
    />
  );
}

function getProjectTypeLabel(
  type: ProjectType,
) {
  if (type === "team") {
    return "Equipo";
  }

  if (type === "company") {
    return "Empresa";
  }

  return "Individual";
}

function mapSupabaseProject(
  project: SupabaseProject,
): Project {
  const technologies =
    (
      project.project_technologies ??
      []
    )
      .map(
        (item) =>
          item.technology,
      )
      .filter(
        (
          technology,
        ): technology is Technology =>
          Boolean(technology),
      );

  const languages =
    (
      project.project_languages ??
      []
    )
      .map(
        (item) =>
          item.technology,
      )
      .filter(
        (
          technology,
        ): technology is Technology =>
          Boolean(technology),
      );

  return {
    id: project.id,
    number: project.number,
    category: project.category,
    title: project.title,
    description:
      project.description,
    technologies,
    languages,
    status: project.status,
    color: project.color,
    progress: project.progress,
    projectType:
      project.project_type,
    demo: project.demo ?? "",
    github:
      project.github ?? "",
    githubPublic:
      project.github_public,
    caseStudy:
      project.case_study,
    visible: project.visible,
    featured:
      project.featured,
    sortOrder:
      project.sort_order,
  };
}

function ProjectCard({
  project,
}: {
  project: Project;
}) {
  const progress = Math.min(
    Math.max(project.progress, 0),
    100,
  );

  return (
    <article
      className={`project project--${project.color}`}
    >
      <div className="project__glow" />

      <div className="project__number">
        {project.number}
      </div>

      <div className="project__main">
        <div className="project__meta">
          <span className="project__category">
            {project.category}
          </span>

          <span className="project__status">
            <span className="project__status-dot" />
            {project.status}
          </span>

          <span className="project__type">
            <ProjectTypeIcon
              type={project.projectType}
            />

            {getProjectTypeLabel(
              project.projectType,
            )}
          </span>
        </div>

        <h3>{project.title}</h3>

        <p className="project__description">
          {project.description}
        </p>

        {project.status !==
          "Completado" && (
          <div className="project__progress">
            <div className="project__progress-header">
              <span>
                Progreso
              </span>

              <strong>
                {progress}%
              </strong>
            </div>

            <div className="project__progress-track">
              <div
                className="project__progress-bar"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        )}

        {project.technologies.length >
          0 && (
          <div className="project__technologies">
            <span className="project__technologies-label">
              Tecnologías
            </span>

            <div className="project__technology-list">
              {project.technologies.map(
                (technology) => (
                  <span
                    className="project__technology"
                    key={technology.id}
                  >
                    <TechnologyLogo
                      technology={
                        technology
                      }
                    />

                    <span>
                      {technology.name}
                    </span>
                  </span>
                ),
              )}
            </div>
          </div>
        )}

        {project.languages.length >
          0 && (
          <div className="project__technologies">
            <span className="project__technologies-label">
              Lenguajes y web
            </span>

            <div className="project__technology-list">
              {project.languages.map(
                (language) => (
                  <span
                    className="project__technology"
                    key={language.id}
                  >
                    <TechnologyLogo
                      technology={
                        language
                      }
                    />

                    <span>
                      {language.name}
                    </span>
                  </span>
                ),
              )}
            </div>
          </div>
        )}
      </div>

      <div className="project__actions">
        {project.demo ? (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="project__action project__action--primary"
            aria-label={`Ver ${project.title}`}
          >
            <ExternalLink
              size={17}
              strokeWidth={1.8}
            />

            <span>
              Ver proyecto
            </span>
          </a>
        ) : (
          <span
            className="project__action project__action--disabled"
            aria-disabled="true"
          >
            <ExternalLink
              size={17}
              strokeWidth={1.8}
            />

            <span>
              {project.status ===
              "En desarrollo"
                ? "En desarrollo"
                : project.status ===
                  "En pausa"
                ? "En pausa"
                : "Próximamente"}
            </span>
          </span>
        )}

        {project.caseStudy && (
          <Link
            to={`/proyectos/${project.id}`}
            className="project__action project__action--case"
            aria-label={`Ver caso de ${project.title}`}
          >
            <BarChart3
              size={17}
              strokeWidth={1.8}
            />

            <span>
              Ver caso
            </span>
          </Link>
        )}

        {project.githubPublic &&
        project.github ? (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="project__action project__action--github"
            aria-label={`GitHub de ${project.title}`}
          >
            <GitHubIcon
              width={17}
              height={17}
              aria-hidden={true}
            />

            <span>
              GitHub
            </span>
          </a>
        ) : !project.githubPublic ? (
          <span
            className="project__action project__action--disabled"
            aria-disabled="true"
            title="El repositorio de este proyecto es privado"
          >
            <LockKeyhole
              size={16}
              strokeWidth={1.8}
            />

            <span>
              GitHub privado
            </span>
          </span>
        ) : null}
      </div>
    </article>
  );
}

export default function Projects() {
  const [projects, setProjects] =
    useState<Project[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      try {
        setLoading(true);
        setError(null);

        const data =
          await getProjects();

        if (!active) {
          return;
        }

        const mapped =
          (
            data as SupabaseProject[]
          ).map(
            mapSupabaseProject,
          );

        setProjects(mapped);
      } catch (err) {
        if (!active) {
          return;
        }

        console.error(
          "Error cargando proyectos:",
          err,
        );

        setError(
          "No fue posible cargar los proyectos.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      active = false;
    };
  }, []);

  const visibleProjects =
    projects
      .filter(
        (project) =>
          project.visible,
      )
      .sort(
        (a, b) =>
          a.sortOrder -
          b.sortOrder,
      );

  const completedProjects =
    visibleProjects.filter(
      (project) =>
        project.status ===
        "Completado",
    );

  const developmentProjects =
    visibleProjects.filter(
      (project) =>
        project.status ===
        "En desarrollo",
    );

  const pausedProjects =
    visibleProjects.filter(
      (project) =>
        project.status ===
        "En pausa",
    );

  const upcomingProjects =
    visibleProjects.filter(
      (project) =>
        project.status ===
        "Próximamente",
    );

  if (loading) {
    return (
      <main className="projects">
        <div className="projects__loading">
          <span className="projects__loading-dot" />

          <span>
            Cargando proyectos...
          </span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="projects">
        <div className="projects__error">
          <span>
            01 / ERROR
          </span>

          <h1>
            No se pudieron cargar
            los proyectos.
          </h1>

          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="projects">
      <section className="projects__hero">
        <div className="projects__hero-inner">
          <div className="projects__eyebrow">
            PORTAFOLIO / PROYECTOS
          </div>

          <div className="projects__hero-content">
            <div>
              <h1>
                Proyectos que
                convierten ideas
                en experiencias
                digitales.
              </h1>
            </div>

            <div className="projects__hero-copy">
              <p>
                Una selección de
                proyectos de
                desarrollo, diseño y
                marketing digital,
                desde productos
                personales hasta
                soluciones
                desarrolladas para
                organizaciones y
                clientes.
              </p>

              <div className="projects__hero-stats">
                <span>
                  <strong>
                    {
                      visibleProjects.length
                    }
                  </strong>

                  proyectos visibles
                </span>

                <span>
                  <strong>
                    {
                      completedProjects.length
                    }
                  </strong>

                  completados
                </span>

                <span>
                  <strong>
                    {
                      developmentProjects.length
                    }
                  </strong>

                  en desarrollo
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {completedProjects.length >
        0 && (
        <section className="projects__section">
          <div className="projects__section-header">
            <div>
              <span className="projects__section-number">
                01 / COMPLETADOS
              </span>

              <h2>
                Proyectos terminados
                y listos para
                explorar.
              </h2>
            </div>

            <Check
              size={24}
              strokeWidth={1.6}
            />
          </div>

          <div className="projects__list">
            {completedProjects.map(
              (project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                />
              ),
            )}
          </div>
        </section>
      )}

      {developmentProjects.length >
        0 && (
        <section className="projects__section projects__section--development">
          <div className="projects__section-header">
            <div>
              <span className="projects__section-number">
                02 / EN DESARROLLO
              </span>

              <h2>
                Proyectos que siguen
                evolucionando.
              </h2>
            </div>

            <Code2
              size={24}
              strokeWidth={1.6}
            />
          </div>

          <div className="projects__list">
            {developmentProjects.map(
              (project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                />
              ),
            )}
          </div>
        </section>
      )}

      {pausedProjects.length >
        0 && (
        <section className="projects__section projects__section--paused">
          <div className="projects__section-header">
            <div>
              <span className="projects__section-number">
                03 / EN PAUSA
              </span>

              <h2>
                Proyectos
                temporalmente
                pausados.
              </h2>
            </div>

            <LockKeyhole
              size={24}
              strokeWidth={1.6}
            />
          </div>

          <div className="projects__list">
            {pausedProjects.map(
              (project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                />
              ),
            )}
          </div>
        </section>
      )}

      {upcomingProjects.length >
        0 && (
        <section className="projects__section projects__section--upcoming">
          <div className="projects__section-header">
            <div>
              <span className="projects__section-number">
                04 / PRÓXIMAMENTE
              </span>

              <h2>
                Proyectos que están
                por comenzar.
              </h2>
            </div>

            <ArrowUpRight
              size={24}
              strokeWidth={1.6}
            />
          </div>

          <div className="projects__list">
            {upcomingProjects.map(
              (project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                />
              ),
            )}
          </div>
        </section>
      )}

      {visibleProjects.length ===
        0 && (
        <section className="projects__empty">
          <Code2
            size={30}
            strokeWidth={1.5}
          />

          <h2>
            Todavía no hay proyectos
            publicados.
          </h2>

          <p>
            Los proyectos visibles
            aparecerán aquí.
          </p>
        </section>
      )}

      <section className="projects__bottom">
        <div>
          <span>
            MÁS SOBRE MI TRABAJO
          </span>

          <h2>
            Cada proyecto tiene
            una historia detrás.
          </h2>
        </div>

        <Link
          to="/experiencia"
          className="projects__bottom-link"
        >
          <span>
            Ver experiencia
          </span>

          <ArrowUpRight
            size={18}
            strokeWidth={1.8}
          />
        </Link>
      </section>
    </main>
  );
}