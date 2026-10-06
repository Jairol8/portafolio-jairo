import { useState } from "react";

import {
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import "./AdminEducation.css";

type Education = {
  id: string;
  institution: string;
  period: string;
  degree: string;
  description: string;
  visible: boolean;
  sortOrder: number;
};

type EducationForm = {
  institution: string;
  period: string;
  degree: string;
  description: string;
};

const initialEducation: Education[] = [
  {
    id: "utj-ingenieria",
    institution: "Universidad Tecnológica de Jalisco",
    period: "2025–2026",
    degree:
      "Licenciado en Ingeniería en Entornos Virtuales y Negocios Digitales",
    description:
      "Formación enfocada en desarrollo de soluciones digitales, tecnología, negocios digitales y entornos virtuales.",
    visible: true,
    sortOrder: 1,
  },
  {
    id: "cecytej-animacion",
    institution: "CECyTEJ",
    period: "2019–2022",
    degree: "Técnico en Animación Digital",
    description:
      "Formación técnica enfocada en diseño digital, animación y creación de contenido visual.",
    visible: true,
    sortOrder: 2,
  },
];

const emptyForm: EducationForm = {
  institution: "",
  period: "",
  degree: "",
  description: "",
};

function AdminEducation() {
  const [educationList, setEducationList] =
    useState<Education[]>(initialEducation);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<EducationForm>(emptyForm);

  const [message, setMessage] = useState("");

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setIsFormOpen(true);
  };

  const openEditForm = (education: Education) => {
    setEditingId(education.id);

    setForm({
      institution: education.institution,
      period: education.period,
      degree: education.degree,
      description: education.description,
    });

    setMessage("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
  };

  const handleChange = (
    field: keyof EducationForm,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !form.institution.trim() ||
      !form.period.trim() ||
      !form.degree.trim() ||
      !form.description.trim()
    ) {
      setMessage("Completa todos los campos antes de guardar.");
      return;
    }

    if (editingId) {
      setEducationList((current) =>
        current.map((education) =>
          education.id === editingId
            ? {
                ...education,
                institution: form.institution.trim(),
                period: form.period.trim(),
                degree: form.degree.trim(),
                description: form.description.trim(),
              }
            : education,
        ),
      );

      setMessage("La formación académica fue actualizada correctamente.");
    } else {
      const nextSortOrder =
        educationList.length > 0
          ? Math.max(
              ...educationList.map(
                (education) => education.sortOrder,
              ),
            ) + 1
          : 1;

      const newEducation: Education = {
        id: `education-${Date.now()}`,
        institution: form.institution.trim(),
        period: form.period.trim(),
        degree: form.degree.trim(),
        description: form.description.trim(),
        visible: true,
        sortOrder: nextSortOrder,
      };

      setEducationList((current) => [...current, newEducation]);

      setMessage("La formación académica fue agregada correctamente.");
    }

    setForm(emptyForm);
    setEditingId(null);
  };

  const toggleVisibility = (id: string) => {
    setEducationList((current) =>
      current.map((education) =>
        education.id === id
          ? {
              ...education,
              visible: !education.visible,
            }
          : education,
      ),
    );
  };

  const deleteEducation = (id: string) => {
    const education = educationList.find(
      (item) => item.id === id,
    );

    if (!education) {
      return;
    }

    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar "${education.institution}"?`,
    );

    if (!confirmed) {
      return;
    }

    setEducationList((current) =>
      current
        .filter((item) => item.id !== id)
        .map((item, index) => ({
          ...item,
          sortOrder: index + 1,
        })),
    );

    if (editingId === id) {
      closeForm();
    }

    setMessage("La formación académica fue eliminada.");
  };

  return (
    <section className="admin-education">
      <header className="admin-education__header">
        <div>
          <span className="admin-education__eyebrow">
            ADMINISTRACIÓN
          </span>

          <h2>Educación</h2>

          <p>
            Administra la información académica que aparecerá
            posteriormente en tu portafolio.
          </p>
        </div>

        <button
          type="button"
          className="admin-education__new"
          onClick={openCreateForm}
        >
          <Plus size={16} />
          Agregar educación
        </button>
      </header>

      <div className="admin-education__notice">
        <GraduationCap size={18} />

        <div>
          <strong>Módulo local</strong>

          <p>
            Los cambios realizados aquí son temporales y se
            mantienen mientras la aplicación permanezca abierta.
            Posteriormente conectaremos este módulo con Supabase.
          </p>
        </div>
      </div>

      {isFormOpen && (
        <form
          className="admin-education__form"
          onSubmit={handleSubmit}
        >
          <div className="admin-education__form-header">
            <div>
              <span className="admin-education__eyebrow">
                {editingId ? "EDITAR REGISTRO" : "NUEVO REGISTRO"}
              </span>

              <h3>
                {editingId
                  ? "Editar formación académica"
                  : "Agregar formación académica"}
              </h3>
            </div>

            <button
              type="button"
              className="admin-education__close"
              onClick={closeForm}
              title="Cerrar"
            >
              <X size={18} />
            </button>
          </div>

          <div className="admin-education__form-grid">
            <label>
              <span>Institución</span>

              <input
                type="text"
                value={form.institution}
                onChange={(event) =>
                  handleChange(
                    "institution",
                    event.target.value,
                  )
                }
                placeholder="Ej. Universidad Tecnológica de Jalisco"
              />
            </label>

            <label>
              <span>Periodo</span>

              <input
                type="text"
                value={form.period}
                onChange={(event) =>
                  handleChange("period", event.target.value)
                }
                placeholder="Ej. 2025–2026"
              />
            </label>

            <label className="admin-education__form-full">
              <span>Grado / formación</span>

              <input
                type="text"
                value={form.degree}
                onChange={(event) =>
                  handleChange("degree", event.target.value)
                }
                placeholder="Ej. Licenciado en Ingeniería..."
              />
            </label>

            <label className="admin-education__form-full">
              <span>Descripción</span>

              <textarea
                value={form.description}
                onChange={(event) =>
                  handleChange(
                    "description",
                    event.target.value,
                  )
                }
                placeholder="Describe brevemente la formación..."
                rows={5}
              />
            </label>
          </div>

          {message && (
            <div className="admin-education__message">
              {message}
            </div>
          )}

          <div className="admin-education__form-actions">
            <button
              type="button"
              className="admin-education__cancel"
              onClick={closeForm}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="admin-education__save"
            >
              <CheckCircle2 size={16} />

              {editingId
                ? "Guardar cambios"
                : "Agregar educación"}
            </button>
          </div>
        </form>
      )}

      <div className="admin-education__list">
        {[...educationList]
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((education) => (
            <article
              key={education.id}
              className={`admin-education-card ${
                education.visible ? "" : "is-hidden"
              }`}
            >
              <div className="admin-education-card__number">
                {String(education.sortOrder).padStart(2, "0")}
              </div>

              <div className="admin-education-card__content">
                <div className="admin-education-card__meta">
                  <span>{education.period}</span>

                  <span>
                    {education.visible ? "VISIBLE" : "OCULTA"}
                  </span>
                </div>

                <h3>{education.institution}</h3>

                <h4>{education.degree}</h4>

                <p>{education.description}</p>
              </div>

              <div className="admin-education-card__status">
                {education.visible ? (
                  <>
                    <Eye size={16} />
                    <span>Visible</span>
                  </>
                ) : (
                  <>
                    <EyeOff size={16} />
                    <span>Oculta</span>
                  </>
                )}
              </div>

              <div className="admin-education-card__actions">
                <button
                  type="button"
                  title={
                    education.visible
                      ? "Ocultar"
                      : "Mostrar"
                  }
                  onClick={() =>
                    toggleVisibility(education.id)
                  }
                >
                  {education.visible ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>

                <button
                  type="button"
                  title="Editar"
                  onClick={() => openEditForm(education)}
                >
                  <Pencil size={16} />
                </button>

                <button
                  type="button"
                  className="is-danger"
                  title="Eliminar"
                  onClick={() =>
                    deleteEducation(education.id)
                  }
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))}
      </div>

      <div className="admin-education__footer">
        <CheckCircle2 size={15} />

        <span>
          Los cambios actuales son locales. La conexión con
          Supabase se realizará posteriormente.
        </span>
      </div>
    </section>
  );
}

export default AdminEducation;