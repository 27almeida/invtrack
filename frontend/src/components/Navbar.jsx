import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ modoEscuro, toggleModo }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login", { replace: true });
  };

  const S = {
    nav: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "60px",
      padding: "0 1.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: modoEscuro ? "#1f1f2e" : "#f0f0f5",
      color: modoEscuro ? "#eee" : "#111",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      zIndex: 1000,
    },
    left: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    },
    link: (active) => ({
      textDecoration: "none",
      color: active
        ? (modoEscuro ? "#82cfff" : "#0062cc")
        : (modoEscuro ? "#ccc" : "#333"),
      fontWeight: active ? 600 : 500,
      display: "flex",
      alignItems: "center",
      gap: "0.3rem",
      fontSize: "1rem",
    }),
    right: {
      display: "flex",
      alignItems: "center",
      gap: "0.8rem",
    },
    btn: {
      padding: "0.4rem 0.8rem",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontWeight: 500,
      fontSize: "0.9rem",
      transition: "background .2s",
    },
    light: {
      background: "#ffd33d",
      color: "#111",
    },
    dark: {
      background: "#555",
      color: "#fff",
    },
    logout: {
      background: "#dc3545",
      color: "#fff",
    },
  };

  return (
    <nav style={S.nav}>
      <div style={S.left}>
        <Link to="/" style={S.link(location.pathname === "/")}>
          <span>🏠</span> Inventário
        </Link>
        <Link to="/critico" style={S.link(location.pathname === "/critico")}>
          <span>⚠️</span> Produtos Pendentes
        </Link>
        <Link
          to="/historico"
          style={S.link(location.pathname === "/historico")}
        >
          <span>📜</span> Histórico
        </Link>
      </div>

      <div style={S.right}>
        <button
          onClick={toggleModo}
          style={{
            ...S.btn,
            ...(modoEscuro ? S.light : S.dark),
          }}
        >
          {modoEscuro ? "☀️ Claro" : "🌙 Escuro"}
        </button>

        <button onClick={handleLogout} style={{ ...S.btn, ...S.logout }}>
          🔒 Logout
        </button>
      </div>
    </nav>
  );
}
