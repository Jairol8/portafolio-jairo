import {
  CalendarDays,
  CheckCircle2,
} from "lucide-react";

import type { EducationItem } from "../../types/education";
import { education } from "../../data/education";

import "./Education.css";

/* =========================================================
   LOGO DE INSTITUCIÓN
   ========================================================= */

function InstitutionLogo({
  education,
}: {
  education: EducationItem;
}) {
  /*
   * FUTURO ADMIN:
   *
   * El administrador podrá guardar:
   *
   * <svg ...>
   *   ...
   * </svg>
   *
   * dentro de logoSvg.
   *
   * Posteriormente aquí podremos sanitizar y
   * renderizar ese SVG.
   */

  if (education.logoSvg) {
    return (
      <div
        className="education__institution-logo"
        aria-label={`Logo de ${education.institution}`}
        dangerouslySetInnerHTML={{
          __html: education.logoSvg,
        }}
      />
    );
  }

  /*
   * Mientras todavía no hay logo,
   * mostramos un espacio reservado elegante.
   *
   * Esto evita utilizar nuevamente
   * el icono de graduación.
   */

  return (
    <div
      className="education__institution-logo education__institution-logo--empty"
      aria-hidden="true"
    >
      <span>
        {education.institution
          .slice(0, 2)
          .toUpperCase()}
      </span>
    </div>
  );
}

/* =========================================================
   COMPONENTE
   ========================================================= */

function Education() {
  const visibleEducation =
    education
      .filter(
        (item) => item.visible,
      )
      .sort(
        (a, b) =>
          a.sortOrder - b.sortOrder,
      );

  return (
    <section
      className="education"
      id="formacion"
    >
      {/* =================================================
          HEADER
          ================================================= */}

      <div className="education__heading">
        <div className="education__heading-main">
          <div className="education__eyebrow">
            <span className="education__eyebrow-line" />

            <p className="section-label">
              Formación
            </p>
          </div>

          <h2 className="education__title">
            Mi trayectoria
            <span>académica.</span>
          </h2>
        </div>

        <div className="education__intro-wrapper">
          <p className="education__intro">
            Una formación que conecta
            tecnología, creatividad y
            conocimientos orientados al
            desarrollo de soluciones digitales.
          </p>

          <div className="education__summary">
            <span className="education__summary-number">
              {String(
                visibleEducation.length,
              ).padStart(2, "0")}
            </span>

            <span className="education__summary-text">
              etapas de formación
            </span>
          </div>
        </div>
      </div>

      {/* =================================================
          TIMELINE
          ================================================= */}

      <div className="education__timeline">
        <div className="education__timeline-line" />

        {visibleEducation.map(
          (item, index) => (
            <article
              className={`education__item ${
                index === 0
                  ? "education__item--current"
                  : ""
              }`}
              key={item.id}
            >
              {/* Número */}

              <div className="education__marker">
                <span>
                  {String(index + 1).padStart(
                    2,
                    "0",
                  )}
                </span>
              </div>

              {/* Periodo */}

              <div className="education__period">
                <CalendarDays
                  size={14}
                  strokeWidth={1.8}
                />

                <span>{item.period}</span>
              </div>

              {/* Tarjeta */}

              <div className="education__card">
                <div className="education__card-top">
                  <div className="education__institution-wrapper">
                    <InstitutionLogo
                      education={item}
                    />

                    <div>
                      <p className="education__institution">
                        {item.institution}
                      </p>

                      <div className="education__status">
                        <span className="education__status-dot" />

                        {item.status}
                      </div>
                    </div>
                  </div>
                </div>

                <h3>{item.degree}</h3>

                <p className="education__description">
                  {item.description}
                </p>

                <div className="education__card-footer">
                  <div className="education__verified">
                    <CheckCircle2
                      size={15}
                      strokeWidth={1.8}
                    />

                    <span>
                      Formación académica
                    </span>
                  </div>

                  <span className="education__index">
                    {String(index + 1).padStart(
                      2,
                      "0",
                    )}
                  </span>
                </div>
              </div>
            </article>
          ),
        )}
      </div>

      {/* =================================================
          FOOTER
          ================================================= */}

      <div className="education__bottom">
        <p>
          Tecnología y creatividad como base
          para seguir construyendo soluciones
          digitales.
        </p>

        <span>
          Formación continua
        </span>
      </div>
    </section>
  );
}

export default Education;