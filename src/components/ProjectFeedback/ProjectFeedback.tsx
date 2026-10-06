import {
  Heart,
  ThumbsDown,
  Sparkles,
} from "lucide-react";

import { useEffect, useState } from "react";

import "./ProjectFeedback.css";

type Vote = "like" | "dislike" | null;

type ProjectFeedbackProps = {
  projectId: string;
};

type VoteData = {
  likes: number;
  dislikes: number;
};

function getStorageKey(projectId: string) {
  return `portfolio-project-feedback-${projectId}`;
}

function getVoteKey(projectId: string) {
  return `portfolio-project-vote-${projectId}`;
}

function ProjectFeedback({
  projectId,
}: ProjectFeedbackProps) {
  const [vote, setVote] = useState<Vote>(null);

  const [counts, setCounts] = useState<VoteData>({
    likes: 0,
    dislikes: 0,
  });

  useEffect(() => {
    try {
      const savedCounts = localStorage.getItem(
        getStorageKey(projectId),
      );

      const savedVote = localStorage.getItem(
        getVoteKey(projectId),
      ) as Vote | null;

      if (savedCounts) {
        const parsedCounts = JSON.parse(
          savedCounts,
        ) as VoteData;

        setCounts({
          likes: Number(parsedCounts.likes) || 0,
          dislikes: Number(parsedCounts.dislikes) || 0,
        });
      }

      if (
        savedVote === "like" ||
        savedVote === "dislike"
      ) {
        setVote(savedVote);
      }
    } catch {
      setCounts({
        likes: 0,
        dislikes: 0,
      });

      setVote(null);
    }
  }, [projectId]);

  function saveCounts(nextCounts: VoteData) {
    setCounts(nextCounts);

    localStorage.setItem(
      getStorageKey(projectId),
      JSON.stringify(nextCounts),
    );
  }

  function saveVote(nextVote: Vote) {
    if (nextVote) {
      localStorage.setItem(
        getVoteKey(projectId),
        nextVote,
      );
    } else {
      localStorage.removeItem(
        getVoteKey(projectId),
      );
    }

    setVote(nextVote);
  }

  function handleVote(nextVote: "like" | "dislike") {
    /*
     * Si vuelve a presionar el mismo voto,
     * quitamos su voto.
     */
    if (vote === nextVote) {
      const nextCounts = {
        ...counts,
        [nextVote === "like"
          ? "likes"
          : "dislikes"]:
          Math.max(
            0,
            counts[
              nextVote === "like"
                ? "likes"
                : "dislikes"
            ] - 1,
          ),
      };

      saveCounts(nextCounts);
      saveVote(null);

      return;
    }

    /*
     * Si cambia de voto, primero quitamos
     * el anterior y después agregamos el nuevo.
     */
    const nextCounts = {
      likes:
        counts.likes +
        (nextVote === "like" ? 1 : 0) -
        (vote === "like" ? 1 : 0),

      dislikes:
        counts.dislikes +
        (nextVote === "dislike" ? 1 : 0) -
        (vote === "dislike" ? 1 : 0),
    };

    saveCounts({
      likes: Math.max(0, nextCounts.likes),
      dislikes: Math.max(0, nextCounts.dislikes),
    });

    saveVote(nextVote);
  }

  return (
    <section className="project-feedback">
      <div className="project-feedback__glow" />

      <div className="project-feedback__content">
        <div className="project-feedback__icon">
          <Sparkles size={18} />
        </div>

        <div className="project-feedback__heading">
          <span className="project-feedback__label">
            TU OPINIÓN
          </span>

          <h2>
            ¿Qué te pareció
            <br />
            este proyecto?
          </h2>

          <p>
            Tu opinión ayuda a conocer qué proyectos
            generan mayor interés.
          </p>
        </div>

        <div className="project-feedback__actions">
          <button
            type="button"
            className={`project-feedback__button ${
              vote === "like"
                ? "project-feedback__button--active-like"
                : ""
            }`}
            onClick={() => handleVote("like")}
            aria-pressed={vote === "like"}
          >
            <span className="project-feedback__button-icon">
              <Heart
                size={21}
                fill={
                  vote === "like"
                    ? "currentColor"
                    : "none"
                }
              />
            </span>

            <span className="project-feedback__button-text">
              <strong>Me gustó</strong>
              <small>
                {counts.likes}{" "}
                {counts.likes === 1
                  ? "persona"
                  : "personas"}
              </small>
            </span>
          </button>

          <button
            type="button"
            className={`project-feedback__button ${
              vote === "dislike"
                ? "project-feedback__button--active-dislike"
                : ""
            }`}
            onClick={() => handleVote("dislike")}
            aria-pressed={vote === "dislike"}
          >
            <span className="project-feedback__button-icon">
              <ThumbsDown
                size={20}
                fill={
                  vote === "dislike"
                    ? "currentColor"
                    : "none"
                }
              />
            </span>

            <span className="project-feedback__button-text">
              <strong>No es para mí</strong>
              <small>
                {counts.dislikes}{" "}
                {counts.dislikes === 1
                  ? "persona"
                  : "personas"}
              </small>
            </span>
          </button>
        </div>

        {vote && (
          <p className="project-feedback__message">
            {vote === "like"
              ? "¡Gracias por tu opinión! ❤️"
              : "Gracias por tu opinión. Me ayuda a mejorar."}
          </p>
        )}
      </div>
    </section>
  );
}

export default ProjectFeedback;