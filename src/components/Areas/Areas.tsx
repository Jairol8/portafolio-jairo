import {
  ArrowUpRight,
  Check,
} from "lucide-react";

import { areas } from "../../data/areas";
import type { AreaTool } from "../../types/area";

import "./Areas.css";

/* =========================================
   TECHNOLOGY LOGO
========================================= */

function ToolLogo({
  tool,
}: {
  tool: AreaTool;
}) {
  if (tool.icon) {
    const Icon = tool.icon;

    return (
      <Icon
        width={17}
        height={17}
        aria-hidden="true"
      />
    );
  }

  /*
   * Futuro:
   *
   * if (tool.iconSvg) {
   *   return (
   *     <span
   *       dangerouslySetInnerHTML={{
   *         __html: tool.iconSvg,
   *       }}
   *     />
   *   );
   * }
   *
   * El SVG deberá estar sanitizado antes
   * de almacenarse/renderizarse.
   */

  return (
    <Check
      size={13}
      strokeWidth={2}
      aria-hidden="true"
    />
  );
}

/* =========================================
   COMPONENT
========================================= */

function Areas() {
  const visibleAreas = areas
    .filter((area) => area.visible)
    .sort(
      (a, b) =>
        a.sortOrder - b.sortOrder,
    );

  return (
    <section
      className="areas"
      id="areas"
    >
      <div className="areas__container">
        {/* HEADER */}

        <div className="areas__header">
          <div className="areas__header-left">
            <div className="areas__eyebrow">
              <span></span>

              <p className="section-label">
                Áreas de trabajo
              </p>
            </div>

            <h2 className="areas__title">
              Tres áreas,
              <span>
                una visión digital.
              </span>
            </h2>
          </div>

          <div className="areas__header-right">
            <p className="areas__intro">
              Mi perfil combina desarrollo,
              diseño y marketing digital para
              participar en proyectos desde
              diferentes perspectivas.
            </p>

            <div className="areas__meta">
              <span>
                {visibleAreas.length
                  .toString()
                  .padStart(2, "0")}
              </span>

              <small>
                Áreas de especialidad
              </small>
            </div>
          </div>
        </div>

        {/* GRID */}

        <div className="areas__grid">
          {visibleAreas.map((area) => {
            const AreaIcon = area.icon;

            const activeTools = area.tools
              .filter(
                (tool) => tool.active,
              )
              .sort(
                (a, b) =>
                  a.sortOrder -
                  b.sortOrder,
              );

            return (
              <article
                className={`area-card area-card--${area.color}`}
                key={area.id}
              >
                {/* TOP */}

                <div className="area-card__top">
                  <span className="area-card__number">
                    {area.number}
                  </span>

                  <div className="area-card__icon">
                    <AreaIcon
                      width={25}
                      height={25}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* CONTENT */}

                <div className="area-card__content">
                  <p className="area-card__subtitle">
                    {area.subtitle}
                  </p>

                  <h3>
                    {area.title}
                  </h3>

                  <p className="area-card__description">
                    {area.description}
                  </p>
                </div>

                {/* TECHNOLOGIES */}

                <div className="area-card__tools">
                  <div className="area-card__tools-header">
                    <p>
                      Tecnologías y herramientas
                    </p>

                    <span>
                      {activeTools.length
                        .toString()
                        .padStart(2, "0")}
                    </span>
                  </div>

                  <div className="area-card__tool-list">
                    {activeTools.map(
                      (tool) => (
                        <span
                          className="area-card__tool"
                          key={tool.id}
                        >
                          <span className="area-card__tool-icon">
                            <ToolLogo
                              tool={tool}
                            />
                          </span>

                          <span>
                            {tool.name}
                          </span>
                        </span>
                      ),
                    )}
                  </div>
                </div>

                {/* FOOTER */}

                <div className="area-card__footer">
                  <span className="area-card__footer-label">
                    Área {area.number}
                  </span>

                  <a
                    href={area.link}
                    className="area-card__link"
                  >
                    <span>
                      Ver proyectos
                    </span>

                    <ArrowUpRight
                      size={17}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* BOTTOM */}

        <div className="areas__bottom">
          <span>
            Programación
          </span>

          <i></i>

          <span>
            Diseño
          </span>

          <i></i>

          <span>
            Marketing Digital
          </span>

          <p>
            Un perfil multidisciplinario
            para proyectos digitales.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Areas;