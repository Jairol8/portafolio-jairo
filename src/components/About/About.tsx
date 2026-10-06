import { ArrowUpRight, Code2, Palette, TrendingUp } from "lucide-react";
import "./About.css";

const profileAreas = [
  {
    icon: Code2,
    title: "Programación",
    text: "Desarrollo de aplicaciones y sitios web con tecnologías modernas.",
  },
  {
    icon: Palette,
    title: "Diseño",
    text: "Diseño visual y creación de contenido digital enfocado en comunicación.",
  },
  {
    icon: TrendingUp,
    title: "Marketing Digital",
    text: "Contenido, estrategia digital y análisis de resultados para marcas.",
  },
];

function About() {
  return (
    <section className="about" id="sobre-mi">
      <div className="about__header">
        <div>
          <p className="section-label">Sobre mí</p>

          <h2 className="about__title">
            Tecnología, creatividad
            <span>y estrategia digital.</span>
          </h2>
        </div>

        <p className="about__intro">
          Mi perfil combina diferentes áreas del entorno digital para
          desarrollar proyectos donde la tecnología, el diseño y la
          comunicación trabajan juntos.
        </p>
      </div>

      <div className="about__content">
        <div className="about__text">
          <p>
            Soy Jairo Santiago Rodriguez Jauregui , estudiante de Ingeniería en Entornos Virtuales
            y Negocios Digitales. Mi formación me ha permitido explorar
            diferentes áreas relacionadas con el desarrollo web, el diseño
            digital y el marketing.
          </p>

          <p>
            Me interesa crear soluciones digitales que no solamente funcionen,
            sino que también tengan una presentación clara y una experiencia
            agradable para las personas que las utilizan.
          </p>

          <a href="#areas" className="about__link">
            Explorar mis áreas
            <ArrowUpRight size={17} />
          </a>
        </div>

        <div className="about__areas">
          {profileAreas.map((area) => {
            const Icon = area.icon;

            return (
              <article className="about__area" key={area.title}>
                <div className="about__area-icon">
                  <Icon size={20} strokeWidth={1.8} />
                </div>

                <div>
                  <h3>{area.title}</h3>
                  <p>{area.text}</p>
                </div>

                <ArrowUpRight
                  className="about__area-arrow"
                  size={18}
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default About;