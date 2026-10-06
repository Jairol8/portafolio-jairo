import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { signIn } from "../../services/auth";

import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      await signIn(email.trim(), password);
      navigate("/admin");
    } catch {
      setError("Correo o contraseña incorrectos. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login">
      <div className="admin-login__background" aria-hidden="true" />

      <section className="admin-login__card" aria-labelledby="admin-login-title">
        <div className="admin-login__icon" aria-hidden="true">
          <ShieldCheck size={24} />
        </div>

        <h1 id="admin-login-title">Panel de administración</h1>

        <p>
          Inicia sesión para gestionar tus proyectos, experiencia y contenido.
        </p>

        <form className="admin-login__form" onSubmit={handleSubmit}>
          <label>
            <span>Correo electrónico</span>

            <div className="admin-login__field">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="tu@email.com"
                autoComplete="email"
                required
                autoFocus
              />
            </div>
          </label>

          <label>
            <span>Contraseña</span>

            <div className="admin-login__field admin-login__field--password">
              <LockKeyhole size={17} aria-hidden="true" />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="admin-login__toggle"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          {error && (
            <div className="admin-login__error" role="alert">
              <AlertCircle size={17} aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="admin-login__submit"
            disabled={loading}
            aria-busy={loading}
          >
            <span>{loading ? "Iniciando sesión…" : "Entrar al panel"}</span>

            {loading ? (
              <span className="admin-login__spinner" aria-hidden="true" />
            ) : (
              <ArrowRight size={18} aria-hidden="true" />
            )}
          </button>
        </form>

        <div className="admin-login__footer">
          <span>Acceso privado</span>
          <span>Jairo Santiago</span>
        </div>
      </section>
    </main>
  );
}

export default AdminLogin;