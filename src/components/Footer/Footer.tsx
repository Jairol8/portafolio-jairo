import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

import { GitHub } from "../Icons/GitHub";
import { LinkedIn } from "../Icons/LinkedIn";
import { Gmail } from "../Icons/Gmail";

import {
  getSiteSettings,
  type SiteSettings,
} from "../../services/siteSettings";

import "./Footer.css";

function Footer() {
  const [settings, setSettings] =
    useState<SiteSettings | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const data = await getSiteSettings();

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error(
        "Error al cargar configuración del Footer:",
        error,
      );
    }
  }

  const name = settings?.name || "Jairo Santiago";

  const description =
    settings?.footer_description ||
    "Desarrollo web, diseño y marketing digital.";

  const email =
    settings?.email || "jr1312982@gmail.com";

  const githubUrl =
    settings?.github_url ||
    "https://github.com/Jairol8";

  const linkedinUrl =
    settings?.linkedin_url ||
    "https://www.linkedin.com/in/jairo-santiago-rodríguez-jauregui-196074397";

  const footerText =
    settings?.footer_text ||
    "Todos los derechos reservados.";

  return (
    <footer className="footer">
      <div className="footer__main">
        <div className="footer__brand">
          <a href="#inicio" className="footer__logo">
            <span>J</span>
            {name}
          </a>

          <p>{description}</p>
        </div>

        <div className="footer__links">
          <a href="#sobre-mi">Sobre mí</a>
          <a href="#proyectos">Proyectos</a>
          <a href="#experiencia">Experiencia</a>
          <a href="#contacto">Contacto</a>
        </div>

        <div className="footer__social">
          {settings?.show_github !== false && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              title="GitHub"
            >
              <GitHub width={18} height={18} />
            </a>
          )}

          {settings?.show_linkedin !== false && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <LinkedIn width={18} height={18} />
            </a>
          )}

          {settings?.show_email !== false && (
            <a
              href={`mailto:${email}`}
              aria-label="Enviar correo"
              title="Enviar correo"
            >
              <Gmail width={19} height={19} />
            </a>
          )}
        </div>
      </div>

      <div className="footer__bottom">
        <p>
          © {new Date().getFullYear()} {name}.{" "}
          {footerText}
        </p>

        <a href="#inicio" className="footer__top">
          Volver arriba
          <ArrowUp size={15} />
        </a>
      </div>
    </footer>
  );
}

export default Footer;