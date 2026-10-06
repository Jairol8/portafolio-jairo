import {
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Circle,
  FolderKanban,
  GraduationCap,
  LogOut,
  Mail,
  Settings,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import AdminProjects from "../../components/AdminProjects/AdminProjects";
import AdminExperience from "../../components/AdminExperience/AdminExperience";
import AdminEducation from "../../components/AdminEducation/AdminEducation";
import AdminMessages from "../../components/AdminMessages/AdminMessages";
import AdminSettings from "../../components/AdminSettings/AdminSettings";

import {
  signOut,
} from "../../services/auth";

import "./Admin.css";

type AdminSection =
  | "dashboard"
  | "projects"
  | "experience"
  | "education"
  | "messages"
  | "settings";

const navGroups = [
  {
    label: "General",
    items: [
      {
        id: "dashboard" as AdminSection,
        label: "Dashboard",
        icon: BarChart3,
      },
    ],
  },
  {
    label: "Contenido",
    items: [
      {
        id: "projects" as AdminSection,
        label: "Proyectos",
        icon: FolderKanban,
      },
      {
        id: "experience" as AdminSection,
        label: "Experiencia",
        icon: BriefcaseBusiness,
      },
      {
        id: "education" as AdminSection,
        label: "Educación",
        icon: GraduationCap,
      },
      {
        id: "messages" as AdminSection,
        label: "Mensajes",
        icon: Mail,
      },
    ],
  },
  {
    label: "Sistema",
    items: [
      {
        id: "settings" as AdminSection,
        label: "Configuración",
        icon: Settings,
      },
    ],
  },
];

const stats = [
  {
    label: "Proyectos",
    value: 4,
    hint: "Proyectos registrados",
    icon: FolderKanban,
  },
  {
    label: "Experiencia",
    value: 2,
    hint: "Experiencias profesionales",
    icon: BriefcaseBusiness,
  },
  {
    label: "Educación",
    value: 2,
    hint: "Formaciones registradas",
    icon: GraduationCap,
  },
];

const steps = [
  {
    label: "Autenticación configurada",
    done: true,
  },
  {
    label: "Migrar proyectos y casos de estudio",
    done: false,
  },
  {
    label: "Migrar experiencia y educación",
    done: false,
  },
];

function Admin() {
  const navigate = useNavigate();

  const [activeItem, setActiveItem] =
    useState<AdminSection>("dashboard");

  async function handleLogout() {
    try {
      await signOut();

      navigate("/admin/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Error al cerrar sesión:",
        error,
      );
    }
  }

  function renderContent() {
    switch (activeItem) {
      case "projects":
        return <AdminProjects />;

      case "experience":
        return <AdminExperience />;

      case "education":
        return <AdminEducation />;

      case "messages":
  return <AdminMessages />;

      case "settings":
  return <AdminSettings />;

      case "dashboard":
      default:
        return (
          <>
            <header className="admin__header">
              <div>
                <span className="admin__eyebrow">
                  PANEL DE CONTROL
                </span>

                <h1>
                  Dashboard
                </h1>

                <p>
                  Administra el contenido de
                  tu portafolio desde un solo
                  lugar.
                </p>
              </div>
            </header>

            <div className="admin__cards">
              {stats.map(
                ({
                  label,
                  value,
                  hint,
                  icon: Icon,
                }) => (
                  <article
                    className="admin__card"
                    key={label}
                  >
                    <div className="admin__card-top">
                      <span>
                        {label}
                      </span>

                      <Icon
                        size={18}
                        aria-hidden="true"
                      />
                    </div>

                    <strong>
                      {value}
                    </strong>

                    <small>
                      {hint}
                    </small>
                  </article>
                ),
              )}

              <article className="admin__card admin__card--status">
                <div className="admin__card-top">
                  <span>
                    Estado
                  </span>
                </div>

                <div className="admin__status">
                  <span
                    className="admin__status-dot"
                    aria-hidden="true"
                  />

                  Conectado
                </div>

                <small>
                  Sistema funcionando
                </small>
              </article>
            </div>

            <section
              className="admin__welcome"
              aria-labelledby="admin-next"
            >
              <h2 id="admin-next">
                Panel de administración
              </h2>

              <p>
                La autenticación está
                configurada y tu panel ya
                puede trabajar con Supabase.
                Desde la sección de proyectos
                puedes administrar el contenido
                público de tu portafolio.
              </p>

              <ul className="admin__steps">
                {steps.map(
                  ({
                    label,
                    done,
                  }) => (
                    <li
                      key={label}
                      className={
                        done
                          ? "is-done"
                          : undefined
                      }
                    >
                      {done ? (
                        <CheckCircle2
                          size={18}
                          aria-hidden="true"
                        />
                      ) : (
                        <Circle
                          size={18}
                          aria-hidden="true"
                        />
                      )}

                      {label}
                    </li>
                  ),
                )}
              </ul>
            </section>
          </>
        );
    }
  }

  return (
    <main className="admin">
      <aside className="admin__sidebar">
        <div className="admin__brand">
          <span aria-hidden="true">
            JS
          </span>

          <div>
            <strong>
              Jairo Santiago
            </strong>

            <small>
              Panel de administración
            </small>
          </div>
        </div>

        <nav
          className="admin__nav"
          aria-label="Navegación principal"
        >
          {navGroups.map(
            (group) => (
              <div
                className="admin__nav-group"
                key={group.label}
              >
                <span className="admin__nav-label">
                  {group.label}
                </span>

                {group.items.map(
                  ({
                    id,
                    label,
                    icon: Icon,
                  }) => (
                    <button
                      key={id}
                      type="button"
                      className={`admin__nav-item${
                        id === activeItem
                          ? " admin__nav-item--active"
                          : ""
                      }`}
                      aria-current={
                        id === activeItem
                          ? "page"
                          : undefined
                      }
                      onClick={() =>
                        setActiveItem(id)
                      }
                    >
                      <Icon
                        size={18}
                        aria-hidden="true"
                      />

                      {label}
                    </button>
                  ),
                )}
              </div>
            ),
          )}
        </nav>

        <button
          type="button"
          className="admin__logout"
          onClick={handleLogout}
          aria-label="Cerrar sesión"
        >
          <LogOut
            size={18}
            aria-hidden="true"
          />

          Cerrar sesión
        </button>
      </aside>

      <section className="admin__main">
        {renderContent()}
      </section>
    </main>
  );
}

export default Admin;

