import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  Check,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  Plus,
  Save,
  Star,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import {
  createProject,
  deleteProject,
  getAdminProjects,
  getAdminTechnologies,
  updateProject,
  type AdminProjectInput,
} from "../../services/adminProjects";

import {
  createCaseStudy,
  createProjectMember,
  deleteCaseStudy,
  deleteProjectMember,
  getAdminCaseStudy,
  updateCaseStudy,
  updateProjectMember,
  type AdminCaseStudyInput,
  type AdminProjectMemberInput,
  type AdminProjectType,
  type AdminWorkMode,
} from "../../services/adminCaseStudies";

import "./AdminProjects.css";

type TechnologyCategory =
  | "language"
  | "framework"
  | "database"
  | "design"
  | "marketing"
  | "ai"
  | "content"
  | "tool";

type AdminTechnology = {
  id: string;
  name: string;
  slug: string;
  website: string | null;
  icon_svg: string | null;
  active: boolean;
  category: TechnologyCategory;
};

type AdminProject = {
  id: string;
  number: string;
  category: string;
  title: string;
  description: string;
  status:
    | "Completado"
    | "En desarrollo"
    | "En pausa"
    | "Próximamente";
  color:
    | "programming"
    | "design"
    | "marketing";
  progress: number;
  project_type:
    | "individual"
    | "team"
    | "company";
  demo: string;
  github: string;
  github_public: boolean;
  case_study: boolean;
  visible: boolean;
  featured: boolean;
  sort_order: number;
  project_technologies?: {
    technology: AdminTechnology | null;
  }[];
  project_languages?: {
    technology: AdminTechnology | null;
  }[];
};

type MemberForm = AdminProjectMemberInput & {
  tempId: string;
};

type CaseStudyForm = {
  caseStudyId: string;
  projectType: AdminProjectType;
  workMode: AdminWorkMode;
  company: string;
  role: string;
  idea: string;
  origin: string;
  objective: string;
  process: string;
  result: string;
  myContribution: string;
  visible: boolean;
  members: MemberForm[];
};

const emptyForm: AdminProjectInput = {
  id: "",
  number: "",
  category: "",
  title: "",
  description: "",
  status: "Completado",
  color: "programming",
  progress: 100,
  projectType: "individual",
  demo: "",
  github: "",
  githubPublic: false,
  caseStudy: true,
  visible: true,
  featured: false,
  sortOrder: 1,
  technologies: [],
  languages: [],
};

const emptyCaseStudy: CaseStudyForm = {
  caseStudyId: "",
  projectType: "personal",
  workMode: "individual",
  company: "",
  role: "",
  idea: "",
  origin: "",
  objective: "",
  process: "",
  result: "",
  myContribution: "",
  visible: true,
  members: [],
};

const technologyCategoryOrder: TechnologyCategory[] = [
  "framework",
  "language",
  "database",
  "design",
  "marketing",
  "ai",
  "content",
  "tool",
];

const technologyCategoryLabels: Record<
  TechnologyCategory,
  string
> = {
  framework: "Frameworks y desarrollo",
  language: "Lenguajes y web",
  database: "Bases de datos",
  design: "Diseño",
  marketing: "Marketing y analítica",
  ai: "Inteligencia artificial",
  content: "Contenido",
  tool: "Herramientas",
};

function createProjectId(title: string) {
  return title
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createMember(): MemberForm {
  return {
    tempId: crypto.randomUUID(),
    name: "",
    role: "",
    description: "",
    website: "",
    github: "",
    sortOrder: 1,
  };
}

function getNextNumber(
  projects: AdminProject[],
) {
  if (projects.length === 0) {
    return "01";
  }

  const highestNumber = Math.max(
    ...projects.map(
      (project) =>
        Number(project.number) || 0,
    ),
  );

  return String(
    highestNumber + 1,
  ).padStart(2, "0");
}

function getNextSortOrder(
  projects: AdminProject[],
) {
  if (projects.length === 0) {
    return 1;
  }

  return (
    Math.max(
      ...projects.map(
        (project) =>
          project.sort_order || 0,
      ),
    ) + 1
  );
}

function AdminProjects() {
  const [projects, setProjects] =
    useState<AdminProject[]>([]);

  const [technologies, setTechnologies] =
    useState<AdminTechnology[]>([]);

  const [form, setForm] =
    useState<AdminProjectInput>(
      emptyForm,
    );

  const [caseStudy, setCaseStudy] =
    useState<CaseStudyForm>(
      emptyCaseStudy,
    );

  const [
    originalMemberIds,
    setOriginalMemberIds,
  ] = useState<string[]>([]);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [caseStudyLoading, setCaseStudyLoading] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const [
        projectsData,
        technologiesData,
      ] = await Promise.all([
        getAdminProjects(),
        getAdminTechnologies(),
      ]);

      setProjects(
        projectsData as AdminProject[],
      );

      setTechnologies(
        technologiesData as AdminTechnology[],
      );
    } catch (err) {
      console.error(err);

      setError(
        "No se pudieron cargar los proyectos.",
      );
    } finally {
      setLoading(false);
    }
  }

  function startCreate() {
    const nextNumber =
      getNextNumber(projects);

    const nextSortOrder =
      getNextSortOrder(projects);

    setEditingId(null);

    setForm({
      ...emptyForm,
      id: "",
      number: nextNumber,
      sortOrder: nextSortOrder,
    });

    setCaseStudy({
      ...emptyCaseStudy,
      members: [],
    });

    setOriginalMemberIds([]);
    setCaseStudyLoading(false);
    setIsFormOpen(true);
    setError(null);
  }

  async function startEdit(
    project: AdminProject,
  ) {
    setEditingId(project.id);

    setForm({
      id: project.id,
      number: project.number,
      category: project.category,
      title: project.title,
      description: project.description,
      status: project.status,
      color: project.color,
      progress:
        project.progress ?? 100,
      projectType:
        project.project_type,
      demo: project.demo || "",
      github: project.github || "",
      githubPublic:
        project.github_public ?? false,
      caseStudy:
        project.case_study ?? false,
      visible:
        project.visible ?? true,
      featured:
        project.featured ?? false,
      sortOrder:
        project.sort_order ?? 1,
      technologies:
        project.project_technologies
          ?.map(
            (item) =>
              item.technology?.id,
          )
          .filter(
            (id): id is string =>
              Boolean(id),
          ) || [],
      languages:
        project.project_languages
          ?.map(
            (item) =>
              item.technology?.id,
          )
          .filter(
            (id): id is string =>
              Boolean(id),
          ) || [],
    });

    setCaseStudyLoading(true);
    setIsFormOpen(true);
    setError(null);

    try {
      const data =
        await getAdminCaseStudy(
          project.id,
        );

      if (!data) {
        setCaseStudy({
          ...emptyCaseStudy,
          members: [],
        });

        setOriginalMemberIds([]);
        return;
      }

      const members: MemberForm[] =
        data.members.map(
          (member) => ({
            ...member,
            website:
              member.website || "",
            github:
              member.github || "",
            tempId:
              member.id ||
              crypto.randomUUID(),
          }),
        );

      setCaseStudy({
        caseStudyId: data.id,
        projectType:
          data.projectType,
        workMode:
          data.workMode,
        company:
          data.company || "",
        role:
          data.role || "",
        idea:
          data.idea || "",
        origin:
          data.origin || "",
        objective:
          data.objective || "",
        process:
          data.process || "",
        result:
          data.result || "",
        myContribution:
          data.myContribution || "",
        visible:
          data.visible ?? true,
        members,
      });

      setOriginalMemberIds(
        members
          .map(
            (member) =>
              member.id,
          )
          .filter(
            (id): id is string =>
              Boolean(id),
          ),
      );
    } catch (err) {
      console.error(err);

      setError(
        "No se pudo cargar el caso de estudio del proyecto.",
      );

      setCaseStudy({
        ...emptyCaseStudy,
        members: [],
      });

      setOriginalMemberIds([]);
    } finally {
      setCaseStudyLoading(false);
    }
  }

  async function closeForm() {
  setIsFormOpen(false);
  setEditingId(null);
  setForm(emptyForm);
  setCaseStudy(emptyCaseStudy);
  setOriginalMemberIds([]);
  setCaseStudyLoading(false);
  setError(null);

  await loadData();
}

  function updateField<
    K extends keyof AdminProjectInput,
  >(
    field: K,
    value: AdminProjectInput[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateCaseStudyField<
    K extends keyof CaseStudyForm,
  >(
    field: K,
    value: CaseStudyForm[K],
  ) {
    setCaseStudy((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function toggleTechnology(
    technologyId: string,
  ) {
    setForm((current) => ({
      ...current,
      technologies:
        current.technologies.includes(
          technologyId,
        )
          ? current.technologies.filter(
              (id) =>
                id !== technologyId,
            )
          : [
              ...current.technologies,
              technologyId,
            ],
    }));
  }

  function toggleLanguage(
    technologyId: string,
  ) {
    setForm((current) => ({
      ...current,
      languages:
        current.languages.includes(
          technologyId,
        )
          ? current.languages.filter(
              (id) =>
                id !== technologyId,
            )
          : [
              ...current.languages,
              technologyId,
            ],
    }));
  }

  function getTechnologiesByCategory(
    category: TechnologyCategory,
  ) {
    return technologies.filter(
      (technology) =>
        technology.category ===
          category &&
        technology.active,
    );
  }

  function addMember() {
    setCaseStudy((current) => ({
      ...current,
      members: [
        ...current.members,
        {
          ...createMember(),
          sortOrder:
            current.members.length + 1,
        },
      ],
    }));
  }

  function updateMember(
    tempId: string,
    field:
      keyof AdminProjectMemberInput,
    value:
      | string
      | number,
  ) {
    setCaseStudy((current) => ({
      ...current,
      members:
        current.members.map(
          (member) =>
            member.tempId ===
            tempId
              ? {
                  ...member,
                  [field]:
                    value,
                }
              : member,
        ),
    }));
  }

  function removeMember(
    tempId: string,
  ) {
    setCaseStudy((current) => ({
      ...current,
      members:
        current.members
          .filter(
            (member) =>
              member.tempId !==
              tempId,
          )
          .map(
            (
              member,
              index,
            ) => ({
              ...member,
              sortOrder:
                index + 1,
            }),
          ),
    }));
  }

  async function saveCaseStudy(
    projectId: string,
  ) {
    if (!form.caseStudy) {
      for (
        const memberId of originalMemberIds
      ) {
        await deleteProjectMember(
          memberId,
        );
      }

      if (caseStudy.caseStudyId) {
        await deleteCaseStudy(
          caseStudy.caseStudyId,
        );
      }

      return;
    }

    if (!caseStudy.idea.trim()) {
      throw new Error(
        "La sección Idea del caso de estudio es obligatoria.",
      );
    }

    if (!caseStudy.objective.trim()) {
      throw new Error(
        "La sección Objetivo del caso de estudio es obligatoria.",
      );
    }

    if (
      (caseStudy.projectType ===
        "company" ||
        caseStudy.projectType ===
          "client") &&
      !caseStudy.company.trim()
    ) {
      throw new Error(
        "Indica la empresa o cliente del proyecto.",
      );
    }

    if (!caseStudy.role.trim()) {
      throw new Error(
        "Indica tu rol dentro del proyecto.",
      );
    }

    const caseStudyInput: AdminCaseStudyInput =
      {
        projectId,

        projectType:
          caseStudy.projectType,

        workMode:
          caseStudy.workMode,

        company:
          caseStudy.company.trim(),

        role:
          caseStudy.role.trim(),

        idea:
          caseStudy.idea.trim(),

        origin:
          caseStudy.origin.trim(),

        objective:
          caseStudy.objective.trim(),

        process:
          caseStudy.process.trim(),

        result:
          caseStudy.result.trim(),

        myContribution:
          caseStudy.myContribution.trim(),

        visible:
          caseStudy.visible,
      };

    let caseStudyId =
      caseStudy.caseStudyId;

    if (caseStudyId) {
      await updateCaseStudy(
        caseStudyId,
        caseStudyInput,
      );
    } else {
      caseStudyId =
        await createCaseStudy(
          caseStudyInput,
        );
    }

    const validMembers =
      caseStudy.workMode ===
      "team"
        ? caseStudy.members.filter(
            (member) =>
              member.name.trim() ||
              member.role.trim(),
          )
        : [];

    const currentExistingMemberIds =
      validMembers
        .map(
          (member) =>
            member.id,
        )
        .filter(
          (id): id is string =>
            Boolean(id),
        );

    for (
      const memberId of originalMemberIds
    ) {
      if (
        !currentExistingMemberIds.includes(
          memberId,
        )
      ) {
        await deleteProjectMember(
          memberId,
        );
      }
    }

    if (
      caseStudy.workMode ===
      "individual"
    ) {
      for (
        const memberId of currentExistingMemberIds
      ) {
        await deleteProjectMember(
          memberId,
        );
      }
    } else {
      for (
        const member of validMembers
      ) {
        const memberData:
          AdminProjectMemberInput =
          {
            id:
              member.id,

            name:
              member.name.trim(),

            role:
              member.role.trim(),

            description:
              member.description.trim(),

            website:
              member.website
                ?.trim() || "",

            github:
              member.github
                ?.trim() || "",

            sortOrder:
              member.sortOrder,
          };

        if (member.id) {
          await updateProjectMember(
            member.id,
            memberData,
          );
        } else {
          await createProjectMember(
            caseStudyId,
            memberData,
          );
        }
      }
    }
  }

  async function handleSubmit(
    event: FormEvent,
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError(null);

      if (!form.title.trim()) {
        setError(
          "El título del proyecto es obligatorio.",
        );
        return;
      }

      if (!form.category.trim()) {
        setError(
          "La categoría del proyecto es obligatoria.",
        );
        return;
      }

      if (!form.description.trim()) {
        setError(
          "La descripción del proyecto es obligatoria.",
        );
        return;
      }

      if (caseStudyLoading) {
        setError(
          "Espera a que termine de cargar el caso de estudio.",
        );
        return;
      }

      const projectToSave: AdminProjectInput =
        {
          ...form,
          id: editingId
            ? form.id
            : createProjectId(
                form.title,
              ),
        };

      if (!projectToSave.id) {
        setError(
          "No se pudo generar el ID del proyecto.",
        );
        return;
      }

      if (editingId) {
        await updateProject(
          projectToSave,
        );
      } else {
        await createProject(
          projectToSave,
        );
      }

      await saveCaseStudy(
        projectToSave.id,
      );

      
      closeForm();
      await loadData();
    } catch (err) {
      console.error(err);

      if (
        err instanceof Error &&
        err.message
      ) {
        setError(err.message);
      } else {
        setError(
          "No se pudo guardar el proyecto. Revisa los datos e inténtalo nuevamente.",
        );
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(
    project: AdminProject,
  ) {
    const confirmed =
      window.confirm(
        `¿Seguro que quieres eliminar "${project.title}"?`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setError(null);

      const existingCaseStudy =
        await getAdminCaseStudy(
          project.id,
        );

      if (existingCaseStudy) {
        for (
          const member of existingCaseStudy.members
        ) {
          if (member.id) {
            await deleteProjectMember(
              member.id,
            );
          }
        }

        await deleteCaseStudy(
          existingCaseStudy.id,
        );
      }

      await deleteProject(
        project.id,
      );

      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        "No se pudo eliminar el proyecto.",
      );
    }
  }

  async function handleToggleVisible(
    project: AdminProject,
  ) {
    try {
      setError(null);

      await updateProject({
        id: project.id,
        number: project.number,
        category: project.category,
        title: project.title,
        description:
          project.description,
        status: project.status,
        color: project.color,
        progress:
          project.progress ?? 100,
        projectType:
          project.project_type,
        demo:
          project.demo || "",
        github:
          project.github || "",
        githubPublic:
          project.github_public ??
          false,
        caseStudy:
          project.case_study ??
          false,
        visible:
          !project.visible,
        featured:
          project.featured ??
          false,
        sortOrder:
          project.sort_order ?? 1,
        technologies:
          project.project_technologies
            ?.map(
              (item) =>
                item.technology?.id,
            )
            .filter(
              (id): id is string =>
                Boolean(id),
            ) || [],
        languages:
          project.project_languages
            ?.map(
              (item) =>
                item.technology?.id,
            )
            .filter(
              (id): id is string =>
                Boolean(id),
            ) || [],
      });

      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        "No se pudo cambiar la visibilidad del proyecto.",
      );
    }
  }

  async function handleToggleFeatured(
    project: AdminProject,
  ) {
    try {
      setError(null);

      await updateProject({
        id: project.id,
        number: project.number,
        category: project.category,
        title: project.title,
        description:
          project.description,
        status: project.status,
        color: project.color,
        progress:
          project.progress ?? 100,
        projectType:
          project.project_type,
        demo:
          project.demo || "",
        github:
          project.github || "",
        githubPublic:
          project.github_public ??
          false,
        caseStudy:
          project.case_study ??
          false,
        visible:
          project.visible ??
          true,
        featured:
          !project.featured,
        sortOrder:
          project.sort_order ?? 1,
        technologies:
          project.project_technologies
            ?.map(
              (item) =>
                item.technology?.id,
            )
            .filter(
              (id): id is string =>
                Boolean(id),
            ) || [],
        languages:
          project.project_languages
            ?.map(
              (item) =>
                item.technology?.id,
            )
            .filter(
              (id): id is string =>
                Boolean(id),
            ) || [],
      });

      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        "No se pudo cambiar el proyecto destacado.",
      );
    }
  }

  if (loading) {
    return (
      <section className="admin-projects">
        <div className="admin-projects__loading">
          Cargando proyectos...
        </div>
      </section>
    );
  }

  return (
    <section className="admin-projects">
      <div className="admin-projects__header">
        <div>
          <span className="admin-projects__eyebrow">
            Contenido
          </span>

          <h1>
            Proyectos
          </h1>

          <p>
            Administra los proyectos que
            aparecen en tu portafolio.
          </p>
        </div>

        <button
          type="button"
          className="admin-projects__add"
          onClick={startCreate}
        >
          <Plus size={18} />
          Nuevo proyecto
        </button>
      </div>

      {error && (
        <div className="admin-projects__error">
          {error}
        </div>
      )}

      {!isFormOpen && (
        <div className="admin-projects__list">
          {projects.length === 0 ? (
            <div className="admin-projects__empty">
              <FileText size={28} />

              <h2>
                No hay proyectos
              </h2>

              <p>
                Crea tu primer proyecto
                para comenzar.
              </p>

              <button
                type="button"
                onClick={startCreate}
              >
                <Plus size={17} />
                Crear proyecto
              </button>
            </div>
          ) : (
            projects.map(
              (project) => (
                <article
                  className={`admin-projects__card ${
                    !project.visible
                      ? "is-hidden"
                      : ""
                  }`}
                  key={project.id}
                >
                  <div className="admin-projects__card-main">
                    <div className="admin-projects__number">
                      {project.number}
                    </div>

                    <div className="admin-projects__info">
                      <div className="admin-projects__title-row">
                        <h2>
                          {project.title}
                        </h2>

                        {project.featured && (
                          <span className="admin-projects__featured">
                            <Star
                              size={13}
                              fill="currentColor"
                            />
                            Destacado
                          </span>
                        )}
                      </div>

                      <span className="admin-projects__category">
                        {project.category}
                      </span>

                      <p>
                        {
                          project.description
                        }
                      </p>

                      <div className="admin-projects__meta">
                        <span>
                          {
                            project.status
                          }
                        </span>

                        {project.status ===
                          "En desarrollo" && (
                          <span>
                            {
                              project.progress
                            }
                            %
                          </span>
                        )}

                        {project.case_study && (
                          <span>
                            Caso de estudio
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="admin-projects__actions">
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleVisible(
                          project,
                        )
                      }
                      title={
                        project.visible
                          ? "Ocultar proyecto"
                          : "Mostrar proyecto"
                      }
                    >
                      {project.visible ? (
                        <Eye size={17} />
                      ) : (
                        <EyeOff
                          size={17}
                        />
                      )}
                    </button>

                    <button
                      type="button"
                      className={
                        project.featured
                          ? "is-active"
                          : ""
                      }
                      onClick={() =>
                        handleToggleFeatured(
                          project,
                        )
                      }
                      title="Proyecto destacado"
                    >
                      <Star
                        size={17}
                        fill={
                          project.featured
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        startEdit(
                          project,
                        )
                      }
                      title="Editar proyecto"
                    >
                      <Edit3 size={17} />
                    </button>

                    <button
                      type="button"
                      className="is-danger"
                      onClick={() =>
                        handleDelete(
                          project,
                        )
                      }
                      title="Eliminar proyecto"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </article>
              ),
            )
          )}
        </div>
      )}

      {isFormOpen && (
        <form
          className="admin-projects__form"
          onSubmit={handleSubmit}
        >
          <div className="admin-projects__form-header">
            <div>
              <span className="admin-projects__eyebrow">
                {editingId
                  ? "Editar proyecto"
                  : "Nuevo proyecto"}
              </span>

              <h2>
                {editingId
                  ? "Actualizar proyecto"
                  : "Crear proyecto"}
              </h2>
            </div>

            <button
              type="button"
              onClick={closeForm}
              className="admin-projects__close"
              title="Cerrar"
            >
              <X size={19} />
            </button>
          </div>

          <div className="admin-projects__form-grid">
            <label className="admin-projects__field--wide">
              <span>Título</span>

              <input
                type="text"
                value={form.title}
                onChange={(event) =>
                  updateField(
                    "title",
                    event.target.value,
                  )
                }
                placeholder="Nombre del proyecto"
                required
              />
            </label>

            <label>
              <span>Categoría</span>

              <input
                type="text"
                value={form.category}
                onChange={(event) =>
                  updateField(
                    "category",
                    event.target.value,
                  )
                }
                placeholder="Desarrollo web"
                required
              />
            </label>

            <label>
              <span>Estado</span>

              <select
                value={form.status}
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target
                      .value as AdminProjectInput["status"],
                  )
                }
              >
                <option value="Completado">
                  Completado
                </option>

                <option value="En desarrollo">
                  En desarrollo
                </option>

                <option value="En pausa">
                  En pausa
                </option>

                <option value="Próximamente">
                  Próximamente
                </option>
              </select>
            </label>

            <label>
              <span>Área visual</span>

              <select
                value={form.color}
                onChange={(event) =>
                  updateField(
                    "color",
                    event.target
                      .value as AdminProjectInput["color"],
                  )
                }
              >
                <option value="programming">
                  Programación
                </option>

                <option value="design">
                  Diseño
                </option>

                <option value="marketing">
                  Marketing
                </option>
              </select>
            </label>

            <label>
              <span>Progreso</span>

              <input
                type="number"
                min="0"
                max="100"
                value={
                  form.progress
                }
                onChange={(event) =>
                  updateField(
                    "progress",
                    Number(
                      event.target.value,
                    ),
                  )
                }
              />
            </label>

            <label className="admin-projects__field--wide">
              <span>Descripción</span>

              <textarea
                value={
                  form.description
                }
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value,
                  )
                }
                placeholder="Describe brevemente el proyecto..."
                rows={5}
                required
              />
            </label>

            <label>
              <span>Demo</span>

              <input
                type="url"
                value={
                  form.demo
                }
                onChange={(event) =>
                  updateField(
                    "demo",
                    event.target.value,
                  )
                }
                placeholder="https://..."
              />
            </label>

            <label>
              <span>GitHub</span>

              <input
                type="url"
                value={
                  form.github
                }
                onChange={(event) =>
                  updateField(
                    "github",
                    event.target.value,
                  )
                }
                placeholder="https://github.com/..."
              />
            </label>
          </div>

          <div className="admin-projects__options">
            <label
              className={`admin-projects__option ${
                form.githubPublic
                  ? "is-selected"
                  : ""
              }`}
            >
              <input
                type="checkbox"
                checked={
                  form.githubPublic
                }
                onChange={(event) =>
                  updateField(
                    "githubPublic",
                    event.target.checked,
                  )
                }
              />

              <span>
                GitHub público
              </span>

              {form.githubPublic && (
                <Check size={14} />
              )}
            </label>

            <label
              className={`admin-projects__option ${
                form.caseStudy
                  ? "is-selected"
                  : ""
              }`}
            >
              <input
                type="checkbox"
                checked={
                  form.caseStudy
                }
                onChange={(event) =>
                  updateField(
                    "caseStudy",
                    event.target.checked,
                  )
                }
              />

              <span>
                Tiene caso de estudio
              </span>

              {form.caseStudy && (
                <Check size={14} />
              )}
            </label>

            <label
              className={`admin-projects__option ${
                form.visible
                  ? "is-selected"
                  : ""
              }`}
            >
              <input
                type="checkbox"
                checked={
                  form.visible
                }
                onChange={(event) =>
                  updateField(
                    "visible",
                    event.target.checked,
                  )
                }
              />

              <span>
                Mostrar públicamente
              </span>

              {form.visible && (
                <Check size={14} />
              )}
            </label>

            <label
              className={`admin-projects__option ${
                form.featured
                  ? "is-selected"
                  : ""
              }`}
            >
              <input
                type="checkbox"
                checked={
                  form.featured
                }
                onChange={(event) =>
                  updateField(
                    "featured",
                    event.target.checked,
                  )
                }
              />

              <span>
                Proyecto destacado
              </span>

              {form.featured && (
                <Check size={14} />
              )}
            </label>
          </div>

          <div className="admin-projects__technologies">
            {technologyCategoryOrder.map(
              (category) => {
                const categoryTechnologies =
                  getTechnologiesByCategory(
                    category,
                  );

                if (
                  categoryTechnologies.length ===
                  0
                ) {
                  return null;
                }

                const isLanguage =
                  category ===
                  "language";

                return (
                  <div
                    key={category}
                  >
                    <span className="admin-projects__section-title">
                      {
                        technologyCategoryLabels[
                          category
                        ]
                      }
                    </span>

                    <div className="admin-projects__technology-grid">
                      {categoryTechnologies.map(
                        (
                          technology,
                        ) => {
                          const selected =
                            isLanguage
                              ? form.languages.includes(
                                  technology.id,
                                )
                              : form.technologies.includes(
                                  technology.id,
                                );

                          return (
                            <label
                              className={`admin-projects__technology ${
                                selected
                                  ? "is-selected"
                                  : ""
                              }`}
                              key={
                                technology.id
                              }
                            >
                              <input
                                type="checkbox"
                                checked={
                                  selected
                                }
                                onChange={() =>
                                  isLanguage
                                    ? toggleLanguage(
                                        technology.id,
                                      )
                                    : toggleTechnology(
                                        technology.id,
                                      )
                                }
                              />

                              {technology.icon_svg ? (
                                <span
                                  className="admin-projects__technology-icon"
                                  aria-hidden="true"
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      technology.icon_svg,
                                  }}
                                />
                              ) : null}

                              <span>
                                {
                                  technology.name
                                }
                              </span>

                              {selected && (
                                <Check
                                  size={
                                    14
                                  }
                                />
                              )}
                            </label>
                          );
                        },
                      )}
                    </div>
                  </div>
                );
              },
            )}
          </div>

          <div className="admin-projects__case-study">
            <div className="admin-projects__case-study-header">
              <div>
                <span className="admin-projects__section-title">
                  Caso de estudio
                </span>

                <h3>
                  Información del proyecto
                </h3>

                <p>
                  Esta información aparecerá
                  cuando el visitante abra
                  "Ver caso".
                </p>
              </div>

              <label
                className={`admin-projects__option ${
                  form.caseStudy
                    ? "is-selected"
                    : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={
                    form.caseStudy
                  }
                  onChange={(event) =>
                    updateField(
                      "caseStudy",
                      event.target.checked,
                    )
                  }
                />

                <span>
                  Activar caso
                </span>

                {form.caseStudy && (
                  <Check size={14} />
                )}
              </label>
            </div>

            {caseStudyLoading ? (
              <div className="admin-projects__case-study-loading">
                Cargando información del
                caso de estudio...
              </div>
            ) : (
              <>
                <div className="admin-projects__form-grid">
                  <label>
                    <span>
                      Tipo de proyecto
                    </span>

                    <select
                      value={
                        caseStudy.projectType
                      }
                      onChange={(event) =>
                        updateCaseStudyField(
                          "projectType",
                          event.target
                            .value as AdminProjectType,
                        )
                      }
                      disabled={
                        !form.caseStudy
                      }
                    >
                      <option value="personal">
                        Personal
                      </option>

                      <option value="academic">
                        Académico
                      </option>

                      <option value="client">
                        Cliente
                      </option>

                      <option value="company">
                        Empresarial
                      </option>
                    </select>
                  </label>

                  <label>
                    <span>
                      Modalidad de trabajo
                    </span>

                    <select
                      value={
                        caseStudy.workMode
                      }
                      onChange={(event) =>
                        updateCaseStudyField(
                          "workMode",
                          event.target
                            .value as AdminWorkMode,
                        )
                      }
                      disabled={
                        !form.caseStudy
                      }
                    >
                      <option value="individual">
                        Individual
                      </option>

                      <option value="team">
                        Equipo
                      </option>
                    </select>
                  </label>

                  {(caseStudy.projectType ===
                    "company" ||
                    caseStudy.projectType ===
                      "client") && (
                    <label>
                      <span>
                        {caseStudy.projectType ===
                        "company"
                          ? "Empresa"
                          : "Cliente"}
                      </span>

                      <input
                        type="text"
                        value={
                          caseStudy.company
                        }
                        onChange={(event) =>
                          updateCaseStudyField(
                            "company",
                            event.target.value,
                          )
                        }
                        placeholder={
                          caseStudy.projectType ===
                          "company"
                            ? "Nombre de la empresa"
                            : "Nombre del cliente"
                        }
                        disabled={
                          !form.caseStudy
                        }
                      />
                    </label>
                  )}

                  <label>
                    <span>
                      Mi rol
                    </span>

                    <input
                      type="text"
                      value={
                        caseStudy.role
                      }
                      onChange={(event) =>
                        updateCaseStudyField(
                          "role",
                          event.target.value,
                        )
                      }
                      placeholder="Ej. Desarrollo Full Stack"
                      disabled={
                        !form.caseStudy
                      }
                    />
                  </label>

                  <label className="admin-projects__field--wide">
                    <span>
                      Idea
                    </span>

                    <textarea
                      value={
                        caseStudy.idea
                      }
                      onChange={(event) =>
                        updateCaseStudyField(
                          "idea",
                          event.target.value,
                        )
                      }
                      placeholder="¿Cuál fue la idea principal del proyecto?"
                      rows={5}
                      disabled={
                        !form.caseStudy
                      }
                    />
                  </label>

                  <label>
                    <span>
                      Origen
                    </span>

                    <textarea
                      value={
                        caseStudy.origin
                      }
                      onChange={(event) =>
                        updateCaseStudyField(
                          "origin",
                          event.target.value,
                        )
                      }
                      placeholder="¿De dónde surgió el proyecto?"
                      rows={5}
                      disabled={
                        !form.caseStudy
                      }
                    />
                  </label>

                  <label>
                    <span>
                      Objetivo
                    </span>

                    <textarea
                      value={
                        caseStudy.objective
                      }
                      onChange={(event) =>
                        updateCaseStudyField(
                          "objective",
                          event.target.value,
                        )
                      }
                      placeholder="¿Qué se buscaba conseguir?"
                      rows={5}
                      disabled={
                        !form.caseStudy
                      }
                    />
                  </label>

                  <label>
                    <span>
                      Proceso
                    </span>

                    <textarea
                      value={
                        caseStudy.process
                      }
                      onChange={(event) =>
                        updateCaseStudyField(
                          "process",
                          event.target.value,
                        )
                      }
                      placeholder="¿Cómo se desarrolló el proyecto?"
                      rows={6}
                      disabled={
                        !form.caseStudy
                      }
                    />
                  </label>

                  <label>
                    <span>
                      Resultado
                    </span>

                    <textarea
                      value={
                        caseStudy.result
                      }
                      onChange={(event) =>
                        updateCaseStudyField(
                          "result",
                          event.target.value,
                        )
                      }
                      placeholder="¿Cuál fue el resultado?"
                      rows={6}
                      disabled={
                        !form.caseStudy
                      }
                    />
                  </label>

                  <label className="admin-projects__field--wide">
                    <span>
                      Mi contribución
                    </span>

                    <textarea
                      value={
                        caseStudy.myContribution
                      }
                      onChange={(event) =>
                        updateCaseStudyField(
                          "myContribution",
                          event.target.value,
                        )
                      }
                      placeholder="Describe tu participación en el proyecto."
                      rows={6}
                      disabled={
                        !form.caseStudy
                      }
                    />
                  </label>
                </div>

                {form.caseStudy &&
                  caseStudy.workMode ===
                    "team" && (
                    <div className="admin-projects__team">
                      <div className="admin-projects__team-header">
                        <div>
                          <span className="admin-projects__section-title">
                            Equipo
                          </span>

                          <h3>
                            Integrantes del proyecto
                          </h3>

                          <p>
                            Agrega las personas
                            que participaron
                            contigo.
                          </p>
                        </div>

                        <button
                          type="button"
                          className="admin-projects__add"
                          onClick={
                            addMember
                          }
                        >
                          <Plus
                            size={17}
                          />
                          Agregar integrante
                        </button>
                      </div>

                      {caseStudy.members
                        .length ===
                      0 ? (
                        <div className="admin-projects__team-empty">
                          <UserRound
                            size={28}
                          />

                          <strong>
                            No hay integrantes
                            registrados
                          </strong>

                          <p>
                            Agrega los
                            colaboradores del
                            proyecto.
                          </p>
                        </div>
                      ) : (
                        <div className="admin-projects__team-list">
                          {caseStudy.members.map(
                            (
                              member,
                              index,
                            ) => (
                              <div
                                className="admin-projects__team-member"
                                key={
                                  member.tempId
                                }
                              >
                                <div className="admin-projects__team-member-header">
                                  <div>
                                    <span>
                                      Integrante{" "}
                                      {index +
                                        1}
                                    </span>

                                    <h4>
                                      {member.name ||
                                        "Nuevo integrante"}
                                    </h4>
                                  </div>

                                  <button
                                    type="button"
                                    className="admin-projects__team-delete"
                                    onClick={() =>
                                      removeMember(
                                        member.tempId,
                                      )
                                    }
                                    title="Eliminar integrante"
                                  >
                                    <Trash2
                                      size={
                                        17
                                      }
                                    />
                                  </button>
                                </div>

                                <div className="admin-projects__form-grid">
                                  <label>
                                    <span>
                                      Nombre
                                    </span>

                                    <input
                                      type="text"
                                      value={
                                        member.name
                                      }
                                      onChange={(
                                        event,
                                      ) =>
                                        updateMember(
                                          member.tempId,
                                          "name",
                                          event
                                            .target
                                            .value,
                                        )
                                      }
                                      placeholder="Nombre del integrante"
                                    />
                                  </label>

                                  <label>
                                    <span>
                                      Rol
                                    </span>

                                    <input
                                      type="text"
                                      value={
                                        member.role
                                      }
                                      onChange={(
                                        event,
                                      ) =>
                                        updateMember(
                                          member.tempId,
                                          "role",
                                          event
                                            .target
                                            .value,
                                        )
                                      }
                                      placeholder="Rol dentro del proyecto"
                                    />
                                  </label>

                                  <label className="admin-projects__field--wide">
                                    <span>
                                      Descripción
                                    </span>

                                    <textarea
                                      value={
                                        member.description
                                      }
                                      onChange={(
                                        event,
                                      ) =>
                                        updateMember(
                                          member.tempId,
                                          "description",
                                          event
                                            .target
                                            .value,
                                        )
                                      }
                                      placeholder="Describe brevemente su participación."
                                      rows={4}
                                    />
                                  </label>

                                  <label>
                                    <span>
                                      Sitio web
                                    </span>

                                    <input
                                      type="url"
                                      value={
                                        member.website ||
                                        ""
                                      }
                                      onChange={(
                                        event,
                                      ) =>
                                        updateMember(
                                          member.tempId,
                                          "website",
                                          event
                                            .target
                                            .value,
                                        )
                                      }
                                      placeholder="https://..."
                                    />
                                  </label>

                                  <label>
                                    <span>
                                      GitHub
                                    </span>

                                    <input
                                      type="url"
                                      value={
                                        member.github ||
                                        ""
                                      }
                                      onChange={(
                                        event,
                                      ) =>
                                        updateMember(
                                          member.tempId,
                                          "github",
                                          event
                                            .target
                                            .value,
                                        )
                                      }
                                      placeholder="https://github.com/..."
                                    />
                                  </label>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  )}
              </>
            )}
          </div>

          <div className="admin-projects__form-actions">
            <button
              type="button"
              className="admin-projects__cancel"
              onClick={closeForm}
              disabled={saving}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="admin-projects__save"
              disabled={
                saving ||
                caseStudyLoading
              }
            >
              {saving ? (
                "Guardando..."
              ) : (
                <>
                  <Save size={17} />

                  {editingId
                    ? "Guardar cambios"
                    : "Crear proyecto"}
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

export default AdminProjects;