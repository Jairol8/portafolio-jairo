import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

import { getCurrentSession } from "../../services/auth";

function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] =
    useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const session = await getCurrentSession();

        setAuthenticated(Boolean(session));
      } catch {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#080b12",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        Verificando sesión...
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;