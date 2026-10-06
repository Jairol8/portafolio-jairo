import { useEffect, useState } from "react";
import {
  Check,
  ExternalLink,
  FileText,
  Mail,
  Save,
  Upload,
  X,
} from "lucide-react";

import { GitHub } from "../Icons/GitHub";
import { LinkedIn } from "../Icons/LinkedIn";

import {
  getSiteSettings,
  updateSiteSettings,
  type SiteSettings,
} from "../../services/siteSettings";

import { supabase } from "../../lib/supabase";

import "./AdminSettings.css";

type FormState = {
  name: string;
  profession: string;
  footer_description: string;
  email: string;
  github_url: string;
  linkedin_url: string;
  footer_text: string;
  show_github: boolean;
  show_linkedin: boolean;
  show_email: boolean;
  cv_url: string | null;
};

const emptyForm: FormState = {
  name: "",
  profession: "",
  footer_description: "",
  email: "",
  github_url: "",
  linkedin_url: "",
  footer_text: "",
  show_github: true,
  show_linkedin: true,
  show_email: true,
  cv_url: null,
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function AdminSettings() {
  const [settings, setSettings] =
    useState<SiteSettings | null>(null);

  const [form, setForm] =
    useState<FormState>(emptyForm);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploadingCv, setUploadingCv] =
    useState(false);

  const [selectedCv, setSelectedCv] =
    useState<File | null>(null);

  const [saveStatus, setSaveStatus] =
    useState<"idle" | "success" | "error">("idle");

  const [cvStatus, setCvStatus] =
    useState<"idle" | "success" | "error">("idle");

  const [cvError, setCvError] =
    useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);

      const data = await getSiteSettings();

      if (data) {
        setSettings(data);

        setForm({
          name: data.name,
          profession: data.profession,
          footer_description: data.footer_description,
          email: data.email,
          github_url: data.github_url,
          linkedin_url: data.linkedin_url,
          footer_text: data.footer_text,
          show_github: data.show_github,
          show_linkedin: data.show_linkedin,
          show_email: data.show_email,
          cv_url: data.cv_url,
        });
      }
    } catch (error) {
      console.error(
        "Error al cargar configuración:",
        error,
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    field: keyof FormState,
    value: string | boolean | null,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setSaveStatus("idle");
  }

  function handleCvChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    setCvError("");
    setCvStatus("idle");

    const file = event.target.files?.[0];

    if (!file) {
      setSelectedCv(null);
      return;
    }

    if (file.type !== "application/pdf") {
      setCvError(
        "Solo puedes seleccionar archivos PDF.",
      );

      setSelectedCv(null);
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setCvError(
        "El PDF no puede superar los 10 MB.",
      );

      setSelectedCv(null);
      event.target.value = "";
      return;
    }

    setSelectedCv(file);
  }

  async function handleCvUpload() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("SESIÓN SUPABASE:", session);
  console.log("USUARIO SUPABASE:", session?.user);

  if (!selectedCv) {
      setCvError(
        "Selecciona un archivo PDF antes de subirlo.",
      );

      return;
    }

    try {
      setUploadingCv(true);
      setCvError("");
      setCvStatus("idle");

      const filePath = "cv-jairo.pdf";

      /*
       * Reemplaza el archivo anterior si existe.
       */
      const { error: uploadError } =
        await supabase.storage
          .from("cv")
          .upload(filePath, selectedCv, {
            cacheControl: "3600",
            upsert: true,
            contentType: "application/pdf",
          });

      if (uploadError) {
        throw uploadError;
      }

      /*
       * Obtiene la URL pública del PDF.
       */
      const {
        data: publicUrlData,
      } = supabase.storage
        .from("cv")
        .getPublicUrl(filePath);

      const cvUrl =
        publicUrlData.publicUrl;

      /*
       * Guarda la URL en site_settings.
       */
      await updateSiteSettings({
        name: form.name,
        profession: form.profession,
        footer_description:
          form.footer_description,
        email: form.email,
        github_url: form.github_url,
        linkedin_url:
          form.linkedin_url,
        footer_text: form.footer_text,
        show_github:
          form.show_github,
        show_linkedin:
          form.show_linkedin,
        show_email:
          form.show_email,
        cv_url: cvUrl,
      });

      setForm((current) => ({
        ...current,
        cv_url: cvUrl,
      }));

      const updated =
        await getSiteSettings();

      if (updated) {
        setSettings(updated);
      }

      setSelectedCv(null);
      setCvStatus("success");
    } catch (error) {
      console.error(
        "Error al subir CV:",
        error,
      );

      setCvStatus("error");

      if (
        error &&
        typeof error === "object" &&
        "message" in error
      ) {
        setCvError(
          String(
            (error as { message: string })
              .message,
          ),
        );
      } else {
        setCvError(
          "No se pudo subir el CV.",
        );
      }
    } finally {
      setUploadingCv(false);
    }
  }

  async function handleRemoveCv() {
    if (!form.cv_url) {
      return;
    }

    try {
      setUploadingCv(true);
      setCvError("");
      setCvStatus("idle");

      const { error } =
        await supabase.storage
          .from("cv")
          .remove(["cv-jairo.pdf"]);

      if (error) {
        throw error;
      }

      await updateSiteSettings({
        name: form.name,
        profession: form.profession,
        footer_description:
          form.footer_description,
        email: form.email,
        github_url: form.github_url,
        linkedin_url:
          form.linkedin_url,
        footer_text: form.footer_text,
        show_github:
          form.show_github,
        show_linkedin:
          form.show_linkedin,
        show_email:
          form.show_email,
        cv_url: null,
      });

      setForm((current) => ({
        ...current,
        cv_url: null,
      }));

      const updated =
        await getSiteSettings();

      if (updated) {
        setSettings(updated);
      }

      setCvStatus("success");
    } catch (error) {
      console.error(
        "Error al eliminar CV:",
        error,
      );

      setCvStatus("error");
      setCvError(
        "No se pudo eliminar el CV.",
      );
    } finally {
      setUploadingCv(false);
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setSaveStatus("idle");

      await updateSiteSettings(form);

      const updated =
        await getSiteSettings();

      if (updated) {
        setSettings(updated);
      }

      setSaveStatus("success");
    } catch (error) {
      console.error(
        "Error al guardar configuración:",
        error,
      );

      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="admin-settings">
        <div className="admin-settings__loading">
          Cargando configuración...
        </div>
      </section>
    );
  }

  return (
    <section className="admin-settings">
      <div className="admin-settings__header">
        <div>
          <span className="admin-settings__eyebrow">
            SISTEMA
          </span>

          <h1>Configuración</h1>

          <p>
            Administra la información general
            que utiliza tu portafolio.
          </p>
        </div>

        <div className="admin-settings__status">
          <span className="admin-settings__status-dot" />
          Configuración activa
        </div>
      </div>

      <form
        className="admin-settings__form"
        onSubmit={handleSubmit}
      >
        {/* ========================= */}
        {/* 01 INFORMACIÓN GENERAL */}
        {/* ========================= */}

        <section className="admin-settings__section">
          <div className="admin-settings__section-header">
            <div>
              <span>01</span>
              <h2>Información general</h2>
            </div>

            <p>
              Estos datos pueden utilizarse
              en diferentes partes del
              portafolio.
            </p>
          </div>

          <div className="admin-settings__grid">
            <label className="admin-settings__field">
              <span>Nombre</span>

              <input
                type="text"
                value={form.name}
                onChange={(event) =>
                  handleChange(
                    "name",
                    event.target.value,
                  )
                }
                placeholder="Jairo Santiago"
              />
            </label>

            <label className="admin-settings__field">
              <span>Profesión</span>

              <input
                type="text"
                value={form.profession}
                onChange={(event) =>
                  handleChange(
                    "profession",
                    event.target.value,
                  )
                }
                placeholder="Tu profesión"
              />
            </label>

            <label className="admin-settings__field admin-settings__field--full">
              <span>
                Descripción del Footer
              </span>

              <input
                type="text"
                value={
                  form.footer_description
                }
                onChange={(event) =>
                  handleChange(
                    "footer_description",
                    event.target.value,
                  )
                }
                placeholder="Desarrollo web, diseño y marketing digital."
              />
            </label>
          </div>
        </section>

        {/* ========================= */}
        {/* 02 CONTACTO */}
        {/* ========================= */}

        <section className="admin-settings__section">
          <div className="admin-settings__section-header">
            <div>
              <span>02</span>
              <h2>Contacto y redes</h2>
            </div>

            <p>
              Administra los enlaces que
              aparecen en el Footer.
            </p>
          </div>

          <div className="admin-settings__grid">
            <label className="admin-settings__field">
              <span>
                <Mail size={14} />
                Correo
              </span>

              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  handleChange(
                    "email",
                    event.target.value,
                  )
                }
                placeholder="correo@ejemplo.com"
              />
            </label>

            <label className="admin-settings__field">
              <span>
                <GitHub
                  width={14}
                  height={14}
                />
                GitHub
              </span>

              <input
                type="url"
                value={form.github_url}
                onChange={(event) =>
                  handleChange(
                    "github_url",
                    event.target.value,
                  )
                }
                placeholder="https://github.com/"
              />
            </label>

            <label className="admin-settings__field admin-settings__field--full">
              <span>
                <LinkedIn
                  width={14}
                  height={14}
                />
                LinkedIn
              </span>

              <input
                type="url"
                value={form.linkedin_url}
                onChange={(event) =>
                  handleChange(
                    "linkedin_url",
                    event.target.value,
                  )
                }
                placeholder="https://www.linkedin.com/in/"
              />
            </label>
          </div>
        </section>

        {/* ========================= */}
        {/* 03 VISIBILIDAD */}
        {/* ========================= */}

        <section className="admin-settings__section">
          <div className="admin-settings__section-header">
            <div>
              <span>03</span>
              <h2>
                Visibilidad del Footer
              </h2>
            </div>

            <p>
              Decide qué accesos sociales
              quieres mostrar.
            </p>
          </div>

          <div className="admin-settings__toggles">
            <button
              type="button"
              className={`admin-settings__toggle ${
                form.show_github
                  ? "is-active"
                  : ""
              }`}
              onClick={() =>
                handleChange(
                  "show_github",
                  !form.show_github,
                )
              }
            >
              <div>
                <GitHub
                  width={18}
                  height={18}
                />

                <span>
                  <strong>
                    GitHub
                  </strong>

                  <small>
                    Mostrar enlace de
                    GitHub
                  </small>
                </span>
              </div>

              <span className="admin-settings__switch">
                <span />
              </span>
            </button>

            <button
              type="button"
              className={`admin-settings__toggle ${
                form.show_linkedin
                  ? "is-active"
                  : ""
              }`}
              onClick={() =>
                handleChange(
                  "show_linkedin",
                  !form.show_linkedin,
                )
              }
            >
              <div>
                <LinkedIn
                  width={18}
                  height={18}
                />

                <span>
                  <strong>
                    LinkedIn
                  </strong>

                  <small>
                    Mostrar enlace de
                    LinkedIn
                  </small>
                </span>
              </div>

              <span className="admin-settings__switch">
                <span />
              </span>
            </button>

            <button
              type="button"
              className={`admin-settings__toggle ${
                form.show_email
                  ? "is-active"
                  : ""
              }`}
              onClick={() =>
                handleChange(
                  "show_email",
                  !form.show_email,
                )
              }
            >
              <div>
                <Mail size={18} />

                <span>
                  <strong>
                    Correo
                  </strong>

                  <small>
                    Mostrar enlace de
                    correo
                  </small>
                </span>
              </div>

              <span className="admin-settings__switch">
                <span />
              </span>
            </button>
          </div>
        </section>

        {/* ========================= */}
        {/* 04 FOOTER */}
        {/* ========================= */}

        <section className="admin-settings__section">
          <div className="admin-settings__section-header">
            <div>
              <span>04</span>
              <h2>Footer</h2>
            </div>

            <p>
              Personaliza el texto que aparece
              junto al año actual.
            </p>
          </div>

          <label className="admin-settings__field">
            <span>
              Texto del Footer
            </span>

            <input
              type="text"
              value={form.footer_text}
              onChange={(event) =>
                handleChange(
                  "footer_text",
                  event.target.value,
                )
              }
              placeholder="Todos los derechos reservados."
            />
          </label>
        </section>

        {/* ========================= */}
        {/* 05 CV */}
        {/* ========================= */}

        <section className="admin-settings__section">
          <div className="admin-settings__section-header">
            <div>
              <span>05</span>
              <h2>Currículum</h2>
            </div>

            <p>
              Sube el PDF que utilizará el
              botón de descarga de tu
              portafolio.
            </p>
          </div>

          <div className="admin-cv">
            <div className="admin-cv__current">
              <div className="admin-cv__icon">
                <FileText size={24} />
              </div>

              <div className="admin-cv__info">
                <strong>
                  {form.cv_url
                    ? "CV disponible"
                    : "No hay un CV cargado"}
                </strong>

                <span>
                  {form.cv_url
                    ? "El portafolio utilizará este PDF."
                    : "Selecciona un archivo PDF para comenzar."}
                </span>
              </div>

              {form.cv_url && (
                <a
                  href={form.cv_url}
                  target="_blank"
                  rel="noreferrer"
                  className="admin-cv__view"
                >
                  <ExternalLink size={16} />
                  Ver CV
                </a>
              )}
            </div>

            <div className="admin-cv__upload">
              <label className="admin-cv__file">
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleCvChange}
                />

                <Upload size={20} />

                <span>
                  {selectedCv
                    ? selectedCv.name
                    : "Seleccionar PDF"}
                </span>
              </label>

              {selectedCv && (
                <button
                  type="button"
                  className="admin-cv__clear"
                  onClick={() => {
                    setSelectedCv(null);
                    setCvError("");
                  }}
                >
                  <X size={16} />
                </button>
              )}

              <button
                type="button"
                className="admin-cv__upload-button"
                onClick={handleCvUpload}
                disabled={
                  !selectedCv ||
                  uploadingCv
                }
              >
                <Upload size={17} />

                {uploadingCv
                  ? "Subiendo..."
                  : "Subir CV"}
              </button>
            </div>

            <small className="admin-cv__help">
              Solo PDF. Tamaño máximo: 10 MB.
            </small>

            {cvError && (
              <div className="admin-cv__error">
                {cvError}
              </div>
            )}

            {cvStatus === "success" && (
              <div className="admin-cv__success">
                <Check size={17} />
                CV actualizado correctamente.
              </div>
            )}

            {form.cv_url && (
              <button
                type="button"
                className="admin-cv__remove"
                onClick={handleRemoveCv}
                disabled={uploadingCv}
              >
                <X size={16} />
                Eliminar CV actual
              </button>
            )}
          </div>
        </section>

        {/* ========================= */}
        {/* GUARDAR */}
        {/* ========================= */}

        <div className="admin-settings__footer">
          <div>
            {saveStatus === "success" && (
              <div className="admin-settings__success">
                <span className="admin-settings__success-icon">
                  <Check size={18} />
                </span>

                <div>
                  <strong>
                    ¡Listo!
                  </strong>

                  <span>
                    Los cambios se guardaron
                    correctamente.
                  </span>
                </div>
              </div>
            )}

            {saveStatus === "error" && (
              <span className="admin-settings__message admin-settings__message--error">
                No se pudieron guardar
                los cambios.
              </span>
            )}

            {settings &&
              saveStatus === "idle" && (
                <span className="admin-settings__updated">
                  Última configuración
                  cargada correctamente.
                </span>
              )}
          </div>

          <button
            type="submit"
            className="admin-settings__save"
            disabled={saving}
          >
            <Save size={17} />

            {saving
              ? "Guardando..."
              : "Guardar cambios"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AdminSettings;