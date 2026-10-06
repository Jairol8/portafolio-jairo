import {
  ArrowRight,
  Sparkles,
} from "lucide-react";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero__content">
        <div className="hero__label">
          <span className="hero__label-dot"></span>
          Perfil multidisciplinario digital
        </div>

        <p className="hero__eyebrow">
          Desarrollo web · Diseño · Marketing Digital
        </p>

        <h1 className="hero__title">
          Hola, soy <span>Jairo Santiago.</span>
        </h1>

        <p className="hero__description">
          Ingeniero en Entornos Virtuales y Negocios Digitales enfocado en
          crear experiencias y soluciones digitales que combinan{" "}
          <strong>tecnología, diseño y estrategia.</strong>
        </p>

        <div className="hero__actions">
          <a href="#proyectos" className="hero__button hero__button--primary">
            Ver mis proyectos
            <ArrowRight size={18} />
          </a>

        </div>

        <div className="hero__availability">
          <span className="hero__status"></span>

          <div>
            <strong>Abierto a nuevas oportunidades</strong>
            <span>
              Proyectos · Colaboraciones · Oportunidades profesionales
            </span>
          </div>
        </div>
      </div>

      <div className="hero__visual" aria-hidden="true">
        <div className="hero__glow"></div>

        <div className="hero__card">
          <div className="hero__card-top">
            <div className="hero__window-controls">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <span className="hero__card-title">
              digital-profile.tsx
            </span>

            <Sparkles size={15} />
          </div>

          <div className="hero__card-content">
            <div className="hero__code-comment">
              // creando experiencias digitales
            </div>

            <div className="hero__code-line hero__code-line--short"></div>
            <div className="hero__code-line"></div>
            <div className="hero__code-line hero__code-line--medium"></div>

            <div className="hero__code-space"></div>

            <div className="hero__code-comment">
              // tecnología + creatividad
            </div>

            <div className="hero__code-line"></div>
            <div className="hero__code-line hero__code-line--short"></div>
            <div className="hero__code-line hero__code-line--medium"></div>
          </div>

          <div className="hero__card-footer">
            <span>React</span>
            <span>Design</span>
            <span>Strategy</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

