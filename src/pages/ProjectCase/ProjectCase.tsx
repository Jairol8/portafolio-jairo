import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  CircleDashed,
  Code2,
  ExternalLink,
  Layers3,
  Sparkles,
  Users,
} from "lucide-react";



import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import { GitHub as GitHubIcon } from "../../components/Icons/GitHub";

import ProjectFeedback from "../../components/ProjectFeedback/ProjectFeedback";

import { supabase } from "../../lib/supabase";

import "./ProjectCase.css";

type ProjectStatus =
  | "Completado"
  | "En desarrollo"
  | "En pausa"
  | "Próximamente";

type ProjectColor =
  | "programming"
  | "design"
  | "marketing";

type Technology = {
  id: string;
  name: string;
  iconSvg: string;
};

type Project = {
  id: string;
  number: string;
  title: string;
  description: string;
  category: string;
  status: ProjectStatus;
  progress: number;
  color: ProjectColor;
  demo: string;
  github: string;
  githubPublic: boolean;
  projectType: "individual" | "team" | "company";
  technologies: Technology[];
  languages: Technology[];
};

type CaseMember = {
  id: string;
  name: string;
  role: string;
  description: string;
  website: string;
  github: string;
  sortOrder: number;
};

type CaseStudy = {
  id: string;
  projectId: string;
  projectType:
    | "personal"
    | "academic"
    | "client"
    | "company";
  workMode:
    | "individual"
    | "team";
  company: string;
  role: string;
  idea: string;
  origin: string;
  objective: string;
  process: string;
  result: string;
  myContribution: string;
  visible: boolean;
  members: CaseMember[];
};

function getStatusIcon(status: ProjectStatus) {
  if (status === "Completado") {
    return <CheckCircle2 size={14} />;
  }

  return <CircleDashed size={14} />;
}

function getStatusText(status: ProjectStatus) {
  switch (status) {
    case "Completado":
      return "Proyecto completado";

    case "En desarrollo":
      return "Actualmente en desarrollo";

    case "En pausa":
      return "Proyecto en pausa";

    case "Próximamente":
      return "Próximamente";

    default:
      return status;
  }
}

function getColorClass(color: ProjectColor) {
  return `project-case--${color}`;
}

function normalizeStatus(
  status: string | null,
): ProjectStatus {
  if (
    status === "En desarrollo" ||
    status === "En pausa" ||
    status === "Próximamente"
  ) {
    return status;
  }

  return "Completado";
}

function normalizeColor(
  color: string | null,
): ProjectColor {
  if (
    color === "design" ||
    color === "marketing"
  ) {
    return color;
  }

  return "programming";
}

function normalizeProjectType(
  projectType: string | null,
): "individual" | "team" | "company" {
  if (
    projectType === "team" ||
    projectType === "company"
  ) {
    return projectType;
  }

  return "individual";
}

function TechnologyItem({
  name,
  iconSvg,
}: {
  name: string;
  iconSvg?: string;
}) {
  return (
    <span className="project-case__technology">
      {iconSvg ? (
        <span
          className="project-case__technology-svg"
          dangerouslySetInnerHTML={{
            __html: iconSvg,
          }}
        />
      ) : (
        <Code2
          size={16}
          aria-hidden="true"
        />
      )}

      <span>{name}</span>
    </span>
  );
}

async function loadProject(
  projectId: string,
): Promise<Project | null> {
  const {
    data: projectData,
    error: projectError,
  } = await supabase
    .from("projects")
    .select(`
      id,
      number,
      title,
      description,
      category,
      status,
      progress,
      color,
      demo,
      github,
      github_public,
      project_type
    `)
    .eq("id", projectId)
    .eq("visible", true)
    .maybeSingle();

  if (projectError) {
    throw projectError;
  }

  if (!projectData) {
    return null;
  }

  const [
    technologiesResult,
    languagesResult,
  ] = await Promise.all([
    supabase
      .from("project_technologies")
      .select("technology_id")
      .eq("project_id", projectId),

    supabase
      .from("project_languages")
      .select("technology_id")
      .eq("project_id", projectId),
  ]);

  if (technologiesResult.error) {
    throw technologiesResult.error;
  }

  if (languagesResult.error) {
    throw languagesResult.error;
  }

  const technologyIds = (
    technologiesResult.data ?? []
  )
    .map(
      (item) => item.technology_id,
    )
    .filter(Boolean);

  const languageIds = (
    languagesResult.data ?? []
  )
    .map(
      (item) => item.technology_id,
    )
    .filter(Boolean);

  const allTechnologyIds = [
    ...new Set([
      ...technologyIds,
      ...languageIds,
    ]),
  ];

  let technologyData: Technology[] = [];

  if (allTechnologyIds.length > 0) {
    const {
      data,
      error,
    } = await supabase
      .from("technologies")
      .select(
        "id, name, icon_svg",
      )
      .in(
        "id",
        allTechnologyIds,
      )
      .eq("active", true);

    if (error) {
      throw error;
    }

    technologyData = (
      data ?? []
    ).map((technology) => ({
      id: technology.id,
      name: technology.name,
      iconSvg:
        technology.icon_svg ?? "",
    }));
  }

  const technologyMap =
    new Map(
      technologyData.map(
        (technology) => [
          technology.id,
          technology,
        ],
      ),
    );

  const technologies =
    technologyIds
      .map(
        (id) =>
          technologyMap.get(id),
      )
      .filter(
        (
          technology,
        ): technology is Technology =>
          Boolean(technology),
      );

  const languages =
    languageIds
      .map(
        (id) =>
          technologyMap.get(id),
      )
      .filter(
        (
          technology,
        ): technology is Technology =>
          Boolean(technology),
      );

  return {
    id: projectData.id,
    number: String(
      projectData.number ?? "",
    ),
    title: projectData.title ?? "",
    description:
      projectData.description ?? "",
    category:
      projectData.category ?? "",
    status: normalizeStatus(
      projectData.status,
    ),
    progress:
      Number(
        projectData.progress ?? 0,
      ),
    color: normalizeColor(
      projectData.color,
    ),
    demo:
      projectData.demo ?? "",
    github:
      projectData.github ?? "",
    githubPublic:
      Boolean(
        projectData.github_public,
      ),
    projectType:
      normalizeProjectType(
        projectData.project_type,
      ),
    technologies,
    languages,
  };
}

async function loadCaseStudy(
  projectId: string,
): Promise<CaseStudy | null> {
  const {
    data: caseData,
    error: caseError,
  } = await supabase
    .from("case_studies")
    .select(`
      id,
      project_id,
      project_type,
      work_mode,
      company,
      role,
      idea,
      origin,
      objective,
      process,
      result,
      my_contribution,
      visible
    `)
    .eq("project_id", projectId)
    .eq("visible", true)
    .maybeSingle();

  if (caseError) {
    throw caseError;
  }

  if (!caseData) {
    return null;
  }

  const {
    data: membersData,
    error: membersError,
  } = await supabase
    .from("project_members")
    .select(`
      id,
      name,
      role,
      description,
      website,
      github,
      sort_order
    `)
    .eq(
      "case_study_id",
      caseData.id,
    )
    .order("sort_order", {
      ascending: true,
    });

  if (membersError) {
    throw membersError;
  }

  return {
    id: caseData.id,
    projectId:
      caseData.project_id,
    projectType:
      caseData.project_type ===
        "academic" ||
      caseData.project_type ===
        "client" ||
      caseData.project_type ===
        "company"
        ? caseData.project_type
        : "personal",
    workMode:
      caseData.work_mode ===
        "team"
        ? "team"
        : "individual",
    company:
      caseData.company ?? "",
    role:
      caseData.role ?? "",
    idea:
      caseData.idea ?? "",
    origin:
      caseData.origin ?? "",
    objective:
      caseData.objective ?? "",
    process:
      caseData.process ?? "",
    result:
      caseData.result ?? "",
    myContribution:
      caseData.my_contribution ??
      "",
    visible:
      caseData.visible ?? true,
    members:
      (
        membersData ?? []
      ).map((member) => ({
        id: member.id,
        name:
          member.name ?? "",
        role:
          member.role ?? "",
        description:
          member.description ??
          "",
        website:
          member.website ?? "",
        github:
          member.github ?? "",
        sortOrder:
          member.sort_order ?? 1,
      })),
  };
}

function ProjectCase() {
  const { projectId } =
    useParams();

  const [project, setProject] =
    useState<Project | null>(null);

  const [
    caseStudy,
    setCaseStudy,
  ] = useState<CaseStudy | null>(
    null,
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      if (!projectId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [
          projectResult,
          caseResult,
        ] = await Promise.all([
          loadProject(projectId),
          loadCaseStudy(projectId),
        ]);

        if (cancelled) {
          return;
        }

        setProject(
          projectResult,
        );

        setCaseStudy(
          caseResult,
        );
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "Error cargando proyecto:",
          err,
        );

        setError(
          "No fue posible cargar la información del proyecto.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  if (loading) {
    return (
      <main className="project-case project-case--not-found">
        <div className="project-case__container">
          <span>
            PROYECTO
          </span>

          <h1>
            Cargando
            <br />
            proyecto...
          </h1>

          <p>
            Estamos recuperando la
            información desde la base
            de datos.
          </p>

          <Link
            to="/"
            className="project-case__back"
          >
            <ArrowLeft size={17} />
            Volver al portafolio
          </Link>
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="project-case project-case--not-found">
        <div className="project-case__container">
          <span>
            PROYECTO / 404
          </span>

          <h1>
            Proyecto
            <br />
            no encontrado.
          </h1>

          <p>
            {error ??
              "El proyecto que estás buscando no existe, fue eliminado o ya no se encuentra disponible dentro del portafolio."}
          </p>

          <Link
            to="/"
            className="project-case__back"
          >
            <ArrowLeft size={17} />
            Volver al portafolio
          </Link>
        </div>
      </main>
    );
  }

  const hasDemo =
    Boolean(project.demo);

  const hasPublicGithub =
    Boolean(project.github) &&
    project.githubPublic;

  const isInProgress =
    project.status !==
    "Completado";

  return (
    <main
      className={`project-case ${getColorClass(
        project.color,
      )}`}
    >
      <div className="project-case__container">
        <Link
          to="/"
          className="project-case__back"
        >
          <ArrowLeft size={17} />
          Volver al portafolio
        </Link>

        <header className="project-case__header">
          <div
            className="project-case__hero-number"
            aria-hidden="true"
          >
            {project.number}
          </div>

          <div className="project-case__hero-top">
            <div className="project-case__meta">
              <span>
                {project.number}
              </span>

              <span>
                {project.category}
              </span>

              <span>
                {project.projectType ===
                "individual"
                  ? "Proyecto individual"
                  : project.projectType ===
                      "team"
                    ? "Proyecto en equipo"
                    : "Proyecto empresarial"}
              </span>
            </div>

            <div className="project-case__status">
              {getStatusIcon(
                project.status,
              )}

              <span>
                {getStatusText(
                  project.status,
                )}
              </span>
            </div>
          </div>

          <div className="project-case__hero-content">
            <span className="project-case__eyebrow">
              CASO DE ESTUDIO
            </span>

            <h1>
              {project.title}
            </h1>

            <p className="project-case__description">
              {project.description}
            </p>

            <div className="project-case__actions">
              {hasDemo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-case__button project-case__button--primary"
                >
                  <ExternalLink
                    size={17}
                  />

                  <span>
                    Ver proyecto
                  </span>

                  <ArrowUpRight
                    size={15}
                  />
                </a>
              )}

              {hasPublicGithub && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-case__button"
                >
                  <GitHubIcon
                    width={17}
                    height={17}
                  />

                  <span>
                    Ver código
                  </span>

                  <ArrowUpRight
                    size={15}
                  />
                </a>
              )}

              {!hasDemo &&
                !hasPublicGithub && (
                  <span className="project-case__button project-case__button--disabled">
                    <Layers3
                      size={17}
                    />

                    <span>
                      Información del proyecto
                    </span>
                  </span>
                )}
            </div>
          </div>

          <div className="project-case__hero-corner">
            <Sparkles
              size={18}
            />
          </div>
        </header>

        {isInProgress && (
          <section className="project-case__progress">
            <div className="project-case__progress-info">
              <span>
                ESTADO DEL DESARROLLO
              </span>

              <strong>
                {project.status}
              </strong>
            </div>

            <div className="project-case__progress-center">
              <div className="project-case__progress-track">
                <div
                  className="project-case__progress-bar"
                  style={{
                    width: `${Math.min(
                      Math.max(
                        project.progress,
                        0,
                      ),
                      100,
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="project-case__progress-value">
              <strong>
                {project.progress}%
              </strong>

              <span>
                completado
              </span>
            </div>
          </section>
        )}

        {(project.technologies.length >
          0 ||
          project.languages.length >
            0) && (
          <section className="project-case__stack">
            <div className="project-case__stack-header">
              <div>
                <span className="project-case__label">
                  STACK
                </span>

                <h2>
                  Tecnologías utilizadas
                </h2>
              </div>

              <Code2
                size={25}
              />
            </div>

            {project.technologies.length >
              0 && (
              <div className="project-case__stack-group">
                <span className="project-case__stack-label">
                  TECNOLOGÍAS
                </span>

                <div className="project-case__technology-list">
                  {project.technologies.map(
                    (technology) => (
                      <TechnologyItem
                        key={
                          technology.id
                        }
                        name={
                          technology.name
                        }
                        iconSvg={
                          technology.iconSvg
                        }
                      />
                    ),
                  )}
                </div>
              </div>
            )}

            {project.languages.length >
              0 && (
              <div className="project-case__stack-group">
                <span className="project-case__stack-label">
                  LENGUAJES / BASE
                </span>

                <div className="project-case__technology-list">
                  {project.languages.map(
                    (technology) => (
                      <TechnologyItem
                        key={
                          technology.id
                        }
                        name={
                          technology.name
                        }
                        iconSvg={
                          technology.iconSvg
                        }
                      />
                    ),
                  )}
                </div>
              </div>
            )}
          </section>
        )}

        {caseStudy ? (
          <div className="project-case__content">
            <section className="project-case__section">
              <span className="project-case__section-number">
                01
              </span>

              <div className="project-case__section-content">
                <span className="project-case__label">
                  IDEA
                </span>

                <h2>
                  ¿Qué se quería
                  <br />
                  crear?
                </h2>

                <p>
                  {caseStudy.idea}
                </p>
              </div>
            </section>

            <section className="project-case__section">
              <span className="project-case__section-number">
                02
              </span>

              <div className="project-case__section-content">
                <span className="project-case__label">
                  ORIGEN
                </span>

                <h2>
                  ¿De dónde
                  <br />
                  surgió?
                </h2>

                <p>
                  {caseStudy.origin}
                </p>
              </div>
            </section>

            <section className="project-case__section project-case__section--wide">
              <span className="project-case__section-number">
                03
              </span>

              <div className="project-case__section-content">
                <span className="project-case__label">
                  OBJETIVO
                </span>

                <h2>
                  ¿Qué se buscaba
                  <br />
                  lograr?
                </h2>

                <p>
                  {caseStudy.objective}
                </p>
              </div>
            </section>

            <section className="project-case__section project-case__section--wide">
              <span className="project-case__section-number">
                04
              </span>

              <div className="project-case__section-content">
                <span className="project-case__label">
                  PROCESO
                </span>

                <h2>
                  ¿Cómo se
                  <br />
                  desarrolló?
                </h2>

                <p>
                  {caseStudy.process}
                </p>
              </div>
            </section>

            <section className="project-case__section">
              <span className="project-case__section-number">
                05
              </span>

              <div className="project-case__section-content">
                <span className="project-case__label">
                  RESULTADO
                </span>

                <h2>
                  ¿Qué se
                  <br />
                  consiguió?
                </h2>

                <p>
                  {caseStudy.result}
                </p>
              </div>
            </section>

            <section className="project-case__section project-case__section--featured">
              <div className="project-case__featured-icon">
                <Sparkles
                  size={20}
                />
              </div>

              <span className="project-case__section-number">
                06
              </span>

              <div className="project-case__section-content">
                <span className="project-case__label">
                  MI PARTICIPACIÓN
                </span>

                <h2>
                  Mi contribución
                  <br />
                  al proyecto.
                </h2>

                <p>
                  {
                    caseStudy.myContribution
                  }
                </p>
              </div>
            </section>
          </div>
        ) : (
          <section className="project-case__empty">
            <Sparkles
              size={22}
            />

            <span>
              CASO DE ESTUDIO
            </span>

            <h2>
              Información
              <br />
              próximamente.
            </h2>

            <p>
              La información detallada
              de este proyecto todavía
              está siendo preparada.
            </p>
          </section>
        )}

        {caseStudy &&
          caseStudy.members.length >
            0 && (
            <section className="project-case__team">
              <div className="project-case__team-header">
                <div>
                  <span className="project-case__label">
                    EQUIPO
                  </span>

                  <h2>
                    Personas involucradas
                  </h2>
                </div>

                <Users size={25} />
              </div>

              <div className="project-case__members">
                {[
                  ...caseStudy.members,
                ]
                  .sort(
                    (a, b) =>
                      a.sortOrder -
                      b.sortOrder,
                  )
                  .map((member) => (
                    <article
                      key={member.id}
                      className="project-case__member"
                    >
                      <div className="project-case__member-top">
                        <div className="project-case__member-avatar">
                          {member.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <span className="project-case__member-index">
                          {String(
                            member.sortOrder,
                          ).padStart(
                            2,
                            "0",
                          )}
                        </span>
                      </div>

                      <h3>
                        {member.name}
                      </h3>

                      <span className="project-case__member-role">
                        {member.role}
                      </span>

                      <p>
                        {
                          member.description
                        }
                      </p>

                      {(member.website ||
                        member.github) && (
                        <div className="project-case__member-links">
                          {member.website && (
                            <a
                              href={
                                member.website
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Sitio
                              <ArrowUpRight
                                size={13}
                              />
                            </a>
                          )}

                          {member.github && (
                            <a
                              href={
                                member.github
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              GitHub
                              <GitHubIcon
                                width={
                                  14
                                }
                                height={
                                  14
                                }
                              />
                            </a>
                          )}
                        </div>
                      )}
                    </article>
                  ))}
              </div>
            </section>
          )}

        <ProjectFeedback
          projectId={project.id}
        />

        <footer className="project-case__footer">
          <div>
            <span>
              FIN DEL CASO
            </span>

            <strong>
              ¿Quieres ver otro proyecto?
            </strong>
          </div>

          <Link
            to="/"
            className="project-case__footer-button"
          >
            Volver al portafolio
            <ArrowUpRight
              size={16}
            />
          </Link>
        </footer>
      </div>
    </main>
  );
}

export default ProjectCase;