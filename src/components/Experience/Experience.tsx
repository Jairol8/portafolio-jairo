import { useEffect, useState } from "react";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
} from "lucide-react";

import { getExperiences } from "../../services/experiences";

import type { Experience as ExperienceData } from "../../types/experience";

import "./Experience.css";

function Experience() {
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExperiences() {
      try {
        const data = await getExperiences();
        setExperiences(data);
      } catch (error) {
        console.error(
          "Error al cargar las experiencias:",
          error,
        );
      } finally {
        setLoading(false);
      }
    }

    loadExperiences();
  }, []);

  const visibleExperiences = experiences
    .filter((experience) => experience.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section className="experience" id="experiencia">
      <div className="experience__container">
        {/* HEADER */}
        <header className="experience__header">
          <div className="experience__heading">
            <div className="experience__eyebrow">
              <span></span>

              <p className="section-label">
                Experiencia profesional
              </p>
            </div>

            <h2 className="experience__title">
              Experiencia que
              <span>conecta disciplinas.</span>
            </h2>
          </div>

          <p className="experience__intro">
            Proyectos y experiencias profesionales donde he aplicado
            conocimientos de tecnología, diseño y comunicación digital.
          </p>
        </header>

        {/* LOADING */}
        {loading && (
          <div className="experience__loading">
            Cargando experiencia...
          </div>
        )}

        {/* EXPERIENCES */}
        {!loading && (
          <div className="experience__timeline">
            {visibleExperiences.map((experience, index) => (
              <article
                className={`experience__item experience__item--${experience.color}`}
                key={experience.id}
              >
                {/* NUMBER */}
                <div className="experience__number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* TIMELINE */}
                <div className="experience__line">
                  <span></span>
                </div>

                {/* CARD */}
                <div className="experience__card">
                  {/* TOP */}
                  <div className="experience__top">
                    <div className="experience__company-block">
                      <div className="experience__logo">
                        {experience.logoSvg ? (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: experience.logoSvg,
                            }}
                          />
                        ) : (
                          <BriefcaseBusiness
                            size={26}
                            strokeWidth={1.6}
                            aria-hidden="true"
                          />
                        )}
                      </div>

                      <div>
                        <p className="experience__company">
                          {experience.company}
                        </p>

                        <span className="experience__company-type">
                          Experiencia profesional
                        </span>
                      </div>
                    </div>

                    <div className="experience__period">
                      <CalendarDays size={15} />

                      <span>{experience.period}</span>
                    </div>
                  </div>

                  {/* BODY */}
                  <div className="experience__body">
                    <div className="experience__role">
                      <BriefcaseBusiness
                        size={18}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />

                      <h3>{experience.role}</h3>
                    </div>

                    <p className="experience__description">
                      {experience.description}
                    </p>

                    {/* TOOLS */}
                    <div className="experience__tags">
                      {experience.tools
                        .filter((tool) => tool.active)
                        .sort(
                          (a, b) => a.sortOrder - b.sortOrder,
                        )
                        .map((tool) => (
                          <span key={tool.id}>
                            {tool.iconSvg ? (
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: tool.iconSvg,
                                }}
                              />
                            ) : (
                              <span
                                className="experience__tag-fallback"
                                aria-hidden="true"
                              />
                            )}

                            <span className="experience__tag-name">
                              {tool.name}
                            </span>
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* BOTTOM */}
        <div className="experience__bottom">
          <p>
            También puedes conocer más sobre los proyectos en los que he
            participado.
          </p>

          <a
            href="#proyectos"
            className="experience__link"
          >
            Ver proyectos

            <ArrowUpRight
              size={17}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </section>
  );
}

export default Experience;