import { useEffect, useState } from "react";
import { Menu, X, Download } from "lucide-react";

import {
  getSiteSettings,
  type SiteSettings,
} from "../../services/siteSettings";

import "./Navbar.css";

const navItems = [
  { label: "Sobre mí", href: "#sobre-mi" },
  { label: "Formación", href: "#formacion" },
  { label: "Áreas", href: "#areas" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Experiencia", href: "#experiencia" },
  { label: "Contacto", href: "#contacto" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settings, setSettings] =
    useState<SiteSettings | null>(null);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSiteSettings();

        if (data) {
          setSettings(data);
        }
      } catch (error) {
        console.error(
          "Error al cargar configuración del Navbar:",
          error,
        );
      }
    }

    loadSettings();
  }, []);

  return (
    <header className="navbar">
      <div className="navbar__container">
        <a
          href="#"
          className="navbar__logo"
          onClick={closeMenu}
        >
          <span>J</span>
          <strong>Jairo Santiago</strong>
        </a>

        <nav
          className={`navbar__links ${
            menuOpen
              ? "navbar__links--open"
              : ""
          }`}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ))}

          {settings?.cv_url && (
            <a
              href={settings.cv_url}
              className="navbar__cv"
              download="CV-Jairo-Santiago.pdf"
              target="_blank"
              rel="noreferrer"
              onClick={closeMenu}
            >
              <Download size={16} />
              Descargar CV
            </a>
          )}
        </nav>

        <button
          className="navbar__menu"
          type="button"
          aria-label={
            menuOpen
              ? "Cerrar menú"
              : "Abrir menú"
          }
          aria-expanded={menuOpen}
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
        >
          {menuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>
      </div>
    </header>
  );
}

export default Navbar;