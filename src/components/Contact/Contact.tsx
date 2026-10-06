import { useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  Handshake,
  Mail,
  Rocket,
  Send,
  Sparkles,
} from "lucide-react";

import { createMessage } from "../../services/messages";

import "./Contact.css";

type ContactReason =
  | "empleo"
  | "proyecto"
  | "colaboracion"
  | "";

function Contact() {
  const [reason, setReason] = useState<ContactReason>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [showSendAnimation, setShowSendAnimation] =
  useState(false);

  function getSubject() {
    if (reason === "empleo") {
      return "Oportunidad profesional";
    }

    if (reason === "proyecto") {
      return "Proyecto digital";
    }

    if (reason === "colaboracion") {
      return "Colaboración";
    }

    return "Contacto desde portafolio";
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!reason) {
      setSubmitStatus("error");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitStatus("idle");

      const formData = new FormData(event.currentTarget);

      const name = String(
        formData.get("name") ?? "",
      );

      const email = String(
        formData.get("email") ?? "",
      );

      const company = String(
        formData.get("company") ?? "",
      );

      const area = String(
        formData.get("area") ?? "",
      );

      const message = String(
        formData.get("message") ?? "",
      );

      const form = event.currentTarget;

await createMessage({
  name,
  email,
  company,
  area,
  reason,
  subject: getSubject(),
  message,
});

form.reset();
setReason("");
setSubmitStatus("success");
setShowSendAnimation(true);

window.setTimeout(() => {
  setShowSendAnimation(false);
}, 2400);
    } catch (error) {
      console.error(
        "Error al enviar mensaje:",
        error,
      );

      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="contact" id="contacto">
      <div className="contact__container">
        {/* =========================================
            HEADER
        ========================================= */}

        <div className="contact__header">
          <div className="contact__eyebrow">
            <span className="contact__eyebrow-line"></span>
            <p className="section-label">Contacto</p>
          </div>

          <div className="contact__heading">
            <h2 className="contact__title">
              ¿Tienes un proyecto
              <span>o una oportunidad?</span>
            </h2>

            <p className="contact__intro">
              Si buscas talento para tu equipo, tienes un proyecto en mente o
              quieres colaborar, cuéntame qué necesitas. Podemos comenzar con
              una conversación.
            </p>
          </div>
        </div>

        {/* =========================================
            CONTACT CONTENT
        ========================================= */}

        <div className="contact__content">
          {/* =========================================
              LEFT
          ========================================= */}

          <aside className="contact__info">
            <div className="contact__info-main">
              <span className="contact__mini-label">
                Trabajemos juntos
              </span>

              <h3>
                Tecnología,
                <br />
                diseño y estrategia.
              </h3>

              <p>
                Mi perfil combina desarrollo web, diseño digital y marketing.
                Esto me permite participar tanto en la creación de productos
                digitales como en proyectos de comunicación y estrategia.
              </p>
            </div>

            <div className="contact__opportunities">
              <div className="contact__opportunity">
                <div className="contact__opportunity-icon contact__opportunity-icon--blue">
                  <BriefcaseBusiness size={17} />
                </div>

                <div>
                  <strong>Oportunidades profesionales</strong>
                  <span>Incorporarme a un equipo o proyecto.</span>
                </div>
              </div>

              <div className="contact__opportunity">
                <div className="contact__opportunity-icon contact__opportunity-icon--orange">
                  <Rocket size={17} />
                </div>

                <div>
                  <strong>Proyectos digitales</strong>
                  <span>Desarrollo, diseño o estrategia.</span>
                </div>
              </div>

              <div className="contact__opportunity">
                <div className="contact__opportunity-icon contact__opportunity-icon--violet">
                  <Handshake size={17} />
                </div>

                <div>
                  <strong>Colaboraciones</strong>
                  <span>Crear algo juntos.</span>
                </div>
              </div>
            </div>

            <div className="contact__availability">
              <span className="contact__availability-dot"></span>

              <div>
                <strong>Abierto a nuevas oportunidades</strong>
                <p>
                  Proyectos · Colaboraciones · Oportunidades profesionales
                </p>
              </div>
            </div>
          </aside>

          {/* =========================================
              FORM
          ========================================= */}

          <div className="contact__form-wrapper">
            <div className="contact__form-top">
              <div>
                <span className="contact__mini-label">
                  01 / Iniciar conversación
                </span>

                <h3>¿Qué tienes en mente?</h3>
              </div>

              <div className="contact__form-icon">
                <Sparkles size={19} />
              </div>
            </div>

            {/* =========================================
                REASON SELECTOR
            ========================================= */}

            <div className="contact__reason">
              <p className="contact__reason-label">
                Me interesa...
              </p>

              <div className="contact__reason-options">
                <button
                  type="button"
                  className={`contact__reason-option ${
                    reason === "empleo"
                      ? "contact__reason-option--active"
                      : ""
                  }`}
                  onClick={() => {
                    setReason("empleo");
                    setSubmitStatus("idle");
                    setShowSendAnimation(false);
                  }}
                >
                  <span className="contact__reason-icon">
                    <BriefcaseBusiness size={17} />
                  </span>

                  <span>
                    <strong>Contratarte</strong>
                    <small>Oportunidad profesional</small>
                  </span>

                  <span className="contact__reason-check">
                    {reason === "empleo" && <Check size={13} />}
                  </span>
                </button>

                <button
                  type="button"
                  className={`contact__reason-option ${
                    reason === "proyecto"
                      ? "contact__reason-option--active"
                      : ""
                  }`}
                  onClick={() => {
                    setReason("proyecto");
                    setSubmitStatus("idle");
                     setShowSendAnimation(false);
                  }}
                >
                  <span className="contact__reason-icon">
                    <Rocket size={17} />
                  </span>

                  <span>
                    <strong>Tengo un proyecto</strong>
                    <small>Desarrollo o solución digital</small>
                  </span>

                  <span className="contact__reason-check">
                    {reason === "proyecto" && <Check size={13} />}
                  </span>
                </button>

                <button
                  type="button"
                  className={`contact__reason-option ${
                    reason === "colaboracion"
                      ? "contact__reason-option--active"
                      : ""
                  }`}
                  onClick={() => {
                    setReason("colaboracion");
                    setSubmitStatus("idle");
                     setShowSendAnimation(false);
                  }}
                >
                  <span className="contact__reason-icon">
                    <Handshake size={17} />
                  </span>

                  <span>
                    <strong>Quiero colaborar</strong>
                    <small>Crear algo juntos</small>
                  </span>

                  <span className="contact__reason-check">
                    {reason === "colaboracion" && <Check size={13} />}
                  </span>
                </button>
              </div>
            </div>

            <form
              className="contact__form"
              onSubmit={handleSubmit}
            >
              <div className="contact__fields">
                <label className="contact__field">
                  <span>
                    Nombre
                    <small>*</small>
                  </span>

                  <input
                    type="text"
                    name="name"
                    placeholder="Tu nombre"
                    autoComplete="name"
                    required
                  />
                </label>

                <label className="contact__field">
                  <span>
                    Email
                    <small>*</small>
                  </span>

                  <input
                    type="email"
                    name="email"
                    placeholder="tu@email.com"
                    autoComplete="email"
                    required
                  />
                </label>
              </div>

              <div className="contact__fields">
                <label className="contact__field">
                  <span>
                    Empresa <em>Opcional</em>
                  </span>

                  <input
                    type="text"
                    name="company"
                    placeholder="Nombre de tu empresa"
                    autoComplete="organization"
                  />
                </label>

                <label className="contact__field">
                  <span>
                    Área de interés
                    <small>*</small>
                  </span>

                  <select
                    name="area"
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      Selecciona un área
                    </option>

                    <option value="programacion">
                      Programación
                    </option>

                    <option value="diseno">
                      Diseño
                    </option>

                    <option value="marketing">
                      Marketing Digital
                    </option>

                    <option value="otro">
                      Otro
                    </option>
                  </select>
                </label>
              </div>

              <label className="contact__field">
                <span>
                  Mensaje
                  <small>*</small>
                </span>

                <textarea
                  name="message"
                  rows={5}
                  placeholder={
                    reason === "empleo"
                      ? "Cuéntame sobre la oportunidad, puesto o equipo..."
                      : reason === "proyecto"
                        ? "Cuéntame qué quieres desarrollar o qué problema necesitas resolver..."
                        : reason === "colaboracion"
                          ? "Cuéntame qué tienes en mente y cómo te gustaría colaborar..."
                          : "Cuéntame brevemente qué tienes en mente..."
                  }
                  required
                />
              </label>
              {showSendAnimation && (
  <div
    className="contact__send-animation"
    aria-hidden="true"
  >
    <div className="contact__send-scene">
      <div className="contact__send-mail">
        <Mail size={22} />
      </div>

      <div className="contact__send-trail"></div>

      <div className="contact__send-inbox">
        <span className="contact__send-inbox-top"></span>
        <span className="contact__send-inbox-body">
          <Mail size={18} />
        </span>
      </div>

      <div className="contact__send-check">
        <Check size={13} />
      </div>
    </div>
  </div>
)}

              {submitStatus === "success" && (
                <div className="contact__form-success">
                  ¡Mensaje enviado correctamente! Gracias por
                  contactarme.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="contact__form-error">
                  {reason
                    ? "No se pudo enviar el mensaje. Inténtalo nuevamente."
                    : "Selecciona primero qué te interesa para poder enviar el mensaje."}
                </div>
              )}

              <div className="contact__form-footer">
                <div className="contact__form-note">
                  <span></span>

                  <p>
                    ¿No tienes todo definido? No pasa nada.
                    <strong> Cuéntame tu idea.</strong>
                  </p>
                </div>

                <button
                  type="submit"
                  className="contact__submit"
                  disabled={isSubmitting}
                >
                  <span>
                    {isSubmitting
                      ? "Enviando..."
                      : "Iniciar conversación"}
                  </span>

                  <span className="contact__submit-icon">
                    <Send size={16} />
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* =========================================
            BOTTOM
        ========================================= */}

        <div className="contact__bottom">
          <div className="contact__bottom-line"></div>

          <p>¿Quieres conocer primero mi trabajo?</p>

          <a href="#proyectos">
            Explorar proyectos
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

export default Contact;