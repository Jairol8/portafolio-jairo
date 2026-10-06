import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Plus,
  Save,
  Trash2,
  UserRound,
} from "lucide-react";

import {
  createCaseStudy,
  createProjectMember,
  deleteProjectMember,
  getAdminCaseStudy,
  updateCaseStudy,
  updateProjectMember,
  type AdminCaseStudyInput,
  type AdminProjectMemberInput,
  type AdminProjectType,
  type AdminWorkMode,
} from "../../services/adminCaseStudies";

import "./AdminCaseStudy.css";

type AdminCaseStudyProps = {
  projectId: string;
  projectTitle: string;
  onBack: () => void;
};

type MemberForm = AdminProjectMemberInput & {
  tempId: string;
};

const createEmptyMember = (
  sortOrder: number,
): MemberForm => ({
  tempId: crypto.randomUUID(),
  name: "",
  role: "",
  description: "",
  website: "",
  github: "",
  sortOrder,
});

export default function AdminCaseStudy({
  projectId,
  projectTitle,
  onBack,
}: AdminCaseStudyProps) {
  /* =========================================================
     INFORMACIÓN DEL CASO
  ========================================================= */

  const [caseStudyId, setCaseStudyId] =
    useState("");

  const [projectType, setProjectType] =
    useState<AdminProjectType>("personal");

  const [workMode, setWorkMode] =
    useState<AdminWorkMode>("individual");

  const [company, setCompany] =
    useState("");

  const [role, setRole] =
    useState("");

  /* =========================================================
     CONTENIDO DEL CASO
  ========================================================= */

  const [idea, setIdea] =
    useState("");

  const [origin, setOrigin] =
    useState("");

  const [objective, setObjective] =
    useState("");

  const [process, setProcess] =
    useState("");

  const [result, setResult] =
    useState("");

  const [myContribution, setMyContribution] =
    useState("");

  const [visible, setVisible] =
    useState(true);

  /* =========================================================
     EQUIPO
  ========================================================= */

  const [members, setMembers] =
    useState<MemberForm[]>([]);

  /* =========================================================
     ESTADO
  ========================================================= */

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /* =========================================================
     CARGAR CASO
  ========================================================= */

  useEffect(() => {
    loadCaseStudy();
  }, [projectId]);

  async function loadCaseStudy() {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data =
        await getAdminCaseStudy(projectId);

      /* =====================================================
         CASO NUEVO
      ===================================================== */

      if (!data) {
        setCaseStudyId("");

        setProjectType("personal");
        setWorkMode("individual");
        setCompany("");
        setRole("");

        setIdea("");
        setOrigin("");
        setObjective("");
        setProcess("");
        setResult("");
        setMyContribution("");

        setVisible(true);
        setMembers([]);

        return;
      }

      /* =====================================================
         INFORMACIÓN DEL PROYECTO
      ===================================================== */

      setCaseStudyId(data.id);

      setProjectType(
        data.projectType,
      );

      setWorkMode(
        data.workMode,
      );

      setCompany(
        data.company,
      );

      setRole(
        data.role,
      );

      /* =====================================================
         CONTENIDO
      ===================================================== */

      setIdea(
        data.idea,
      );

      setOrigin(
        data.origin,
      );

      setObjective(
        data.objective,
      );

      setProcess(
        data.process,
      );

      setResult(
        data.result,
      );

      setMyContribution(
        data.myContribution,
      );

      setVisible(
        data.visible,
      );

      /* =====================================================
         EQUIPO
      ===================================================== */

      setMembers(
        data.members.map(
          (member) => ({
            ...member,
            tempId:
              member.id ??
              crypto.randomUUID(),
          }),
        ),
      );
    } catch (err) {
      console.error(err);

      setError(
        "No se pudo cargar el caso de estudio.",
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================================================
     AGREGAR INTEGRANTE
  ========================================================= */

  function addMember() {
    setMembers(
      (current) => [
        ...current,
        createEmptyMember(
          current.length + 1,
        ),
      ],
    );
  }

  /* =========================================================
     ACTUALIZAR INTEGRANTE
  ========================================================= */

  function updateMember(
    tempId: string,
    field:
      keyof AdminProjectMemberInput,
    value:
      | string
      | number,
  ) {
    setMembers(
      (current) =>
        current.map(
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
    );
  }

  /* =========================================================
     ELIMINAR INTEGRANTE
  ========================================================= */

  async function removeMember(
    member: MemberForm,
  ) {
    const confirmed =
      window.confirm(
        `¿Eliminar al integrante "${member.name || "sin nombre"}"?`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      if (member.id) {
        await deleteProjectMember(
          member.id,
        );
      }

      setMembers(
        (current) =>
          current
            .filter(
              (item) =>
                item.tempId !==
                member.tempId,
            )
            .map(
              (
                item,
                index,
              ) => ({
                ...item,
                sortOrder:
                  index + 1,
              }),
            ),
      );
    } catch (err) {
      console.error(err);

      setError(
        "No se pudo eliminar el integrante.",
      );
    }
  }

  /* =========================================================
     GUARDAR
  ========================================================= */

  async function handleSave() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      /* =====================================================
         VALIDACIONES
      ===================================================== */

      if (!idea.trim()) {
        setError(
          "La sección Idea es obligatoria.",
        );

        return;
      }

      if (!objective.trim()) {
        setError(
          "La sección Objetivo es obligatoria.",
        );

        return;
      }

      /*
       * Si el proyecto es empresarial o de cliente,
       * pedimos el nombre de la empresa / cliente.
       */
      if (
        (projectType ===
          "company" ||
          projectType ===
            "client") &&
        !company.trim()
      ) {
        setError(
          "Indica la empresa o cliente del proyecto.",
        );

        return;
      }

      /*
       * El rol es importante para mostrar
       * correctamente tu participación.
       */
      if (!role.trim()) {
        setError(
          "Indica tu rol dentro del proyecto.",
        );

        return;
      }

      /* =====================================================
         DATOS DEL CASO
      ===================================================== */

      const caseStudyInput: AdminCaseStudyInput =
        {
          projectId,

          projectType,

          workMode,

          company:
            company.trim(),

          role:
            role.trim(),

          idea:
            idea.trim(),

          origin:
            origin.trim(),

          objective:
            objective.trim(),

          process:
            process.trim(),

          result:
            result.trim(),

          myContribution:
            myContribution.trim(),

          visible,
        };

      /* =====================================================
         CREAR / ACTUALIZAR
      ===================================================== */

      let currentCaseStudyId =
        caseStudyId;

      if (
        currentCaseStudyId
      ) {
        await updateCaseStudy(
          currentCaseStudyId,
          caseStudyInput,
        );
      } else {
        currentCaseStudyId =
          await createCaseStudy(
            caseStudyInput,
          );

        setCaseStudyId(
          currentCaseStudyId,
        );
      }

      /* =====================================================
         GUARDAR INTEGRANTES
      ===================================================== */

      /*
       * Si el proyecto es individual,
       * no necesitamos guardar integrantes.
       *
       * Si anteriormente tenía integrantes
       * y ahora cambió a individual,
       * los eliminamos.
       */

      if (
        workMode ===
        "individual"
      ) {
        for (
          const member of members
        ) {
          if (member.id) {
            await deleteProjectMember(
              member.id,
            );
          }
        }

        setMembers([]);
      } else {
        /*
         * Proyecto en equipo.
         */

        for (
          const member of members
        ) {
          /*
           * Ignoramos filas completamente vacías.
           */
          if (
            !member.name.trim() &&
            !member.role.trim()
          ) {
            continue;
          }

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
                  ?.trim() ||
                "",

              github:
                member.github
                  ?.trim() ||
                "",

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
              currentCaseStudyId,
              memberData,
            );
          }
        }
      }

      /* =====================================================
         RECARGAR
      ===================================================== */

      await loadCaseStudy();

      setSuccess(
        "Caso de estudio guardado correctamente.",
      );
    } catch (err) {
      console.error(err);

      setError(
        "No se pudo guardar el caso de estudio.",
      );
    } finally {
      setSaving(false);
    }
  }

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <section className="admin-case-study">
        <div className="admin-case-study-loading">
          Cargando caso de estudio...
        </div>
      </section>
    );
  }

  /* =========================================================
     FORMULARIO
  ========================================================= */

  return (
    <section className="admin-case-study">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="admin-case-study-header">
        <button
          type="button"
          className="admin-case-study-back"
          onClick={onBack}
        >
          <ArrowLeft size={18} />

          Volver a proyectos
        </button>

        <div>
          <span className="admin-case-study-eyebrow">
            Caso de estudio
          </span>

          <h2>
            {projectTitle}
          </h2>

          <p>
            Administra la información que aparecerá
            en la página pública del proyecto.
          </p>
        </div>
      </div>

      {/* =====================================================
          MENSAJES
      ===================================================== */}

      {error && (
        <div className="admin-case-study-message admin-case-study-error">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-case-study-message admin-case-study-success">
          {success}
        </div>
      )}

      {/* =====================================================
          01 — CONTEXTO DEL PROYECTO
      ===================================================== */}

      <div className="admin-case-study-card">
        <div className="admin-case-study-card-header">
          <div>
            <span>01</span>

            <h3>
              Contexto del proyecto
            </h3>
          </div>

          <label className="admin-case-study-switch">
            <input
              type="checkbox"
              checked={visible}
              onChange={(
                event,
              ) =>
                setVisible(
                  event.target
                    .checked,
                )
              }
            />

            <span className="admin-case-study-switch-track" />

            <span>
              Visible públicamente
            </span>
          </label>
        </div>

        <div className="admin-case-study-fields">
          {/* =================================================
              TIPO DE PROYECTO
          ================================================= */}

          <label className="admin-case-study-field">
            <span>
              Tipo de proyecto
            </span>

            <select
              value={
                projectType
              }
              onChange={(
                event,
              ) =>
                setProjectType(
                  event.target
                    .value as AdminProjectType,
                )
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

          {/* =================================================
              MODALIDAD
          ================================================= */}

          <label className="admin-case-study-field">
            <span>
              Modalidad de trabajo
            </span>

            <select
              value={
                workMode
              }
              onChange={(
                event,
              ) =>
                setWorkMode(
                  event.target
                    .value as AdminWorkMode,
                )
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

          {/* =================================================
              EMPRESA / CLIENTE
          ================================================= */}

          {(projectType ===
            "company" ||
            projectType ===
              "client") && (
            <label className="admin-case-study-field">
              <span>
                {projectType ===
                "company"
                  ? "Empresa"
                  : "Cliente"}
              </span>

              <input
                type="text"
                value={
                  company
                }
                onChange={(
                  event,
                ) =>
                  setCompany(
                    event.target
                      .value,
                  )
                }
                placeholder={
                  projectType ===
                  "company"
                    ? "Nombre de la empresa"
                    : "Nombre del cliente"
                }
              />
            </label>
          )}

          {/* =================================================
              MI ROL
          ================================================= */}

          <label className="admin-case-study-field">
            <span>
              Mi rol
            </span>

            <input
              type="text"
              value={
                role
              }
              onChange={(
                event,
              ) =>
                setRole(
                  event.target
                    .value,
                )
              }
              placeholder="Ej. Desarrollo Full Stack"
            />
          </label>
        </div>
      </div>

      {/* =====================================================
          02 — CASO DE ESTUDIO
      ===================================================== */}

      <div className="admin-case-study-card">
        <div className="admin-case-study-card-header">
          <div>
            <span>02</span>

            <h3>
              Caso de estudio
            </h3>
          </div>
        </div>

        <div className="admin-case-study-fields">
          {/* IDEA */}

          <label className="admin-case-study-field admin-case-study-field-full">
            <span>
              Idea
            </span>

            <textarea
              value={
                idea
              }
              onChange={(
                event,
              ) =>
                setIdea(
                  event.target
                    .value,
                )
              }
              placeholder="¿Cuál fue la idea principal del proyecto?"
              rows={5}
            />
          </label>

          {/* ORIGEN */}

          <label className="admin-case-study-field">
            <span>
              Origen
            </span>

            <textarea
              value={
                origin
              }
              onChange={(
                event,
              ) =>
                setOrigin(
                  event.target
                    .value,
                )
              }
              placeholder="¿De dónde surgió el proyecto?"
              rows={5}
            />
          </label>

          {/* OBJETIVO */}

          <label className="admin-case-study-field">
            <span>
              Objetivo
            </span>

            <textarea
              value={
                objective
              }
              onChange={(
                event,
              ) =>
                setObjective(
                  event.target
                    .value,
                )
              }
              placeholder="¿Qué se buscaba conseguir?"
              rows={5}
            />
          </label>

          {/* PROCESO */}

          <label className="admin-case-study-field">
            <span>
              Proceso
            </span>

            <textarea
              value={
                process
              }
              onChange={(
                event,
              ) =>
                setProcess(
                  event.target
                    .value,
                )
              }
              placeholder="¿Cómo se desarrolló el proyecto?"
              rows={6}
            />
          </label>

          {/* RESULTADO */}

          <label className="admin-case-study-field">
            <span>
              Resultado
            </span>

            <textarea
              value={
                result
              }
              onChange={(
                event,
              ) =>
                setResult(
                  event.target
                    .value,
                )
              }
              placeholder="¿Cuál fue el resultado?"
              rows={6}
            />
          </label>

          {/* MI CONTRIBUCIÓN */}

          <label className="admin-case-study-field admin-case-study-field-full">
            <span>
              Mi contribución
            </span>

            <textarea
              value={
                myContribution
              }
              onChange={(
                event,
              ) =>
                setMyContribution(
                  event.target
                    .value,
                )
              }
              placeholder="Describe tu participación en el proyecto."
              rows={6}
            />
          </label>
        </div>
      </div>

      {/* =====================================================
          03 — EQUIPO
      ===================================================== */}

      {workMode ===
        "team" && (
        <div className="admin-case-study-card">
          <div className="admin-case-study-card-header">
            <div>
              <span>
                03
              </span>

              <h3>
                Integrantes del proyecto
              </h3>
            </div>

            <button
              type="button"
              className="admin-case-study-add"
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

          {members.length ===
          0 ? (
            <div className="admin-case-study-empty">
              <UserRound
                size={28}
              />

              <strong>
                No hay integrantes registrados
              </strong>

              <p>
                Puedes agregar las personas
                que participaron en el proyecto.
              </p>
            </div>
          ) : (
            <div className="admin-case-study-members">
              {members.map(
                (
                  member,
                  index,
                ) => (
                  <div
                    className="admin-case-study-member"
                    key={
                      member.tempId
                    }
                  >
                    <div className="admin-case-study-member-header">
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
                        className="admin-case-study-delete"
                        onClick={() =>
                          removeMember(
                            member,
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

                    <div className="admin-case-study-member-grid">
                      {/* NOMBRE */}

                      <label className="admin-case-study-field">
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

                      {/* ROL */}

                      <label className="admin-case-study-field">
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

                      {/* DESCRIPCIÓN */}

                      <label className="admin-case-study-field admin-case-study-field-full">
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
                          rows={
                            4
                          }
                        />
                      </label>

                      {/* SITIO */}

                      <label className="admin-case-study-field">
                        <span>
                          Sitio web
                        </span>

                        <input
                          type="url"
                          value={
                            member.website ??
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

                      {/* GITHUB */}

                      <label className="admin-case-study-field">
                        <span>
                          GitHub
                        </span>

                        <input
                          type="url"
                          value={
                            member.github ??
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

                      {/* ORDEN */}

                      <label className="admin-case-study-field admin-case-study-order">
                        <span>
                          Orden
                        </span>

                        <input
                          type="number"
                          min="1"
                          value={
                            member.sortOrder
                          }
                          onChange={(
                            event,
                          ) =>
                            updateMember(
                              member.tempId,
                              "sortOrder",
                              Number(
                                event
                                  .target
                                  .value,
                              ),
                            )
                          }
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

      {/* =====================================================
          ACCIONES
      ===================================================== */}

      <div className="admin-case-study-actions">
        <button
          type="button"
          className="admin-case-study-cancel"
          onClick={
            onBack
          }
          disabled={
            saving
          }
        >
          Cancelar
        </button>

        <button
          type="button"
          className="admin-case-study-save"
          onClick={
            handleSave
          }
          disabled={
            saving
          }
        >
          <Save
            size={18}
          />

          {saving
            ? "Guardando..."
            : "Guardar caso de estudio"}
        </button>
      </div>
    </section>
  );
}