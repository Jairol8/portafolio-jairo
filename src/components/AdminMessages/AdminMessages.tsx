import { useEffect, useState } from "react";

import {
  Bell,
  Check,
  Eye,
  EyeOff,
  Mail,
  Trash2,
} from "lucide-react";

import {
  deleteMessage,
  getMessages,
  markMessageAsRead,
  type Message,
} from "../../services/messages";

import "./AdminMessages.css";

function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadMessages() {
    try {
      setLoading(true);
      setError("");

      const data = await getMessages();

      setMessages(data);
    } catch (loadError) {
      console.error(
        "Error al cargar mensajes:",
        loadError,
      );

      setError(
        "No se pudieron cargar los mensajes.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);
  const unreadMessages = messages.filter(
  (message) => !message.read,
);

const readMessages = messages.filter(
  (message) => message.read,
);

  async function toggleRead(message: Message) {
    try {
      setError("");

      await markMessageAsRead(
        message.id,
        !message.read,
      );

      await loadMessages();
    } catch (updateError) {
      console.error(
        "Error al actualizar mensaje:",
        updateError,
      );

      setError(
        "No se pudo actualizar el estado del mensaje.",
      );
    }
  }

  async function handleDelete(message: Message) {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar el mensaje de "${message.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteMessage(message.id);

      await loadMessages();
    } catch (deleteError) {
      console.error(
        "Error al eliminar mensaje:",
        deleteError,
      );

      setError(
        "No se pudo eliminar el mensaje.",
      );
    }
  }
  function getReasonLabel(reason: string | null) {
  if (reason === "empleo") {
    return "Oportunidad profesional";
  }

  if (reason === "proyecto") {
    return "Proyecto digital";
  }

  if (reason === "colaboracion") {
    return "Colaboración";
  }

  return "No especificado";
}

function getAreaLabel(area: string | null) {
  if (area === "programacion") {
    return "Programación";
  }

  if (area === "diseno") {
    return "Diseño";
  }

  if (area === "marketing") {
    return "Marketing Digital";
  }

  if (area === "otro") {
    return "Otro";
  }

  return "No especificada";
}

  function formatDate(date: string) {
    return new Intl.DateTimeFormat(
      "es-MX",
      {
        dateStyle: "medium",
        timeStyle: "short",
      },
    ).format(new Date(date));
  }

  return (
    <section className="admin-messages">
      <header className="admin-messages__header">
        <div>
          <span className="admin-messages__eyebrow">
            CONTACTO
          </span>

          <h1>
            Mensajes de contacto
          </h1>

          <p>
            Aquí aparecerán los mensajes enviados
            desde tu portafolio.
          </p>
        </div>

        <div
  className={`admin-messages__counter${
    unreadMessages.length > 0
      ? " admin-messages__counter--active"
      : ""
  }`}
>
  <Bell
    size={18}
    aria-hidden="true"
  />

  <div>
    <strong>
      {unreadMessages.length}
    </strong>

    <span>
      {unreadMessages.length === 1
        ? "mensaje nuevo"
        : "mensajes nuevos"}
    </span>
  </div>
</div>
      </header>

      {error && (
        <div className="admin-messages__error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="admin-messages__empty">
          Cargando mensajes...
        </div>
      ) : messages.length === 0 ? (
        <div className="admin-messages__empty">
          <Mail
            size={38}
            aria-hidden="true"
          />

          <h2>
            No hay mensajes todavía
          </h2>

          <p>
            Cuando alguien utilice el formulario
            de contacto de tu portafolio, sus
            mensajes aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="admin-messages__groups">
  {/* =========================================
      NUEVOS
  ========================================= */}

  {unreadMessages.length > 0 && (
    <section className="admin-messages__group">
      <div className="admin-messages__group-header">
        <div>
          <span className="admin-messages__group-eyebrow">
            BANDEJA DE ENTRADA
          </span>

          <h2>
            Nuevos
          </h2>
        </div>

        <span className="admin-messages__group-count admin-messages__group-count--new">
          {unreadMessages.length}
        </span>
      </div>

      <div className="admin-messages__list">
        {unreadMessages.map((message) => (
          <article
            key={message.id}
            className="admin-messages__card admin-messages__card--unread"
          >
            <div className="admin-messages__indicator">
              <span />
            </div>

            <div className="admin-messages__content">
              <div className="admin-messages__top">
                <div>
                  <span className="admin-messages__date">
                    {formatDate(message.created_at)}
                  </span>

                  <h2>
                    {message.subject}
                  </h2>

                  <div className="admin-messages__sender">
                    <strong>
                      {message.name}
                    </strong>

                    <a
                      href={`mailto:${message.email}`}
                    >
                      {message.email}
                    </a>
                  </div>

                  <div className="admin-messages__details">
                    <div className="admin-messages__detail">
                      <span>Motivo</span>

                      <strong>
                        {getReasonLabel(
                          message.reason,
                        )}
                      </strong>
                    </div>

                    <div className="admin-messages__detail">
                      <span>Área</span>

                      <strong>
                        {getAreaLabel(
                          message.area,
                        )}
                      </strong>
                    </div>

                    <div className="admin-messages__detail">
                      <span>Empresa</span>

                      <strong>
                        {message.company?.trim()
                          ? message.company
                          : "No especificada"}
                      </strong>
                    </div>
                  </div>
                </div>

                <span className="admin-messages__status is-unread">
                  <Mail
                    size={14}
                    aria-hidden="true"
                  />
                  Nuevo
                </span>
              </div>

              <div className="admin-messages__message-wrapper">
                <span className="admin-messages__message-label">
                  Mensaje
                </span>

                <p className="admin-messages__message">
                  {message.message}
                </p>
              </div>

              <div className="admin-messages__actions">
                <button
                  type="button"
                  onClick={() =>
                    toggleRead(message)
                  }
                >
                  <Eye
                    size={16}
                    aria-hidden="true"
                  />

                  Marcar como leído
                </button>

                <button
                  type="button"
                  className="is-danger"
                  onClick={() =>
                    handleDelete(message)
                  }
                >
                  <Trash2
                    size={16}
                    aria-hidden="true"
                  />

                  Eliminar
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )}

  {/* =========================================
      LEÍDOS
  ========================================= */}

  {readMessages.length > 0 && (
    <section className="admin-messages__group admin-messages__group--read">
      <div className="admin-messages__group-header">
        <div>
          <span className="admin-messages__group-eyebrow">
            HISTORIAL
          </span>

          <h2>
            Leídos
          </h2>
        </div>

        <span className="admin-messages__group-count">
          {readMessages.length}
        </span>
      </div>

      <div className="admin-messages__list">
        {readMessages.map((message) => (
          <article
            key={message.id}
            className="admin-messages__card"
          >
            <div className="admin-messages__indicator"></div>

            <div className="admin-messages__content">
              <div className="admin-messages__top">
                <div>
                  <span className="admin-messages__date">
                    {formatDate(message.created_at)}
                  </span>

                  <h2>
                    {message.subject}
                  </h2>

                  <div className="admin-messages__sender">
                    <strong>
                      {message.name}
                    </strong>

                    <a
                      href={`mailto:${message.email}`}
                    >
                      {message.email}
                    </a>
                  </div>

                  <div className="admin-messages__details">
                    <div className="admin-messages__detail">
                      <span>Motivo</span>

                      <strong>
                        {getReasonLabel(
                          message.reason,
                        )}
                      </strong>
                    </div>

                    <div className="admin-messages__detail">
                      <span>Área</span>

                      <strong>
                        {getAreaLabel(
                          message.area,
                        )}
                      </strong>
                    </div>

                    <div className="admin-messages__detail">
                      <span>Empresa</span>

                      <strong>
                        {message.company?.trim()
                          ? message.company
                          : "No especificada"}
                      </strong>
                    </div>
                  </div>
                </div>

                <span className="admin-messages__status is-read">
                  <Check
                    size={14}
                    aria-hidden="true"
                  />

                  Leído
                </span>
              </div>

              <div className="admin-messages__message-wrapper">
                <span className="admin-messages__message-label">
                  Mensaje
                </span>

                <p className="admin-messages__message">
                  {message.message}
                </p>
              </div>

              <div className="admin-messages__actions">
                <button
                  type="button"
                  onClick={() =>
                    toggleRead(message)
                  }
                >
                  <EyeOff
                    size={16}
                    aria-hidden="true"
                  />

                  Marcar como no leído
                </button>

                <button
                  type="button"
                  className="is-danger"
                  onClick={() =>
                    handleDelete(message)
                  }
                >
                  <Trash2
                    size={16}
                    aria-hidden="true"
                  />

                  Eliminar
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )}

  {messages.length === 0 && (
    <div className="admin-messages__empty">
      <Mail
        size={38}
        aria-hidden="true"
      />

      <h2>
        No hay mensajes todavía
      </h2>

      <p>
        Cuando alguien utilice el formulario
        de contacto de tu portafolio, sus
        mensajes aparecerán aquí.
      </p>
    </div>
  )}
</div>
      )}
    </section>
  );
}

export default AdminMessages;