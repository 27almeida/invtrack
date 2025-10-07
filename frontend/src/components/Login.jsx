import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg =
          data.detail ||
          Object.values(data).flat().join(" • ") ||
          "Erro ao iniciar sessão.";
        throw new Error(msg);
      }
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#121212",
      padding: "2rem",
    },
    form: {
      background: "#1e1e1e",
      padding: "2rem",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
      width: "100%",
      maxWidth: "360px",
      color: "#eee",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    title: {
      textAlign: "center",
      marginBottom: "1rem",
      color: "#fff",
    },
    alert: {
      background: "#b71c1c",
      color: "#fff",
      padding: "0.75rem",
      borderRadius: "4px",
      textAlign: "center",
    },
    input: {
      padding: "0.6rem",
      borderRadius: "4px",
      border: "1px solid #444",
      background: "#2e2e2e",
      color: "#fff",
      fontSize: "1rem",
    },
    button: {
      padding: "0.75rem",
      border: "none",
      borderRadius: "4px",
      background: "#2196f3",
      color: "#fff",
      fontWeight: "bold",
      fontSize: "1rem",
      cursor: "pointer",
      marginTop: "0.5rem",
    },
    footerText: {
      textAlign: "center",
      color: "#aaa",
      marginTop: "1rem",
      fontSize: "0.9rem",
    },
    link: {
      color: "#82cfff",
      textDecoration: "none",
      fontWeight: "500",
    },
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Iniciar Sessão</h2>

        {error && <div style={styles.alert}>❌ {error}</div>}

        <input
          type="text"
          placeholder="Nome de utilizador"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Palavra-passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button}>
          Entrar
        </button>

        <p style={styles.footerText}>
          Ainda não tens conta?{" "}
          <Link to="/register" style={styles.link}>
            Regista-te
          </Link>
        </p>
      </form>
      <footer style={{
  textAlign: 'center',
  color: '#ccc',
  marginTop: '1rem',
  fontSize: '0.85rem',
  position: 'absolute',
  bottom: '1rem',
  width: '100%'
}}>
  © 2024-2025 | Fábio Almeida – 2022291 | Projeto Académico – ISTEC Lisboa
</footer>
    </div>
    
    
  );
}
