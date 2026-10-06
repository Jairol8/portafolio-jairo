import { useEffect, useState } from "react";

import {
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

import type { ExperienceColor } from "../../types/experience";

import "./AdminExperience.css";

type ExperienceRow = {
  id: string;
  period: string;
  company: string;
  role: string;
  description: string;
  logo_svg: string | null;
  color: ExperienceColor;
  visible: boolean;
  sort_order: number;
};

type ExperienceForm = {
  period: string;
  company: string;
  role: string;
  description: string;
  logo_svg: string;
  color: ExperienceColor;
};

const emptyForm: ExperienceForm = {
  period: "",
  company: "",
  role: "",
  description: "",
  logo_svg: "",
  color: "technology",
};

function AdminExperience() {
  const [experiences, setExperiences] = useState<ExperienceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] =
    useState<ExperienceForm>(emptyForm);

  const [saving, setSaving] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  async function loadExperiences() {
    try {
      setLoading(true);
      setError("");

      const { data, error: fetchError } = await supabase
        .from("experiences")
        .select(
          `
            id,
            period,
            company,
            role,
            description,
            logo_svg,
            color,
            visible,
            sort_order
          `,
        )
        .order("sort_order", {
          ascending: true,
        });

      if (fetchError) {
        throw fetchError;
      }

      setExperiences(data ?? []);
    } catch (fetchError) {
      console.error(
        "Error al cargar experiencias:",
        fetchError,
      );

      setError(
        "No se pudieron cargar las experiencias.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExperiences();
  }, []);

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setFormMessage("");
    setError("");
    setIsFormOpen(true);
  }

  function openEditForm(experience: ExperienceRow) {
    setEditingId(experience.id);

    setForm({
      period: experience.period,
      company: experience.company,
      role: experience.role,
      description: experience.description,
      logo_svg: experience.logo_svg ?? "",
      color: experience.color,
    });

    setFormMessage("");
    setError("");
    setIsFormOpen(true);
  }

  function closeForm() {
    if (saving) {
      return;
    }

    setIsFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormMessage("");
  }

  function handleChange(
    field: keyof ExperienceForm,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !form.period.trim() ||
      !form.company.trim() ||
      !form.role.trim() ||
      !form.description.trim()
    ) {
      setFormMessage(
        "Completa todos los campos obligatorios.",
      );

      return;
    }

    try {
      setSaving(true);
      setError("");
      setFormMessage("");

      if (editingId) {
        const { error: updateError } = await supabase
          .from("experiences")
          .update({
            period: form.period.trim(),
            company: form.company.trim(),
            role: form.role.trim(),
            description: form.description.trim(),
            logo_svg: form.logo_svg.trim() || null,
            color: form.color,
          })
          .eq("id", editingId);

        if (updateError) {
          throw updateError;
        }

        setFormMessage(
          "La experiencia fue actualizada correctamente.",
        );
      } else {
        const nextSortOrder =
          experiences.length > 0
            ? Math.max(
                ...experiences.map(
                  (experience) =>
                    experience.sort_order,
                ),
              ) + 1
            : 1;

        const newId = `experience-${Date.now()}`;

        const { error: insertError } = await supabase
          .from("experiences")
          .insert({
            id: newId,
            period: form.period.trim(),
            company: form.company.trim(),
            role: form.role.trim(),
            description: form.description.trim(),
            logo_svg: form.logo_svg.trim() || null,
            color: form.color,
            visible: true,
            sort_order: nextSortOrder,
          });

        if (insertError) {
          throw insertError;
        }

        setFormMessage(
          "La experiencia fue agregada correctamente.",
        );
      }

      await loadExperiences();

      setForm(emptyForm);
      setEditingId(null);
    } catch (saveError) {
      console.error(
        "Error al guardar experiencia:",
        saveError,
      );

      const message =
        saveError instanceof Error
          ? saveError.message
          : "Error desconocido";

      setFormMessage(
        `No se pudo guardar la experiencia: ${message}`,
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisibility(
    experience: ExperienceRow,
  ) {
    try {
      setError("");

      const newVisibility = !experience.visible;

      const { error: updateError } = await supabase
        .from("experiences")
        .update({
          visible: newVisibility,
        })
        .eq("id", experience.id);

      if (updateError) {
        throw updateError;
      }

      await loadExperiences();
    } catch (updateError) {
      console.error(
        "Error al cambiar visibilidad:",
        updateError,
      );

      const message =
        updateError instanceof Error
          ? updateError.message
          : "Error desconocido";

      setError(
        `No se pudo cambiar la visibilidad: ${message}`,
      );
    }
  }

  async function deleteExperience(
    experience: ExperienceRow,
  ) {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar "${experience.company}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const { error: deleteError } = await supabase
        .from("experiences")
        .delete()
        .eq("id", experience.id);

      if (deleteError) {
        throw deleteError;
      }

      await loadExperiences();
    } catch (deleteError) {
      console.error(
        "Error al eliminar experiencia:",
        deleteError,
      );

      setError(
        "No se pudo eliminar la experiencia.",
      );
    }
  }

  return (
    <section className="admin-experience">
      <header className="admin-experience__header">
        <div>
          <span className="admin-experience__eyebrow">
            ADMINISTRACIÓN
          </span>

          <h1>Experiencia</h1>

          <p>
            Administra las experiencias profesionales
            que aparecen en tu portafolio.
          </p>
        </div>

        <button
          type="button"
          className="admin-experience__add"
          onClick={openCreateForm}
        >
          <Plus size={16} aria-hidden="true" />
          Nueva experiencia
        </button>
      </header>

      {error && (
        <div className="admin-experience__error">
          {error}
        </div>
      )}

      {isFormOpen && (
        <form
          className="admin-experience__form"
          onSubmit={handleSubmit}
        >
          <div className="admin-experience__form-header">
            <div>
              <span className="admin-experience__eyebrow">
                {editingId
                  ? "EDITAR REGISTRO"
                  : "NUEVO REGISTRO"}
              </span>

              <h2>
                {editingId
                  ? "Editar experiencia"
                  : "Agregar experiencia"}
              </h2>
            </div>

            <button
              type="button"
              className="admin-experience__close"
              onClick={closeForm}
              title="Cerrar"
            >
              <X size={18} />
            </button>
          </div>

          <div className="admin-experience__form-grid">
            <label>
              <span>Empresa / institución</span>

              <input
                type="text"
                value={form.company}
                onChange={(event) =>
                  handleChange(
                    "company",
                    event.target.value,
                  )
                }
                placeholder="Ej. NXT.IT + TodoparaOficina"
              />
            </label>

            <label>
              <span>Periodo</span>

              <input
                type="text"
                value={form.period}
                onChange={(event) =>
                  handleChange(
                    "period",
                    event.target.value,
                  )
                }
                placeholder="Ej. 2026"
              />
            </label>

            <label className="admin-experience__form-full">
              <span>Puesto / rol</span>

              <input
                type="text"
                value={form.role}
                onChange={(event) =>
                  handleChange(
                    "role",
                    event.target.value,
                  )
                }
                placeholder="Ej. Marketing Digital, Desarrollo Web y Contenido Digital"
              />
            </label>

            <label className="admin-experience__form-full">
              <span>Descripción</span>

              <textarea
                value={form.description}
                onChange={(event) =>
                  handleChange(
                    "description",
                    event.target.value,
                  )
                }
                placeholder="Describe brevemente tu participación..."
                rows={5}
              />
            </label>

            <label>
              <span>Categoría visual</span>

              <select
                value={form.color}
                onChange={(event) =>
                  handleChange(
                    "color",
                    event.target.value,
                  )
                }
              >
                <option value="technology">
                  Tecnología
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
              <span>Logo SVG</span>

              <input
                type="text"
                value={form.logo_svg}
                onChange={(event) =>
                  handleChange(
                    "logo_svg",
                    event.target.value,
                  )
                }
                placeholder="Opcional"
              />
            </label>
          </div>

          {formMessage && (
            <div className="admin-experience__form-message">
              {formMessage}
            </div>
          )}

          <div className="admin-experience__form-actions">
            <button
              type="button"
              className="admin-experience__cancel"
              onClick={closeForm}
              disabled={saving}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="admin-experience__save"
              disabled={saving}
            >
              <CheckCircle2 size={16} />

              {saving
                ? "Guardando..."
                : editingId
                  ? "Guardar cambios"
                  : "Agregar experiencia"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="admin-experience__empty">
          Cargando experiencias...
        </div>
      ) : experiences.length === 0 ? (
        <div className="admin-experience__empty">
          <BriefcaseBusiness
            size={32}
            aria-hidden="true"
          />

          <h2>No hay experiencias registradas</h2>

          <p>
            Puedes agregar tu primera experiencia
            profesional.
          </p>
        </div>
      ) : (
        <div className="admin-experience__list">
          {experiences.map((experience) => (
            <article
              className={`admin-experience__card${
                experience.visible
                  ? ""
                  : " admin-experience__card--hidden"
              }`}
              key={experience.id}
            >
              <div className="admin-experience__number">
                {String(
                  experience.sort_order,
                ).padStart(2, "0")}
              </div>

              <div className="admin-experience__content">
                <div className="admin-experience__top">
                  <div>
                    <span className="admin-experience__period">
                      {experience.period}
                    </span>

                    <h2>{experience.company}</h2>

                    <p className="admin-experience__role">
                      {experience.role}
                    </p>
                  </div>

                  <span
                    className={`admin-experience__status${
                      experience.visible
                        ? " is-visible"
                        : " is-hidden"
                    }`}
                  >
                    {experience.visible ? (
                      <>
                        <Eye
                          size={14}
                          aria-hidden="true"
                        />
                        Visible
                      </>
                    ) : (
                      <>
                        <EyeOff
                          size={14}
                          aria-hidden="true"
                        />
                        Oculta
                      </>
                    )}
                  </span>
                </div>

                <p className="admin-experience__description">
                  {experience.description}
                </p>

                <div className="admin-experience__actions">
                  <button
                    type="button"
                    onClick={() =>
                      toggleVisibility(
                        experience,
                      )
                    }
                  >
                    {experience.visible ? (
                      <>
                        <EyeOff
                          size={16}
                          aria-hidden="true"
                        />
                        Ocultar
                      </>
                    ) : (
                      <>
                        <Eye
                          size={16}
                          aria-hidden="true"
                        />
                        Mostrar
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openEditForm(experience)
                    }
                  >
                    <Pencil
                      size={16}
                      aria-hidden="true"
                    />
                    Editar
                  </button>

                  <button
                    type="button"
                    className="is-danger"
                    onClick={() =>
                      deleteExperience(
                        experience,
                      )
                    }
                  >
                    <Trash2
                      size={16}
                      aria-hidden="true"
                    />
                    Eliminar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminExperience;